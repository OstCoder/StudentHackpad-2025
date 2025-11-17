import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task, TaskPriority, TaskType } from '@/types/studypulse';
import { formatMinutes } from '@/utils/taskLogic';

interface AddTaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

export const AddTaskForm = ({ onAddTask }: AddTaskFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [course, setCourse] = useState('');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [minutes, setMinutes] = useState(60);
  const [type, setType] = useState<TaskType>('Homework');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [urgency, setUrgency] = useState(50);
  const [importance, setImportance] = useState(50);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!course.trim() || !title.trim() || !dueDate) return;
    
    onAddTask({
      course,
      title,
      dueDate,
      minutes,
      type,
      priority,
      urgency,
      importance,
      completed: false,
    });
    
    // Reset form
    setCourse('');
    setTitle('');
    setDueDate('');
    setMinutes(60);
    setType('Homework');
    setPriority('Medium');
    setUrgency(50);
    setImportance(50);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-primary hover:opacity-90 transition-opacity shadow-md"
        size="lg"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add New Task
      </Button>
    );
  }

  return (
    <Card className="p-6 glass animate-pop border-2 border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Add New Task</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Course</label>
            <Input
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="e.g. Math 101"
              className="bg-background/50"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Task Type</label>
            <Select value={type} onValueChange={(v) => setType(v as TaskType)}>
              <SelectTrigger className="bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Homework">Homework</SelectItem>
                <SelectItem value="Quiz">Quiz</SelectItem>
                <SelectItem value="Test">Test</SelectItem>
                <SelectItem value="Project">Project</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Task Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="bg-background/50"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Due Date</label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-background/50"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 flex items-center justify-between">
              <span>Est. Time</span>
              <span className="text-primary font-semibold">{formatMinutes(minutes)}</span>
            </label>
            <input
              type="range"
              min="5"
              max="300"
              step="5"
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Priority Level</label>
          <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
            <SelectTrigger className="bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Very Low">Very Low</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 flex items-center justify-between">
              <span>Urgency</span>
              <span className="text-sm text-primary">{urgency}</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={urgency}
              onChange={(e) => setUrgency(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 flex items-center justify-between">
              <span>Importance</span>
              <span className="text-sm text-primary">{importance}</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={importance}
              onChange={(e) => setImportance(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" className="flex-1 bg-gradient-primary shadow-md">
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
