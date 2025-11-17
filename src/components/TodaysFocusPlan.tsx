import { Clock, CheckCircle2 } from 'lucide-react';
import { Card } from './ui/card';
import { Task } from '@/types/task';
import { formatMinutesToTime, calculateDynamicTime } from '@/utils/timeFormat';

interface TodaysFocusPlanProps {
  tasks: Task[];
  mood: number;
  energy: number;
}

export const TodaysFocusPlan = ({ tasks, mood, energy }: TodaysFocusPlanProps) => {
  const incompleteTasks = tasks.filter(t => !t.completed);
  const dynamicTime = calculateDynamicTime(tasks, mood, energy);
  
  return (
    <Card className="p-6 glass">
      <h2 className="text-2xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
        Today's Focus Plan
      </h2>
      
      <div className="flex items-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Scheduled</p>
            <p className="text-lg font-semibold">
              {formatMinutesToTime(dynamicTime)} over {incompleteTasks.length} tasks
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-success" />
          <div>
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-lg font-semibold">
              {tasks.filter(t => t.completed).length} / {tasks.length}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
        <p className="text-sm text-muted-foreground">
          Time adjusts based on your mood ({mood}/10) and energy ({energy}/10) levels
        </p>
      </div>
    </Card>
  );
};
