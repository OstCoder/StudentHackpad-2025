export interface Task {
  id: string;
  title: string;
  description?: string;
  estimatedTime: number; // in minutes
  urgency: number; // 1-10
  importance: number; // 1-10
  completed: boolean;
  createdAt: Date;
}

export interface MoodEnergy {
  mood: number; // 1-10
  energy: number; // 1-10
  timestamp: Date;
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  notes: string;
}

export interface Drawing {
  id: string;
  dataUrl: string;
  timestamp: Date;
}
