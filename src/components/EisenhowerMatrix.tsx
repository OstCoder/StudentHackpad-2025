import { useState } from 'react';
import { Card } from './ui/card';
import { Task } from '@/types/task';
import { formatMinutesToTime } from '@/utils/timeFormat';
import { ChevronRight } from 'lucide-react';

interface EisenhowerMatrixProps {
  tasks: Task[];
}

export const EisenhowerMatrix = ({ tasks }: EisenhowerMatrixProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const categorize = (task: Task) => {
    if (task.urgency >= 7 && task.importance >= 7) return 'do';
    if (task.urgency < 7 && task.importance >= 7) return 'schedule';
    if (task.urgency >= 7 && task.importance < 7) return 'delegate';
    return 'eliminate';
  };
  
  const categories = {
    do: tasks.filter(t => !t.completed && categorize(t) === 'do'),
    schedule: tasks.filter(t => !t.completed && categorize(t) === 'schedule'),
    delegate: tasks.filter(t => !t.completed && categorize(t) === 'delegate'),
    eliminate: tasks.filter(t => !t.completed && categorize(t) === 'eliminate'),
  };
  
  const QuadrantCard = ({ 
    title, 
    tasks, 
    color 
  }: { 
    title: string; 
    tasks: Task[]; 
    color: string;
  }) => (
    <div className={`p-4 rounded-lg border-2 ${color} transition-all duration-300 hover:shadow-md`}>
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-2xl font-bold mb-2">{tasks.length}</p>
      {isExpanded && (
        <div className="space-y-2 animate-fade-in-up">
          {tasks.map(task => (
            <div key={task.id} className="text-sm p-2 bg-background/50 rounded">
              <p className="font-medium">{task.title}</p>
              <p className="text-xs text-muted-foreground">
                {formatMinutesToTime(task.estimatedTime)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
  return (
    <Card 
      className="p-6 glass cursor-pointer transition-all duration-300 hover:shadow-lg"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Eisenhower Matrix</h3>
        <ChevronRight 
          className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} 
        />
      </div>
      
      <div className={`grid grid-cols-2 gap-4 transition-all duration-300 ${isExpanded ? 'mb-4' : ''}`}>
        <QuadrantCard
          title="Do First"
          tasks={categories.do}
          color="border-destructive bg-destructive/5"
        />
        <QuadrantCard
          title="Schedule"
          tasks={categories.schedule}
          color="border-primary bg-primary/5"
        />
        <QuadrantCard
          title="Delegate"
          tasks={categories.delegate}
          color="border-accent bg-accent/5"
        />
        <QuadrantCard
          title="Eliminate"
          tasks={categories.eliminate}
          color="border-muted bg-muted/5"
        />
      </div>
      
      {!isExpanded && (
        <p className="text-sm text-muted-foreground text-center mt-2">
          Click to expand
        </p>
      )}
    </Card>
  );
};
