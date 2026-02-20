import React, { useEffect } from 'react';
import { Play, Pause, Square, SkipForward } from 'lucide-react';
import { TimerState, SessionType } from '../types';
import { motion } from 'motion/react';

interface TimerProps {
  state: TimerState;
  type: SessionType;
  timeLeft: number;
  intent: string;
  setIntent: (intent: string) => void;
  start: () => void;
  pause: () => void;
  stop: () => void;
  skip: () => void;
  totalDuration: number; // in seconds
}

export function Timer({
  state,
  type,
  timeLeft,
  intent,
  setIntent,
  start,
  pause,
  stop,
  skip,
  totalDuration
}: TimerProps) {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (state === 'running') {
      document.title = `${formatTime(timeLeft)} - ${type === 'focus' ? 'Focus' : 'Break'}`;
    } else {
      document.title = 'Focus Session';
    }
    return () => {
      document.title = 'Focus Session';
    };
  }, [timeLeft, state, type]);

  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

  const isFocus = type === 'focus';
  const label = isFocus ? 'Focus Session' : type === 'shortBreak' ? 'Short Break' : 'Long Break';

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
      <div className="mb-6 text-sm font-medium tracking-widest text-gray-400 uppercase">
        {label}
      </div>

      {isFocus && state === 'idle' ? (
        <input
          type="text"
          placeholder="What are you focusing on?"
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          className="w-full text-center text-xl font-medium text-gray-800 bg-transparent border-b-2 border-gray-200 focus:border-gray-800 outline-none pb-2 mb-8 transition-colors placeholder:text-gray-300"
        />
      ) : (
        <div className="w-full text-center text-xl font-medium text-gray-800 pb-2 mb-8 min-h-[40px]">
          {isFocus ? intent || 'Deep Work' : 'Take a breather'}
        </div>
      )}

      <div className="relative w-64 h-64 mb-10 flex items-center justify-center">
        {/* Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="4"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke={isFocus ? '#111827' : '#10b981'}
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ strokeDasharray: '301.59', strokeDashoffset: '301.59' }}
            animate={{ strokeDashoffset: 301.59 - (progress / 100) * 301.59 }}
            transition={{ duration: 0.5, ease: "linear" }}
          />
        </svg>

        <div className="timer-display text-6xl font-light text-gray-900 z-10">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex items-center gap-6">
        {state === 'running' ? (
          <button
            onClick={pause}
            className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors"
          >
            <Pause size={24} fill="currentColor" />
          </button>
        ) : (
          <button
            onClick={start}
            className={`w-16 h-16 flex items-center justify-center rounded-full text-white transition-colors shadow-md ${
              isFocus ? 'bg-gray-900 hover:bg-gray-800' : 'bg-emerald-500 hover:bg-emerald-600'
            }`}
          >
            <Play size={24} fill="currentColor" className="ml-1" />
          </button>
        )}

        {(state === 'running' || state === 'paused') && (
          <button
            onClick={stop}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
          >
            <Square size={18} fill="currentColor" />
          </button>
        )}

        {state === 'running' && !isFocus && (
          <button
            onClick={skip}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
          >
            <SkipForward size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
