import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { MoodEnergyTracker } from '@/components/MoodEnergyTracker';
import { TodaysFocusPlan } from '@/components/TodaysFocusPlan';
import { TaskForm } from '@/components/TaskForm';
import { TaskList } from '@/components/TaskList';
import { EisenhowerMatrix } from '@/components/EisenhowerMatrix';
import { Task, MoodEnergy } from '@/types/task';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [moodEnergy, setMoodEnergy] = useState<MoodEnergy>({
    mood: 7,
    energy: 7,
    timestamp: new Date(),
  });
  
  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setTasks([...tasks, newTask]);
  };
  
  const handleToggleComplete = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };
  
  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  const handleUpdateMoodEnergy = (mood: number, energy: number) => {
    setMoodEnergy({ mood, energy, timestamp: new Date() });
  };
  
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <main className="container mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TodaysFocusPlan
              tasks={tasks}
              mood={moodEnergy.mood}
              energy={moodEnergy.energy}
            />
            
            <EisenhowerMatrix tasks={tasks} />
            
            <TaskForm onAddTask={handleAddTask} />
            
            <div>
              <h2 className="text-2xl font-bold mb-4">Your Tasks</h2>
              <TaskList
                tasks={tasks}
                onToggleComplete={handleToggleComplete}
                onDeleteTask={handleDeleteTask}
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <MoodEnergyTracker
              mood={moodEnergy.mood}
              energy={moodEnergy.energy}
              onUpdate={handleUpdateMoodEnergy}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
