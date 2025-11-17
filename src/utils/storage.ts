import { Task, MoodEnergy, Note, PomodoroSession, TimerState } from '@/types/studypulse';

const STORAGE_KEYS = {
  TASKS: 'sp_tasks',
  NOTES: 'sp_notes',
  BREAK_COINS: 'sp_breakCoins',
  SESSIONS: 'sp_sessions',
  TIMER_STATE: 'sp_timerState',
  MOOD_ENERGY: 'sp_mood_',
} as const;

export const storage = {
  // Tasks
  getTasks: (): Task[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : [];
  },
  saveTasks: (tasks: Task[]) => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },

  // Notes
  getNotes: (): Note[] => {
    const data = localStorage.getItem(STORAGE_KEYS.NOTES);
    return data ? JSON.parse(data) : [];
  },
  saveNotes: (notes: Note[]) => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  },

  // Break Coins
  getBreakCoins: (): number => {
    const data = localStorage.getItem(STORAGE_KEYS.BREAK_COINS);
    return data ? parseInt(data) : 0;
  },
  saveBreakCoins: (coins: number) => {
    localStorage.setItem(STORAGE_KEYS.BREAK_COINS, coins.toString());
  },

  // Sessions
  getSessions: (): PomodoroSession[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return data ? JSON.parse(data) : [];
  },
  saveSessions: (sessions: PomodoroSession[]) => {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  },

  // Timer State
  getTimerState: (): TimerState | null => {
    const data = localStorage.getItem(STORAGE_KEYS.TIMER_STATE);
    return data ? JSON.parse(data) : null;
  },
  saveTimerState: (state: TimerState) => {
    localStorage.setItem(STORAGE_KEYS.TIMER_STATE, JSON.stringify(state));
  },
  clearTimerState: () => {
    localStorage.removeItem(STORAGE_KEYS.TIMER_STATE);
  },

  // Mood & Energy (per date)
  getMoodEnergy: (date: string): MoodEnergy | null => {
    const data = localStorage.getItem(STORAGE_KEYS.MOOD_ENERGY + date);
    return data ? JSON.parse(data) : null;
  },
  saveMoodEnergy: (moodEnergy: MoodEnergy) => {
    localStorage.setItem(
      STORAGE_KEYS.MOOD_ENERGY + moodEnergy.date,
      JSON.stringify(moodEnergy)
    );
  },
};
