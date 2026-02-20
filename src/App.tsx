import React, { useState, useEffect } from 'react';
import { Timer } from './components/Timer';
import { Analytics } from './components/Analytics';
import { Settings as SettingsModal } from './components/Settings';
import { useTimer } from './hooks/useTimer';
import { FocusSession, Settings } from './types';
import { Settings as SettingsIcon, BarChart2, Timer as TimerIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DEFAULT_SETTINGS: Settings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
};

export default function App() {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('focus-settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [sessions, setSessions] = useState<FocusSession[]>(() => {
    const saved = localStorage.getItem('focus-sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState<'timer' | 'analytics'>('timer');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    localStorage.setItem('focus-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('focus-sessions', JSON.stringify(sessions));
  }, [sessions]);

  const handleSessionComplete = (session: FocusSession) => {
    setSessions(prev => [...prev, session]);
    
    // Request notification permission if not granted
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Show notification
    if (Notification.permission === 'granted') {
      new Notification('Session Complete', {
        body: session.type === 'focus' ? 'Great job! Time for a break.' : 'Break is over. Ready to focus?',
        icon: '/vite.svg'
      });
    }
  };

  const timer = useTimer(settings, handleSessionComplete);

  const totalDuration = timer.type === 'focus' ? settings.focusDuration * 60 :
                        timer.type === 'shortBreak' ? settings.shortBreakDuration * 60 :
                        settings.longBreakDuration * 60;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full max-w-4xl mx-auto p-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-900 font-semibold text-xl tracking-tight">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <TimerIcon className="text-white w-5 h-5" />
          </div>
          Focus Session
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-white rounded-full p-1 shadow-sm border border-gray-100 flex items-center">
            <button
              onClick={() => setActiveTab('timer')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'timer' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Timer
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'analytics' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Analytics
            </button>
          </div>
          
          <button
            onClick={() => setShowSettings(true)}
            className="p-2.5 rounded-full bg-white text-gray-500 hover:text-gray-900 shadow-sm border border-gray-100 transition-colors ml-2"
          >
            <SettingsIcon size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'timer' ? (
            <motion.div
              key="timer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <Timer
                state={timer.state}
                type={timer.type}
                timeLeft={timer.timeLeft}
                intent={timer.intent}
                setIntent={timer.setIntent}
                start={timer.start}
                pause={timer.pause}
                stop={timer.stop}
                skip={timer.skip}
                totalDuration={totalDuration}
              />
            </motion.div>
          ) : (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <Analytics sessions={sessions} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
