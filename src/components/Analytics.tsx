import React from 'react';
import { FocusSession, Settings } from '../types';
import { Clock, CheckCircle2, Flame, Target } from 'lucide-react';

interface AnalyticsProps {
  sessions: FocusSession[];
  settings: Settings;
}

export function Analytics({ sessions, settings }: AnalyticsProps) {
  const focusSessions = sessions.filter(s => s.type === 'focus');
  const totalFocusTime = focusSessions.reduce((acc, s) => acc + s.duration, 0);
  
  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const today = new Date().toDateString();
  const todaySessions = focusSessions.filter(s => new Date(s.completedAt).toDateString() === today);
  const todayFocusTime = todaySessions.reduce((acc, s) => acc + s.duration, 0);
  
  const goalInSeconds = settings.dailyGoal * 3600;
  const progressPercent = Math.min(100, (todayFocusTime / goalInSeconds) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-zinc-100">Analytics</h2>
      </div>

      {/* Daily Goal Progress */}
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">Daily Goal</h3>
              <p className="text-sm text-gray-500 dark:text-zinc-500">You've focused for {formatDuration(todayFocusTime)} today</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-zinc-100">{Math.round(progressPercent)}%</div>
            <div className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">of {settings.dailyGoal}h goal</div>
          </div>
        </div>
        
        <div className="w-full h-3 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col items-center justify-center transition-colors">
          <Clock className="w-8 h-8 text-indigo-500 mb-3" />
          <div className="text-3xl font-light text-gray-900 dark:text-zinc-100">{formatDuration(totalFocusTime)}</div>
          <div className="text-sm font-medium text-gray-500 dark:text-zinc-500 uppercase tracking-wider mt-1">Total Focus</div>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col items-center justify-center transition-colors">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-3" />
          <div className="text-3xl font-light text-gray-900 dark:text-zinc-100">{focusSessions.length}</div>
          <div className="text-sm font-medium text-gray-500 dark:text-zinc-500 uppercase tracking-wider mt-1">Sessions</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col items-center justify-center transition-colors">
          <Flame className="w-8 h-8 text-orange-500 mb-3" />
          <div className="text-3xl font-light text-gray-900 dark:text-zinc-100">{todaySessions.length}</div>
          <div className="text-sm font-medium text-gray-500 dark:text-zinc-500 uppercase tracking-wider mt-1">Today</div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden transition-colors">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-zinc-800">
          <h3 className="text-lg font-medium text-gray-900 dark:text-zinc-100">Recent Sessions</h3>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-zinc-800">
          {focusSessions.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-zinc-500">
              No sessions completed yet. Start focusing!
            </div>
          ) : (
            focusSessions.slice().reverse().map((session) => (
              <div key={session.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div>
                  <div className="font-medium text-gray-900 dark:text-zinc-100">{session.intent || 'Deep Work'}</div>
                  <div className="text-sm text-gray-500 dark:text-zinc-500 mt-1">
                    {new Date(session.completedAt).toLocaleDateString(undefined, { 
                      weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' 
                    })}
                  </div>
                </div>
                <div className="text-gray-900 dark:text-zinc-100 font-mono bg-gray-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-sm">
                  {Math.round(session.duration / 60)}m
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
