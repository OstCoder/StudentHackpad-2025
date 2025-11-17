import { Check, Trash2, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Task } from '@/types/task';
import { formatMinutesToTime } from '@/utils/timeFormat';
import { useState } from 'react';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export const TaskList = ({ tasks, onToggleComplete, onDeleteTask }: TaskListProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const handleDelete = (id: string) => {
    setDeletingId(id);
    setTimeout(() => {
      onDeleteTask(id);
      setDeletingId(null);
    }, 300);
  };
  
  if (tasks.length === 0) {
    return (
      <Card className="p-8 glass text-center">
        <p className="text-muted-foreground">No tasks yet. Add your first task to get started!</p>
      </Card>
    );
  }
  
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <Card
          key={task.id}
          className={`p-4 glass transition-all duration-300 ${
            deletingId === task.id ? 'opacity-0 scale-95' : 'animate-slide-in'
          } ${task.completed ? 'opacity-60' : ''}`}
        >
          <div className="flex items-start gap-3">
            <button
              onClick={() => onToggleComplete(task.id)}
              className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                task.completed
                  ? 'bg-success border-success'
                  : 'border-muted-foreground hover:border-primary'
              }`}
            >
              {task.completed && <Check className="w-3 h-3 text-white" />}
            </button>
            
            <div className="flex-1 min-w-0">
              <h4 className={`font-medium ${task.completed ? 'line-through' : ''}`}>
                {task.title}
              </h4>
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
              )}
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatMinutesToTime(task.estimatedTime)}
                </span>
                <span>Urgency: {task.urgency}/10</span>
                <span>Importance: {task.importance}/10</span>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(task.id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
