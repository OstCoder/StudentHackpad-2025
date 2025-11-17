import { useState, useEffect, useRef } from 'react';

export const usePomodoro = (initialMinutes: number = 25) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const tabLeftTimeRef = useRef<number | null>(null);
  
  // Tab visibility detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden
        if (isRunning) {
          tabLeftTimeRef.current = Date.now();
        }
      } else {
        // Tab is visible again
        if (tabLeftTimeRef.current && isRunning) {
          const elapsedSeconds = Math.floor((Date.now() - tabLeftTimeRef.current) / 1000);
          
          if (elapsedSeconds > 120) {
            // More than 2 minutes - stop the timer
            setIsRunning(false);
            setIsPaused(true);
          }
          // else: within 2 minutes - timer continues (was just paused)
          
          tabLeftTimeRef.current = null;
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isRunning]);
  
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);
  
  const start = () => {
    setIsRunning(true);
    setIsPaused(false);
  };
  
  const pause = () => {
    setIsRunning(false);
    setIsPaused(true);
  };
  
  const reset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(initialMinutes * 60);
  };
  
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return {
    timeLeft,
    isRunning,
    isPaused,
    start,
    pause,
    reset,
    formatTime,
  };
};
