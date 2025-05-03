
export interface Task {
  id: string;
  name: string;
  completed: boolean;
  timeSpent: number; // in seconds
  isTimerRunning: boolean;
  timerStartTime?: number;
  procrastinationReason?: string;
  reminderTime?: number;
}

export type ProcrastinationReason = 
  | "Distracted" 
  | "Lack of motivation" 
  | "Busy with other things" 
  | "Too difficult" 
  | "Not urgent" 
  | "Other";
