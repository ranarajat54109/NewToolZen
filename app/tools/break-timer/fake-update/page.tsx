'use client';

import { useState, useEffect, useRef } from 'react';
import { MonitorPlay, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OS_STYLES = [
  { id: 'win11', name: 'Windows 11 Update' },
  { id: 'win10', name: 'Windows 10 Update' },
  { id: 'bsod', name: 'Blue Screen of Death (BSOD)' },
];

const PRESET_TIMES = [
  { label: '5 Minutes', value: 5 * 60 },
  { label: '10 Minutes', value: 10 * 60 },
  { label: '15 Minutes', value: 15 * 60 },
  { label: '30 Minutes', value: 30 * 60 },
  { label: '60 Minutes', value: 60 * 60 },
];

export default function FakeUpdateScreen() {
  const [selectedOS, setSelectedOS] = useState<string>(OS_STYLES[0].id);
  const [selectedDuration, setSelectedDuration] = useState<number>(PRESET_TIMES[0].value);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Fullscreen effect when starting
  useEffect(() => {
    if (isRunning && containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
      }
    } else if (!isRunning && document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => console.error(err));
      }
    }
  }, [isRunning]);

  // Handle escape key from native fullscreen exit
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isRunning) {
        setIsRunning(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isRunning]);

  // Progress logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      setProgress(0);
      const updateInterval = 1000; // Update every second
      const incrementPerSecond = 100 / selectedDuration;

      interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + incrementPerSecond;
          if (next >= 100) {
            clearInterval(interval);
            return 100;
          }
          return next;
        });
      }, updateInterval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, selectedDuration]);

  const startFakeUpdate = () => {
    setIsRunning(true);
  };

  const stopFakeUpdate = () => {
    setIsRunning(false);
  };

  // OS Specific Overlays
  const renderUpdateOverlay = () => {
    const roundedProgress = Math.floor(progress);

    if (selectedOS === 'win11') {
      return (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center text-white cursor-none select-none">
          <div className="flex flex-col items-center max-w-lg text-center space-y-6">
            <div className="relative w-16 h-16 animate-spin">
              {/* Windows 11 Spinner Approximation */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-blue-500 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * 60}deg) translate(0, -20px)`,
                    opacity: 1 - i * 0.15,
                  }}
                />
              ))}
            </div>
            <div className="space-y-2 mt-8 text-xl font-light">
              <p>Working on updates {roundedProgress}% complete.</p>
              <p>Please keep your computer on.</p>
            </div>
            <p className="mt-auto absolute bottom-12 text-sm text-gray-400">
              Your PC might restart several times.
            </p>
          </div>
        </div>
      );
    }

    if (selectedOS === 'win10') {
      return (
        <div className="fixed inset-0 bg-[#0078D7] z-[100] flex flex-col items-center justify-center text-white cursor-none select-none">
          <div className="flex flex-col items-center max-w-lg text-center space-y-6">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <div className="space-y-2 mt-8 text-2xl font-light">
              <p>Working on updates</p>
              <p>{roundedProgress}% complete</p>
              <p>Don't turn off your PC. This will take a while.</p>
            </div>
            <p className="mt-auto absolute bottom-12 text-sm text-blue-200">
              Your PC will restart several times.
            </p>
          </div>
        </div>
      );
    }

    if (selectedOS === 'bsod') {
      // Simplified BSOD fake progress
      return (
        <div className="fixed inset-0 bg-[#0079d5] z-[100] flex flex-col items-start justify-center p-16 lg:p-32 text-white cursor-none select-none font-sans">
          <div className="text-[120px] leading-none mb-8">:(</div>
          <div className="text-2xl lg:text-3xl font-light mb-8 max-w-4xl leading-tight">
            Your PC ran into a problem and needs to restart. We're just collecting some error info, and then we'll restart for you.
          </div>
          <div className="text-xl lg:text-2xl font-light mb-8">
            {roundedProgress}% complete
          </div>
          <div className="mt-8 flex gap-8">
            <div className="w-24 h-24 bg-white p-2">
              {/* Fake QR code visualization */}
              <div className="w-full h-full bg-[#0079d5]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, white 25%, transparent 25%, transparent 75%, white 75%, white), repeating-linear-gradient(45deg, white 25%, #0079d5 25%, #0079d5 75%, white 75%, white)', backgroundPosition: '0 0, 4px 4px', backgroundSize: '8px 8px' }}></div>
            </div>
            <div className="text-sm space-y-2 flex flex-col justify-end">
              <p>For more information about this issue and possible fixes, visit https://www.windows.com/stopcode</p>
              <p>If you call a support person, give them this info:</p>
              <p>Stop code: CRITICAL_PROCESS_DIED</p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Fake Update Screen</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Play a harmless prank or use it to enforce a break. It's safe and doesn't actually block your computer.</p>
        </div>

        <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 lg:p-8 shadow-sm">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Style / OS Theme:</label>
                <select
                  value={selectedOS}
                  onChange={(e) => setSelectedOS(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white cursor-pointer"
                >
                  {OS_STYLES.map((os) => (
                    <option key={os.id} value={os.id}>
                      {os.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Duration:</label>
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white cursor-pointer"
                >
                  {PRESET_TIMES.map((preset) => (
                    <option key={preset.value} value={preset.value}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={startFakeUpdate}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-sm focus:ring-2 focus:ring-indigo-500 flex items-center justify-center gap-2"
              >
                <MonitorPlay className="h-5 w-5" />
                Start Fake Update
              </button>
              <p className="text-sm text-slate-500 flex items-center mt-2 md:mt-0 md:ml-2">
                Press <kbd className="mx-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs">Esc</kbd> to exit at any time.
              </p>
            </div>
          </div>
        </div>

        {/* The full-screen component wrapper */}
        <div ref={containerRef} className={isRunning ? "block" : "hidden"}>
          <AnimatePresence>
            {isRunning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {renderUpdateOverlay()}
                {/* Fallback exit button for touch / hidden cursor devices if they somehow can't press Esc */}
                <div className="fixed top-4 right-4 z-[110] opacity-0 hover:opacity-100 transition-opacity">
                   <button 
                    onClick={stopFakeUpdate}
                    className="p-2 bg-black/50 text-white rounded-md hover:bg-black/80"
                    title="Exit Fake Update"
                   >
                    <X className="w-6 h-6" />
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <section className="mt-16 max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-4 text-slate-900 dark:text-white">
          Fake Update Screen – Fun Fullscreen Prank Simulator
        </h2>

        <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
          Create a realistic-looking fake update screen for fun, entertainment, 
          or productivity breaks with this free <strong>Fake Update Screen</strong> tool. 
          Simulate operating system update screens inspired by popular desktop themes 
          and display them in fullscreen mode directly in your browser.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          What Is a Fake Update Screen?
        </h3>

        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          A fake update screen is a harmless fullscreen animation designed to look 
          like a computer system update. It is commonly used for lighthearted office 
          pranks, fun demonstrations, or temporary focus breaks without affecting 
          your actual device or files.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Features of This Tool
        </h3>

        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
          <li>Choose different operating system style themes</li>
          <li>Set custom countdown durations easily</li>
          <li>Fullscreen immersive fake update simulation</li>
          <li>Safe browser-based experience with no system changes</li>
          <li>Exit anytime using the Escape (Esc) key</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Fun and Safe to Use
        </h3>

        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          This <strong>fake Windows update simulator</strong> is designed purely for 
          entertainment and does not install software, lock your device, or modify 
          system settings. Everything runs safely inside your browser session.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Popular Use Cases
        </h3>

        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
          <li>Harmless office and classroom pranks</li>
          <li>Short productivity or screen breaks</li>
          <li>Funny content creation and streaming</li>
          <li>Demo environments and presentations</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          How to Start the Fake Update Screen
        </h3>

        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          Select your preferred update style and duration, then click the 
          <strong> Start Fake Update</strong> button. The simulation will open in 
          fullscreen mode and can be exited anytime using the Esc key.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Launch the Fake Update Simulator
        </h3>

        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          Try this free fake update prank tool for a fun and realistic fullscreen 
          update experience directly from your browser.
        </p>
      </section>
    </>

  );
}
