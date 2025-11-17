import { useState, useEffect } from 'react';
import { StudyPulseNav } from '@/components/StudyPulseNav';
import { AddTaskForm } from '@/components/dashboard/AddTaskForm';
import { TaskCard } from '@/components/dashboard/TaskCard';
import { MoodEnergyTracker } from '@/components/dashboard/MoodEnergyTracker';
import { TodaysFocusPlan } from '@/components/dashboard/TodaysFocusPlan';
import { EisenhowerMatrix } from '@/components/dashboard/EisenhowerMatrix';
import { PomodoroTimer } from '@/components/focus/PomodoroTimer';
import { FocusStats } from '@/components/focus/FocusStats';
import { NoteEditor } from '@/components/notes/NoteEditor';
import { Task, MoodEnergy, Note, PomodoroSession } from '@/types/studypulse';
import { storage } from '@/utils/storage';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit3, Trash2 } from 'lucide-react';

const StudyPulse = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'focus' | 'notes'>('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [moodEnergy, setMoodEnergy] = useState<MoodEnergy>({
    mood: 50,
    energy: 50,
    date: new Date().toISOString().split('T')[0],
  });
  const [breakCoins, setBreakCoins] = useState(0);
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isCreatingNote, setIsCreatingNote] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadedTasks = storage.getTasks();
    const loadedNotes = storage.getNotes();
    const loadedCoins = storage.getBreakCoins();
    const loadedSessions = storage.getSessions();
    const today = new Date().toISOString().split('T')[0];
    const loadedMoodEnergy = storage.getMoodEnergy(today);

    setTasks(loadedTasks);
    setNotes(loadedNotes);
    setBreakCoins(loadedCoins);
    setSessions(loadedSessions);
    
    if (loadedMoodEnergy) {
      setMoodEnergy(loadedMoodEnergy);
    }
  }, []);

  // Task handlers
  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
  };

  const handleToggleComplete = (id: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
  };

  const handleDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
  };

  // Mood & Energy handlers
  const handleUpdateMoodEnergy = (mood: number, energy: number) => {
    const today = new Date().toISOString().split('T')[0];
    const updated: MoodEnergy = { mood, energy, date: today };
    setMoodEnergy(updated);
    storage.saveMoodEnergy(updated);
  };

  // Pomodoro handlers
  const handleSessionComplete = (minutes: number) => {
    const breakCoinsEarned = Math.floor(minutes / 5);
    const newSession: PomodoroSession = {
      id: Date.now().toString(),
      minutes,
      completedAt: new Date().toISOString(),
      breakCoins: breakCoinsEarned,
    };

    const updatedSessions = [...sessions, newSession];
    const updatedCoins = breakCoins + breakCoinsEarned;

    setSessions(updatedSessions);
    setBreakCoins(updatedCoins);
    storage.saveSessions(updatedSessions);
    storage.saveBreakCoins(updatedCoins);
  };

  // Notes handlers
  const handleSaveNote = (noteData: Omit<Note, 'id' | 'createdAt'> & { id?: string }) => {
    if (noteData.id) {
      // Update existing note
      const updatedNotes = notes.map(note =>
        note.id === noteData.id
          ? { ...note, ...noteData, updatedAt: new Date().toISOString() }
          : note
      );
      setNotes(updatedNotes);
      storage.saveNotes(updatedNotes);
    } else {
      // Create new note
      const newNote: Note = {
        ...noteData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      storage.saveNotes(updatedNotes);
    }
    
    setEditingNote(null);
    setIsCreatingNote(false);
  };

  const handleDeleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    storage.saveNotes(updatedNotes);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <StudyPulseNav activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="container mx-auto px-6 py-24">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in-up space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <TodaysFocusPlan
                  tasks={tasks}
                  mood={moodEnergy.mood}
                  energy={moodEnergy.energy}
                  onToggleComplete={handleToggleComplete}
                  onDeleteTask={handleDeleteTask}
                />

                <EisenhowerMatrix tasks={tasks} />

                <AddTaskForm onAddTask={handleAddTask} />

                <div>
                  <h2 className="text-2xl font-bold mb-4">All Tasks</h2>
                  {tasks.length === 0 ? (
                    <Card className="p-8 glass text-center">
                      <p className="text-muted-foreground">
                        No tasks yet. Add your first task to get started!
                      </p>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {tasks.map(task => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onToggleComplete={handleToggleComplete}
                          onDelete={handleDeleteTask}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <MoodEnergyTracker
                  mood={moodEnergy.mood}
                  energy={moodEnergy.energy}
                  onUpdate={handleUpdateMoodEnergy}
                />
              </div>
            </div>
          </div>
        )}

        {/* Focus Garden Tab */}
        {activeTab === 'focus' && (
          <div className="animate-fade-in-up">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PomodoroTimer onSessionComplete={handleSessionComplete} />
              </div>

              <div>
                <FocusStats breakCoins={breakCoins} sessions={sessions} />
              </div>
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="animate-fade-in-up">
            {!editingNote && !isCreatingNote ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">My Notes</h2>
                  <Button
                    onClick={() => setIsCreatingNote(true)}
                    className="bg-gradient-primary shadow-md"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Note
                  </Button>
                </div>

                {notes.length === 0 ? (
                  <Card className="p-8 glass text-center">
                    <p className="text-muted-foreground">
                      No notes yet. Create your first note!
                    </p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {notes.map(note => (
                      <Card key={note.id} className="p-4 glass hover:shadow-lg transition-all animate-pop">
                        <h3 className="font-semibold mb-2">{note.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                          {note.content}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                          <span>{note.resources.length} resources</span>
                          <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingNote(note)}
                            className="flex-1"
                          >
                            <Edit3 className="w-3 h-3 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <NoteEditor
                note={editingNote}
                onSave={handleSaveNote}
                onClose={() => {
                  setEditingNote(null);
                  setIsCreatingNote(false);
                }}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default StudyPulse;
