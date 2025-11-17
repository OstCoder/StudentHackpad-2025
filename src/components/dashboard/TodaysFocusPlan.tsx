import { useEffect } from 'react';
import { Target, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Task } from '@/types/studypulse';
import { calculateDailyCapacity, selectTodaysTasks, formatMinutes } from '@/utils/taskLogic';
import { TaskCard } from './TaskCard';

interface TodaysFocusPlanProps {
  tasks: Task[];
  mood: number;
  energy: number;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export const TodaysFocusPlan = ({ tasks, mood, energy, onToggleComplete, onDeleteTask }: TodaysFocusPlanProps) => {
  const capacity = calculateDailyCapacity(mood, energy);
  const selectedTasks = selectTodaysTasks(tasks, capacity);
  const totalMinutes = selectedTasks.reduce((sum, task) => sum + task.minutes, 0);

  return (
    <Card className="p-6 glass border-2 border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Today's Focus Plan
        </h2>
      </div>

      <div className="mb-4 p-4 rounded-lg bg-gradient-subtle border border-primary/20">
        <p className="text-sm text-muted-foreground mb-2">
          Based on your mood ({mood}) & energy ({energy}), we're planning ~{capacity} minutes today.
        </p>
        <div className="flex items-center gap-2 text-lg font-semibold text-primary">
          <Clock className="w-5 h-5" />
          <span>{formatMinutes(totalMinutes)} scheduled over {selectedTasks.length} tasks</span>
        </div>
      </div>

      <div className="space-y-3">
        {selectedTasks.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No tasks scheduled for today. Add some tasks to get started!
          </p>
        ) : (
          selectedTasks.map((task) => (
            <div key={task.id} className="animate-fade-in-up">
              <TaskCard
                task={task}
                onToggleComplete={onToggleComplete}
                onDelete={onDeleteTask}
              />
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
