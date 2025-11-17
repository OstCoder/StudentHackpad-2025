import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Task } from '@/types/task';
import { formatMinutesToTime } from '@/utils/timeFormat';

interface TaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

export const TaskForm = ({ onAddTask }: TaskFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(30);
  const [urgency, setUrgency] = useState(5);
  const [importance, setImportance] = useState(5);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    onAddTask({
      title,
      description,
      estimatedTime,
      urgency,
      importance,
      completed: false,
    });
    
    // Reset form
    setTitle('');
    setDescription('');
    setEstimatedTime(30);
    setUrgency(5);
    setImportance(5);
    setIsOpen(false);
  };
  
  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add New Task
      </Button>
    );
  }
  
  return (
    <Card className="p-6 glass animate-pop">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Task Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="bg-background/50"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Description (Optional)</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details..."
            className="bg-background/50 min-h-20"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 flex items-center justify-between">
            <span>Est. Time</span>
            <span className="text-primary">{formatMinutesToTime(estimatedTime)}</span>
          </label>
          <input
            type="range"
            min="5"
            max="240"
            step="5"
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(Number(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Urgency: {urgency}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={urgency}
              onChange={(e) => setUrgency(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">
              Importance: {importance}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={importance}
              onChange={(e) => setImportance(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button type="submit" className="flex-1 bg-gradient-primary">
            Add Task
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};
