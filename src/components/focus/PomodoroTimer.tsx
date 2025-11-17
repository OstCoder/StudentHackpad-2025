import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TimerState } from '@/types/studypulse';
import { storage } from '@/utils/storage';
import { toast } from 'sonner';

interface PomodoroTimerProps {
  onSessionComplete: (minutes: number) => void;
}

const fruitStages = ['🌱', '🌿', '🌳', '🍎', '✨'];
const stageLabels = ['Seed', 'Sprout', 'Plant', 'Fruit', 'Harvested!'];

export const PomodoroTimer = ({ onSessionComplete }: PomodoroTimerProps) => {
  const [customMinutes, setCustomMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [totalMinutes, setTotalMinutes] = useState(25);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [fruitStage, setFruitStage] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [showHarvest, setShowHarvest] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const leftAtRef = useRef<number | null>(null);

  // Load saved timer state on mount
  useEffect(() => {
    const savedState = storage.getTimerState();
    if (savedState) {
      setTimeLeft(savedState.timeLeft);
      setTotalMinutes(savedState.totalMinutes);
      setFruitStage(savedState.fruitStage);
      setIsPaused(savedState.isPaused);
      setCustomMinutes(savedState.totalMinutes);
    }
  }, []);

  // Save timer state whenever it changes
  useEffect(() => {
    if (isRunning || isPaused) {
      const state: TimerState = {
        timeLeft,
        isRunning,
        isPaused,
        totalMinutes,
        fruitStage,
      };
      storage.saveTimerState(state);
    }
  }, [timeLeft, isRunning, isPaused, totalMinutes, fruitStage]);

  // Tab visibility handling
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isRunning) {
        leftAtRef.current = Date.now();
      } else if (!document.hidden && leftAtRef.current) {
        const elapsed = Math.floor((Date.now() - leftAtRef.current) / 1000);
        
        if (elapsed > 120) {
          // More than 2 minutes - stop timer
          setIsRunning(false);
          setIsPaused(true);
          toast.info('Timer stopped - you were away for more than 2 minutes');
        }
        leftAtRef.current = null;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isRunning]);

  // Timer countdown
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          
          // Update fruit stage based on progress
          const progress = 1 - prev / (totalMinutes * 60);
          if (progress < 0.25) setFruitStage(0);
          else if (progress < 0.5) setFruitStage(1);
          else if (progress < 0.75) setFruitStage(2);
          else setFruitStage(3);
          
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, totalMinutes]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    setFruitStage(4);
    setShowHarvest(true);
    
    const breakCoins = Math.floor(totalMinutes / 5);
    onSessionComplete(totalMinutes);
    
    toast.success(`Session complete! Earned ${breakCoins} break coins! 🎉`);
    
    setTimeout(() => {
      setShowHarvest(false);
      setFruitStage(0);
    }, 2000);
    
    storage.clearTimerState();
  };

  const start = () => {
    if (timeLeft === 0) {
      setTimeLeft(customMinutes * 60);
      setTotalMinutes(customMinutes);
    }
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
    setTimeLeft(customMinutes * 60);
    setTotalMinutes(customMinutes);
    setFruitStage(0);
    storage.clearTimerState();
  };

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = totalMinutes > 0 ? ((totalMinutes * 60 - timeLeft) / (totalMinutes * 60)) * 100 : 0;

  return (
    <Card className="p-8 glass text-center border-2 border-primary/20">
      <h3 className="text-xl font-semibold mb-6">Pomodoro Timer</h3>

      {!isRunning && !isPaused && (
        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">Session Length (minutes)</label>
          <Input
            type="number"
            min="1"
            max="120"
            value={customMinutes}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 25;
              setCustomMinutes(val);
              setTimeLeft(val * 60);
              setTotalMinutes(val);
            }}
            className="w-32 mx-auto text-center"
          />
        </div>
      )}

      <div className="relative w-56 h-56 mx-auto mb-6">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="112"
            cy="112"
            r="100"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
            fill="none"
          />
          <circle
            cx="112"
            cy="112"
            r="100"
            stroke="url(#gradient)"
            strokeWidth="12"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 100}`}
            strokeDashoffset={`${2 * Math.PI * 100 * (1 - progress / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--primary-glow))" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl mb-2 animate-grow">{fruitStages[fruitStage]}</span>
          <span className="text-3xl font-bold">{formatTime()}</span>
          <span className="text-xs text-muted-foreground mt-1">{stageLabels[fruitStage]}</span>
        </div>

        {showHarvest && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl animate-harvest">🍎</span>
          </div>
        )}
      </div>

      {isPaused && !isRunning && (
        <p className="text-sm text-muted-foreground mb-4">Timer paused</p>
      )}

      <div className="flex gap-2 justify-center">
        {!isRunning ? (
          <Button onClick={start} className="bg-gradient-primary hover:opacity-90 shadow-md">
            <Play className="w-4 h-4 mr-2" />
            {isPaused ? 'Resume' : 'Start'}
          </Button>
        ) : (
          <Button onClick={pause} variant="outline" className="shadow-md">
            <Pause className="w-4 h-4 mr-2" />
            Pause
          </Button>
        )}

        <Button onClick={reset} variant="outline" className="shadow-md">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
