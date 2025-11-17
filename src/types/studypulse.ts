export type TaskPriority = 'Very Low' | 'Low' | 'Medium' | 'High' | 'Critical';
export type TaskType = 'Homework' | 'Quiz' | 'Test' | 'Project' | 'Other';

export interface Task {
  id: string;
  course: string;
  title: string;
  dueDate: string;
  minutes: number;
  type: TaskType;
  priority: TaskPriority;
  urgency: number; // 0-100
  importance: number; // 0-100
  createdAt: string;
  completed?: boolean;
}

export interface MoodEnergy {
  mood: number; // 0-100
  energy: number; // 0-100
  date: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  resources: Resource[];
  drawingData?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: string;
  url: string;
  note: string;
}

export interface PomodoroSession {
  id: string;
  minutes: number;
  completedAt: string;
  breakCoins: number;
}

export interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  isPaused: boolean;
  totalMinutes: number;
  fruitStage: 0 | 1 | 2 | 3 | 4;
}

export type EisenhowerQuadrant = 'Q1' | 'Q2' | 'Q3' | 'Q4';
