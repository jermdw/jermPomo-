import React from 'react';
import { FocusSession } from '../types';
import { Clock, CheckCircle2, Flame } from 'lucide-react';

interface AnalyticsProps {
  sessions: FocusSession[];
}

export function Analytics({ sessions }: AnalyticsProps) {
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

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Analytics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <Clock className="w-8 h-8 text-indigo-500 mb-3" />
          <div className="text-3xl font-light text-gray-900">{formatDuration(totalFocusTime)}</div>
          <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-1">Total Focus</div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-3" />
          <div className="text-3xl font-light text-gray-900">{focusSessions.length}</div>
          <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-1">Sessions</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <Flame className="w-8 h-8 text-orange-500 mb-3" />
          <div className="text-3xl font-light text-gray-900">{todaySessions.length}</div>
          <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-1">Today</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">Recent Sessions</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {focusSessions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No sessions completed yet. Start focusing!
            </div>
          ) : (
            focusSessions.slice().reverse().map((session) => (
              <div key={session.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <div className="font-medium text-gray-900">{session.intent || 'Deep Work'}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {new Date(session.completedAt).toLocaleDateString(undefined, { 
                      weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' 
                    })}
                  </div>
                </div>
                <div className="text-gray-900 font-mono bg-gray-100 px-3 py-1 rounded-full text-sm">
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
