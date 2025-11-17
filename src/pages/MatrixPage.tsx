import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Task } from '@/types/task';
import { formatMinutesToTime } from '@/utils/timeFormat';

const MatrixPage = () => {
  // This would normally come from a shared state or context
  const [tasks] = useState<Task[]>([]);
  
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
    description,
    tasks, 
    color 
  }: { 
    title: string;
    description: string;
    tasks: Task[]; 
    color: string;
  }) => (
    <Card className={`p-6 glass border-2 ${color}`}>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <p className="text-3xl font-bold mb-4">{tasks.length} tasks</p>
      
      <div className="space-y-3">
        {tasks.map(task => (
          <div key={task.id} className="p-3 bg-background/50 rounded-lg">
            <p className="font-medium">{task.title}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span>{formatMinutesToTime(task.estimatedTime)}</span>
              <span>U: {task.urgency}/10</span>
              <span>I: {task.importance}/10</span>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <p className="text-sm text-muted-foreground">No tasks in this quadrant</p>
        )}
      </div>
    </Card>
  );
  
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <main className="container mx-auto px-6 py-24">
        <h1 className="text-3xl font-bold mb-8">Eisenhower Matrix</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QuadrantCard
            title="Do First"
            description="Urgent & Important - Do these immediately"
            tasks={categories.do}
            color="border-destructive bg-destructive/5"
          />
          <QuadrantCard
            title="Schedule"
            description="Not Urgent but Important - Schedule these"
            tasks={categories.schedule}
            color="border-primary bg-primary/5"
          />
          <QuadrantCard
            title="Delegate"
            description="Urgent but Not Important - Delegate if possible"
            tasks={categories.delegate}
            color="border-accent bg-accent/5"
          />
          <QuadrantCard
            title="Eliminate"
            description="Not Urgent & Not Important - Consider eliminating"
            tasks={categories.eliminate}
            color="border-muted bg-muted/5"
          />
        </div>
      </main>
    </div>
  );
};

export default MatrixPage;
