export type TimerState = 'idle' | 'running' | 'paused';
export type SessionType = 'focus' | 'shortBreak' | 'longBreak';

export interface FocusSession {
  id: string;
  intent: string;
  duration: number; // in seconds
  completedAt: string; // ISO string
  type: SessionType;
}

export interface Settings {
  focusDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
}
