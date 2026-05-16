'use client';

/**
 * Tiny drop-in replacement for the subset of `framer-motion` this project uses.
 *
 * Why this exists: framer-motion (~110KB) was statically imported in 25 pages
 * just for fade / slide-in / hover-lift effects, so it sat in the shared graph
 * and every route paid for it (slow dev compile + large client bundles on weak
 * machines). This shim reproduces the exact effects in use with the native
 * Web Animations API — zero dependencies, a few hundred bytes.
 *
 * Supported API (everything actually used in the codebase):
 *   <motion.X initial={obj|false} animate={obj} transition={{delay,duration,repeat}}
 *             whileHover={obj}> ... </motion.X>
 *   <AnimatePresence> ... </AnimatePresence>
 *
 * Animatable values: opacity, x, y, scale, rotate. `animate` values may be a
 * keyframe array (e.g. scale: [1, 1.1, 1]) including infinite `repeat`.
 *
 * Behavior note: AnimatePresence is a passthrough — enter animations are fully
 * preserved; `exit` animations are dropped (elements unmount immediately
 * instead of animating out). This is the only intentional visual difference
 * and it does not affect functionality, layout, routing, or state.
 */

import React, {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';

type AnimVal = number | number[];
type AnimObject = Record<string, AnimVal | string | undefined>;

const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/** Build a CSS style object for one animation state (single, non-array values). */
function toStyle(v?: AnimObject | false): CSSProperties {
  if (!v || typeof v !== 'object') return {};
  const s: CSSProperties = {};
  const tf: string[] = [];
  for (const [k, raw] of Object.entries(v)) {
    const val = Array.isArray(raw) ? raw[0] : raw;
    if (val === undefined) continue;
    switch (k) {
      case 'opacity':
        s.opacity = val as number;
        break;
      case 'x':
        tf.push(`translateX(${typeof val === 'number' ? `${val}px` : val})`);
        break;
      case 'y':
        tf.push(`translateY(${typeof val === 'number' ? `${val}px` : val})`);
        break;
      case 'scale':
        tf.push(`scale(${val})`);
        break;
      case 'rotate':
        tf.push(`rotate(${typeof val === 'number' ? `${val}deg` : val})`);
        break;
      // height/overflow only appear inside AnimatePresence exit (dropped) — ignore.
    }
  }
  if (tf.length) s.transform = tf.join(' ');
  return s;
}

/** Number of keyframe steps implied by an animate object (arrays => N steps). */
function stepCount(animate?: AnimObject): number {
  let n = 2;
  if (!animate) return n;
  for (const val of Object.values(animate)) {
    if (Array.isArray(val)) n = Math.max(n, val.length);
  }
  return n;
}

/** Build WAAPI keyframes from initial -> animate (handles keyframe arrays). */
function buildKeyframes(
  initial: AnimObject | false | undefined,
  animate: AnimObject,
): Keyframe[] {
  const hasArray = Object.values(animate).some((v) => Array.isArray(v));

  if (hasArray) {
    const steps = stepCount(animate);
    const frames: Keyframe[] = [];
    for (let i = 0; i < steps; i++) {
      const frameObj: AnimObject = {};
      for (const [k, val] of Object.entries(animate)) {
        if (Array.isArray(val)) {
          frameObj[k] = val[Math.min(i, val.length - 1)];
        } else {
          frameObj[k] = val;
        }
      }
      frames.push(styleToKeyframe(toStyle(frameObj)));
    }
    return frames;
  }

  const from = initial
    ? styleToKeyframe(toStyle(initial))
    : styleToKeyframe(toStyle(animate));
  const to = styleToKeyframe(toStyle(animate));
  return [from, to];
}

function styleToKeyframe(s: CSSProperties): Keyframe {
  const kf: Keyframe = {};
  if (s.opacity !== undefined) kf.opacity = s.opacity as number;
  if (s.transform !== undefined) kf.transform = s.transform as string;
  return kf;
}

type MotionProps = {
  initial?: AnimObject | false;
  animate?: AnimObject;
  transition?: { delay?: number; duration?: number; repeat?: number };
  whileHover?: AnimObject;
  exit?: AnimObject; // accepted for API compat; intentionally unused
  style?: CSSProperties;
  children?: React.ReactNode;
} & Record<string, unknown>;

function createMotionComponent(Tag: string) {
  const Comp = forwardRef<HTMLElement, MotionProps>(function MotionComp(
    props,
    ref,
  ) {
    const {
      initial: rInitial,
      animate: rAnimate,
      transition: rTransition,
      whileHover: rWhileHover,
      exit: _exit,
      style: rStyle,
      children,
      ...rest
    } = props;

    // The `& Record<string, unknown>` index signature widens explicit props to
    // `unknown`; normalize back to their real shapes once, here.
    const initial = rInitial as AnimObject | false | undefined;
    const animate = rAnimate as AnimObject | undefined;
    const whileHover = rWhileHover as AnimObject | undefined;
    const style = rStyle as CSSProperties | undefined;
    const t = (rTransition ?? {}) as {
      delay?: number;
      duration?: number;
      repeat?: number;
    };

    const innerRef = useRef<HTMLElement | null>(null);
    const [hovered, setHovered] = useState(false);
    const [started, setStarted] = useState(false);

    useIsoLayoutEffect(() => {
      const el = innerRef.current;
      if (!el || !animate) return;

      const hasArray = Object.values(animate).some((v) => Array.isArray(v));
      // Nothing to animate on mount: initial===false and no keyframe arrays.
      if (initial === false && !hasArray) {
        setStarted(true);
        return;
      }

      const repeat = t.repeat;
      const anim = el.animate(buildKeyframes(initial, animate), {
        duration: (t.duration ?? 0.3) * 1000,
        delay: (t.delay ?? 0) * 1000,
        easing: 'ease',
        iterations:
          repeat === Infinity ? Infinity : repeat ? repeat + 1 : 1,
        fill: 'none', // revert to React-controlled resting style (== final state)
      });
      setStarted(true);
      return () => {
        try {
          anim.cancel();
        } catch {
          /* noop */
        }
      };
      // Run once on mount, mirroring framer-motion's default mount animation.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Resting style = final `animate` state, so once the WAAPI animation ends
    // (fill: none) the element snaps to exactly the same values — no flash.
    // Before the animation starts, render the `initial` state to avoid a
    // first-paint flash (same as framer-motion).
    const restingStyle: CSSProperties =
      !started && initial ? toStyle(initial) : toStyle(animate);

    const hoverStyle =
      hovered && whileHover ? toStyle(whileHover) : undefined;

    // Merge transforms/opacity from resting + hover into one declaration.
    const merged: CSSProperties = {
      ...restingStyle,
      transition: whileHover
        ? 'transform 0.2s ease, opacity 0.2s ease'
        : undefined,
      ...style,
      ...hoverStyle,
    };

    const hoverHandlers = whileHover
      ? {
          onMouseEnter: () => setHovered(true),
          onMouseLeave: () => setHovered(false),
        }
      : {};

    return React.createElement(
      Tag,
      {
        ref: (node: HTMLElement | null) => {
          innerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref)
            (ref as React.MutableRefObject<HTMLElement | null>).current = node;
        },
        style: merged,
        ...hoverHandlers,
        ...rest,
      },
      children as React.ReactNode,
    );
  });
  Comp.displayName = `motion.${Tag}`;
  return Comp;
}

type MotionFactory = {
  [tag: string]: ReturnType<typeof createMotionComponent>;
};

const cache: MotionFactory = {};

export const motion: MotionFactory = new Proxy(cache, {
  get(target, prop: string) {
    if (!target[prop]) target[prop] = createMotionComponent(prop);
    return target[prop];
  },
});

/** Passthrough: enter animations preserved, exit animations dropped (safe). */
export function AnimatePresence({
  children,
}: {
  children?: React.ReactNode;
  mode?: string;
  initial?: boolean;
}) {
  return <>{children}</>;
}
