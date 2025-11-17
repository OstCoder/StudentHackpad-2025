import { useState } from 'react';
import { Check, Trash2, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Task } from '@/types/studypulse';
import { formatMinutes, calculatePriorityScore, getEisenhowerQuadrant } from '@/utils/taskLogic';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const quadrantColors = {
  Q1: 'border-l-4 border-l-destructive',
  Q2: 'border-l-4 border-l-primary',
  Q3: 'border-l-4 border-l-accent',
  Q4: 'border-l-4 border-l-muted-foreground',
};

export const TaskCard = ({ task, onToggleComplete, onDelete }: TaskCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => onDelete(task.id), 300);
  };

  const quadrant = getEisenhowerQuadrant(task);
  const priorityScore = calculatePriorityScore(task);

  return (
    <Card
      className={`
        p-4 glass transition-all duration-300
        ${isDeleting ? 'animate-shrink-fade' : 'animate-slide-in'}
        ${task.completed ? 'opacity-50' : ''}
        ${quadrantColors[quadrant]}
      `}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggleComplete(task.id)}
          className={`
            mt-1 w-5 h-5 rounded border-2 flex items-center justify-center
            transition-all duration-300 flex-shrink-0
            ${
              task.completed
                ? 'bg-success border-success scale-110'
                : 'border-primary hover:border-primary-glow hover:shadow-glow'
            }
          `}
        >
          {task.completed && <Check className="w-3 h-3 text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-xs font-medium text-primary">{task.course}</span>
              <h4 className={`font-semibold ${task.completed ? 'line-through' : ''}`}>
                {task.title}
              </h4>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary whitespace-nowrap">
              {task.type}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatMinutes(task.minutes)}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
            <span>U: {task.urgency}</span>
            <span>I: {task.importance}</span>
            <span className="font-semibold text-primary">Score: {priorityScore.toFixed(1)}</span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
