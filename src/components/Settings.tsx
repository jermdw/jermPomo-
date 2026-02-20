import React from 'react';
import { Settings as SettingsType } from '../types';

interface SettingsProps {
  settings: SettingsType;
  onSave: (settings: SettingsType) => void;
  onClose: () => void;
}

export function Settings({ settings, onSave, onClose }: SettingsProps) {
  const [localSettings, setLocalSettings] = React.useState(settings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Settings</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Focus Duration (minutes)</label>
            <input
              type="number"
              name="focusDuration"
              value={localSettings.focusDuration}
              onChange={handleChange}
              min="1"
              max="120"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Short Break (minutes)</label>
            <input
              type="number"
              name="shortBreakDuration"
              value={localSettings.shortBreakDuration}
              onChange={handleChange}
              min="1"
              max="30"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Long Break (minutes)</label>
            <input
              type="number"
              name="longBreakDuration"
              value={localSettings.longBreakDuration}
              onChange={handleChange}
              min="1"
              max="60"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sessions until Long Break</label>
            <input
              type="number"
              name="sessionsUntilLongBreak"
              value={localSettings.sessionsUntilLongBreak}
              onChange={handleChange}
              min="1"
              max="10"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
