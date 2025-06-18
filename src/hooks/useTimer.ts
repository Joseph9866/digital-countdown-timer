import { useState, useEffect, useRef, useCallback } from 'react';

export interface TimerState {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  isRunning: boolean;
  isFinished: boolean;
  totalMs: number;
  remainingMs: number;
}

export const useTimer = () => {
  const [state, setState] = useState<TimerState>({
    hours: 0,
    minutes: 5,
    seconds: 0,
    milliseconds: 0,
    isRunning: false,
    isFinished: false,
    totalMs: 300000, // 5 minutes default
    remainingMs: 300000,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  const updateTimer = useCallback(() => {
    const now = Date.now();
    const elapsed = now - startTimeRef.current;
    const remaining = Math.max(0, pausedTimeRef.current - elapsed);
    
    if (remaining <= 0) {
      setState(prev => ({
        ...prev,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        isRunning: false,
        isFinished: true,
        remainingMs: 0,
      }));
      return;
    }

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    const milliseconds = remaining % 1000;

    setState(prev => ({
      ...prev,
      hours,
      minutes,
      seconds,
      milliseconds,
      remainingMs: remaining,
    }));
  }, []);

  const startTimer = useCallback(() => {
    if (state.remainingMs <= 0) return;
    
    startTimeRef.current = Date.now();
    pausedTimeRef.current = state.remainingMs;
    
    setState(prev => ({ ...prev, isRunning: true, isFinished: false }));
    
    intervalRef.current = setInterval(updateTimer, 10); // Update every 10ms for smooth animation
  }, [state.remainingMs, updateTimer]);

  const pauseTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState(prev => ({ ...prev, isRunning: false }));
  }, []);

  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    const totalMs = state.totalMs;
    const hours = Math.floor(totalMs / (1000 * 60 * 60));
    const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((totalMs % (1000 * 60)) / 1000);
    const milliseconds = totalMs % 1000;

    setState(prev => ({
      ...prev,
      hours,
      minutes,
      seconds,
      milliseconds,
      isRunning: false,
      isFinished: false,
      remainingMs: totalMs,
    }));
  }, [state.totalMs]);

  const setDuration = useCallback((hours: number, minutes: number, seconds: number) => {
    const totalMs = (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
    
    setState(prev => ({
      ...prev,
      hours,
      minutes,
      seconds,
      milliseconds: 0,
      totalMs,
      remainingMs: totalMs,
      isRunning: false,
      isFinished: false,
    }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Handle timer completion
  useEffect(() => {
    if (state.isFinished && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [state.isFinished]);

  return {
    ...state,
    startTimer,
    pauseTimer,
    resetTimer,
    setDuration,
  };
};