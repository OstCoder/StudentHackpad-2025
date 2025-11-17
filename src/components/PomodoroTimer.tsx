import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { usePomodoro } from '@/hooks/usePomodoro';

export const PomodoroTimer = () => {
  const { timeLeft, isRunning, isPaused, start, pause, reset, formatTime } = usePomodoro(25);
  
  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;
  
  return (
    <Card className="p-8 glass text-center">
      <h3 className="text-lg font-semibold mb-6">Pomodoro Timer</h3>
      
      <div className="relative w-48 h-48 mx-auto mb-6">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="url(#gradient)"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 88}`}
            strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
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
        
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold">{formatTime()}</span>
        </div>
      </div>
      
      {isPaused && !isRunning && (
        <p className="text-sm text-muted-foreground mb-4">Timer paused</p>
      )}
      
      <div className="flex gap-2 justify-center">
        {!isRunning ? (
          <Button
            onClick={start}
            className="bg-gradient-primary hover:opacity-90"
          >
            <Play className="w-4 h-4 mr-2" />
            {isPaused ? 'Resume' : 'Start'}
          </Button>
        ) : (
          <Button
            onClick={pause}
            variant="outline"
          >
            <Pause className="w-4 h-4 mr-2" />
            Pause
          </Button>
        )}
        
        <Button
          onClick={reset}
          variant="outline"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
