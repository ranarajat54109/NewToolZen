'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCw, Maximize, Minimize } from 'lucide-react';
import { motion } from 'framer-motion';

const PRESET_TIMES = [
  { label: '5 Minutes', value: 5 * 60 },
  { label: '10 Minutes', value: 10 * 60 },
  { label: '15 Minutes', value: 15 * 60 },
  { label: '20 Minutes', value: 20 * 60 },
  { label: '25 Minutes', value: 25 * 60 },
  { label: '30 Minutes', value: 30 * 60 },
  { label: '45 Minutes', value: 45 * 60 },
  { label: '60 Minutes', value: 60 * 60 },
];

export default function BreakTimer() {
  const [selectedDuration, setSelectedDuration] = useState<number>(PRESET_TIMES[0].value);
  const [timeLeft, setTimeLeft] = useState<number>(PRESET_TIMES[0].value);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle Fullscreen polyfill / native API
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            // TODO: Play sound here
            // const audio = new Audio('/alert.mp3');
            // audio.play();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  // Reset timer when duration changes
  useEffect(() => {
    setTimeLeft(selectedDuration);
    setIsRunning(false);
  }, [selectedDuration]);

  const toggleTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(selectedDuration);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(selectedDuration);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((selectedDuration - timeLeft) / selectedDuration) * 100;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Break Timer</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Set a countdown timer for your break and stay focused.</p>
        </div>

        <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 lg:p-8 shadow-sm">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Select Duration:</label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(Number(e.target.value))}
                disabled={isRunning}
                className="w-full md:max-w-xs px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white cursor-pointer disabled:opacity-50"
              >
                {PRESET_TIMES.map((preset) => (
                  <option key={preset.value} value={preset.value}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </div>

            <div
              ref={containerRef}
              className={`flex flex-col items-center justify-center p-8 rounded-3xl transition-all duration-300 ${
                isFullscreen ? 'bg-slate-950 h-screen w-screen fixed inset-0 z-50 text-white' : 'bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 min-h-[400px]'
              }`}
            >
              <div className="relative flex items-center justify-center">
                {/* Circular Progress Background */}
                <svg className="transform -rotate-90 w-72 h-72 lg:w-96 lg:h-96" viewBox="0 0 280 280">
                  <circle
                    cx="140"
                    cy="140"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-slate-200 dark:text-slate-800"
                  />
                  <circle
                    cx="140"
                    cy="140"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className={`${timeLeft === 0 ? 'text-red-500' : 'text-indigo-500'} transition-all duration-1000 ease-linear`}
                  />
                </svg>

                {/* Time Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <motion.div
                    initial={false}
                    animate={{ scale: timeLeft === 0 ? [1, 1.1, 1] : 1 }}
                    transition={{ repeat: timeLeft === 0 ? Infinity : 0, duration: 1 }}
                    className={`text-6xl lg:text-8xl font-bold tracking-tighter ${
                      timeLeft === 0 ? 'text-red-500' : (isFullscreen ? 'text-white' : 'text-slate-900 dark:text-white')
                    }`}
                  >
                    {formatTime(timeLeft)}
                  </motion.div>
                  {timeLeft === 0 && (
                    <p className="mt-4 text-lg font-medium text-red-500 uppercase tracking-widest animate-pulse">
                      Time's Up!
                    </p>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className={`flex items-center gap-4 mt-12 ${isFullscreen ? 'scale-125' : ''}`}>
                <button
                  onClick={toggleTimer}
                  className="p-4 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transition-all focus:ring-4 focus:ring-indigo-500/30 active:scale-95"
                  title={isRunning ? "Pause" : "Start"}
                >
                  {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </button>

                <button
                  onClick={resetTimer}
                  className="p-4 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all focus:ring-4 focus:ring-slate-500/30 active:scale-95"
                  title="Reset"
                >
                  <RotateCw className="w-6 h-6" />
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="p-4 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all focus:ring-4 focus:ring-slate-500/30 active:scale-95"
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-16 max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-4 text-slate-900 dark:text-white">
          Break Timer – Online Countdown Timer for Work and Study Breaks
        </h2>

        <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
          Stay productive and maintain a healthy workflow with this free 
          <strong> Break Timer</strong>. Whether you are working, studying, coding, 
          gaming, or exercising, this online countdown timer helps you schedule 
          focused work sessions and short breaks efficiently.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Why Use a Break Timer?
        </h3>

        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          Taking regular breaks improves concentration, reduces mental fatigue, 
          and increases productivity. A structured timer helps you manage your 
          workflow more effectively while avoiding burnout during long sessions.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Features of This Online Break Timer
        </h3>

        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
          <li>Simple and distraction-free countdown timer</li>
          <li>Choose different break durations instantly</li>
          <li>Perfect for Pomodoro and productivity workflows</li>
          <li>Runs directly in your browser with no installation</li>
          <li>Responsive design for desktop and mobile devices</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Best Use Cases
        </h3>

        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          This <strong>online break timer</strong> is useful for students, remote 
          workers, developers, office employees, and anyone who wants to improve 
          focus while maintaining balanced work habits.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          How to Use the Timer
        </h3>

        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          Select your preferred break duration and start the countdown. Once the 
          timer finishes, you can return to work feeling refreshed and more focused.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Improve Productivity with Better Time Management
        </h3>

        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          Using a productivity timer can help you organize tasks, improve work-life 
          balance, and maintain consistent focus throughout the day. Short scheduled 
          breaks are proven to support better mental performance and efficiency.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Start Your Break Timer Now
        </h3>

        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          Use this free countdown break timer to stay productive, focused, and 
          energized during work or study sessions.
        </p>
      </section>
    </>

  );
}
