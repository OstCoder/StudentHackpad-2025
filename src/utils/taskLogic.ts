import { Task, TaskPriority, EisenhowerQuadrant } from '@/types/studypulse';

export const formatMinutes = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
};

export const calculatePriorityScore = (task: Task): number => {
  const priorityMap: Record<TaskPriority, number> = {
    'Very Low': 1,
    'Low': 2,
    'Medium': 3,
    'High': 4,
    'Critical': 5,
  };

  const priorityMapped = priorityMap[task.priority];
  const urgencyLevel = task.urgency / 20;
  const importanceLevel = task.importance / 20;

  // Calculate deadline factor
  const dueDate = new Date(task.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);
  
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let deadlineFactor = 0;
  if (diffDays <= 1) deadlineFactor = 3;
  else if (diffDays <= 3) deadlineFactor = 2;
  else if (diffDays <= 7) deadlineFactor = 1;

  return (priorityMapped * 2) + urgencyLevel + importanceLevel + deadlineFactor;
};

export const getEisenhowerQuadrant = (task: Task): EisenhowerQuadrant => {
  const highImportance = task.importance >= 50;
  const highUrgency = task.urgency >= 50;

  if (highImportance && highUrgency) return 'Q1';
  if (highImportance && !highUrgency) return 'Q2';
  if (!highImportance && highUrgency) return 'Q3';
  return 'Q4';
};

export const categorizeTasksByQuadrant = (tasks: Task[]) => {
  return {
    Q1: tasks.filter(t => !t.completed && getEisenhowerQuadrant(t) === 'Q1'),
    Q2: tasks.filter(t => !t.completed && getEisenhowerQuadrant(t) === 'Q2'),
    Q3: tasks.filter(t => !t.completed && getEisenhowerQuadrant(t) === 'Q3'),
    Q4: tasks.filter(t => !t.completed && getEisenhowerQuadrant(t) === 'Q4'),
  };
};

export const calculateDailyCapacity = (mood: number, energy: number): number => {
  const averageState = (mood + energy) / 2;

  if (averageState <= 25) return 30;
  if (averageState <= 50) return 60;
  if (averageState <= 75) return 90;
  return 120;
};

export const selectTodaysTasks = (tasks: Task[], capacity: number): Task[] => {
  // Categorize by quadrant
  const quadrants = categorizeTasksByQuadrant(tasks);

  // Sort within each quadrant by priority score
  const sortByPriority = (tasks: Task[]) =>
    [...tasks].sort((a, b) => calculatePriorityScore(b) - calculatePriorityScore(a));

  const Q1Sorted = sortByPriority(quadrants.Q1);
  const Q2Sorted = sortByPriority(quadrants.Q2);
  const Q3Sorted = sortByPriority(quadrants.Q3);
  const Q4Sorted = sortByPriority(quadrants.Q4);

  // Fill tasks until capacity
  const selectedTasks: Task[] = [];
  let totalMinutes = 0;

  const addTasksFromQuadrant = (quadrantTasks: Task[]) => {
    for (const task of quadrantTasks) {
      if (totalMinutes + task.minutes <= capacity + 15) { // Allow slight overflow
        selectedTasks.push(task);
        totalMinutes += task.minutes;
      }
      if (totalMinutes >= capacity) break;
    }
  };

  addTasksFromQuadrant(Q1Sorted);
  if (totalMinutes < capacity) addTasksFromQuadrant(Q2Sorted);
  if (totalMinutes < capacity) addTasksFromQuadrant(Q3Sorted);
  if (totalMinutes < capacity) addTasksFromQuadrant(Q4Sorted);

  return selectedTasks;
};

export const getMoodLabel = (mood: number): { emoji: string; label: string } => {
  if (mood <= 25) return { emoji: '😢', label: 'Rough' };
  if (mood <= 50) return { emoji: '😐', label: 'Meh' };
  if (mood <= 75) return { emoji: '🙂', label: 'Okay' };
  return { emoji: '😄', label: 'Great' };
};
