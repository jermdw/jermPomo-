import { useState, useEffect, useCallback, useRef } from 'react';
import { TimerState, SessionType, FocusSession, Settings } from '../types';

export function useTimer(settings: Settings, onSessionComplete: (session: FocusSession) => void) {
  const [state, setState] = useState<TimerState>('idle');
  const [type, setType] = useState<SessionType>('focus');
  const [timeLeft, setTimeLeft] = useState(settings.focusDuration * 60);
  const [intent, setIntent] = useState('');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const endTimeRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  // Update time left when settings change, if idle
  useEffect(() => {
    if (state === 'idle') {
      if (type === 'focus') setTimeLeft(settings.focusDuration * 60);
      else if (type === 'shortBreak') setTimeLeft(settings.shortBreakDuration * 60);
      else if (type === 'longBreak') setTimeLeft(settings.longBreakDuration * 60);
    }
  }, [settings, type, state]);

  const tick = useCallback(() => {
    if (!endTimeRef.current) return;
    const now = Date.now();
    const remaining = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000));
    setTimeLeft(remaining);

    if (remaining === 0) {
      handleComplete();
    }
  }, []);

  useEffect(() => {
    if (state === 'running') {
      timerRef.current = window.setInterval(tick, 200);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state, tick]);

  const handleComplete = useCallback(() => {
    setState('idle');
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Save session
    const duration = type === 'focus' ? settings.focusDuration * 60 : 
                     type === 'shortBreak' ? settings.shortBreakDuration * 60 : 
                     settings.longBreakDuration * 60;

    const session: FocusSession = {
      id: crypto.randomUUID(),
      intent: type === 'focus' ? (intent || 'Focused work') : 'Break',
      duration,
      completedAt: new Date().toISOString(),
      type,
    };
    onSessionComplete(session);

    // Transition to next state
    if (type === 'focus') {
      const newCompleted = sessionsCompleted + 1;
      setSessionsCompleted(newCompleted);
      if (newCompleted % settings.sessionsUntilLongBreak === 0) {
        setType('longBreak');
        setTimeLeft(settings.longBreakDuration * 60);
      } else {
        setType('shortBreak');
        setTimeLeft(settings.shortBreakDuration * 60);
      }
    } else {
      setType('focus');
      setTimeLeft(settings.focusDuration * 60);
      setIntent('');
    }
  }, [type, intent, settings, sessionsCompleted, onSessionComplete]);

  const start = () => {
    if (state === 'idle' || state === 'paused') {
      endTimeRef.current = Date.now() + timeLeft * 1000;
      setState('running');
    }
  };

  const pause = () => {
    if (state === 'running') {
      setState('paused');
      endTimeRef.current = null;
    }
  };

  const stop = () => {
    setState('idle');
    endTimeRef.current = null;
    if (type === 'focus') setTimeLeft(settings.focusDuration * 60);
    else if (type === 'shortBreak') setTimeLeft(settings.shortBreakDuration * 60);
    else if (type === 'longBreak') setTimeLeft(settings.longBreakDuration * 60);
  };

  const skip = () => {
    handleComplete();
  };

  return {
    state,
    type,
    timeLeft,
    intent,
    setIntent,
    start,
    pause,
    stop,
    skip,
    sessionsCompleted
  };
}
