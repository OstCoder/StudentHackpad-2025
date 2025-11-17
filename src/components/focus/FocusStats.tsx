import { Coins, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { PomodoroSession } from '@/types/studypulse';

interface FocusStatsProps {
  breakCoins: number;
  sessions: PomodoroSession[];
}

export const FocusStats = ({ breakCoins, sessions }: FocusStatsProps) => {
  const recentSessions = sessions.slice(-5).reverse();

  return (
    <div className="space-y-4">
      <Card className="p-6 glass border-2 border-primary/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
            <Coins className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Break Coins</p>
            <p className="text-3xl font-bold text-primary">{breakCoins}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Earn 1 coin per 5 minutes of focused work
        </p>
      </Card>

      <Card className="p-6 glass border-2 border-primary/20">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Recent Sessions</h3>
        </div>

        {recentSessions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No sessions yet. Complete your first Pomodoro!
          </p>
        ) : (
          <div className="space-y-2">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-2 rounded-lg bg-background/50"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🍎</span>
                  <div>
                    <p className="text-sm font-medium">{session.minutes} min</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(session.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-primary">
                  +{session.breakCoins} coins
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
