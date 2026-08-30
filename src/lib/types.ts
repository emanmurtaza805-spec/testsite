export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskCategory = 'Personal' | 'Study' | 'Work' | 'Health' | 'Creative';
export type TaskStatus = 'active' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  dueTime: string;
  category: TaskCategory;
  status: TaskStatus;
  createdAt: string;
  completedAt: string | null;
  date: string;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  deadline: string;
  progress: number;
  milestones: Milestone[];
  createdAt: string;
}

export interface HabitLog {
  date: string;
  completed: boolean;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  currentStreak: number;
  bestStreak: number;
  logs: HabitLog[];
  createdAt: string;
}

export type ProjectStatus = 'Planning' | 'In Progress' | 'On Hold' | 'Completed';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  deadline: string;
  progress: number;
  tasks: { id: string; title: string; completed: boolean }[];
  notes: string;
  createdAt: string;
}

export type NoteCategory = 'Ideas' | 'Study' | 'Work' | 'Personal' | 'Projects';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FocusSession {
  id: string;
  duration: number;
  completedAt: string;
  label: string;
}

export interface Reflection {
  id: string;
  date: string;
  wentWell: string;
  couldBeBetter: string;
  proudOf: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  focusAreas: string[];
  mainFocus: string;
  onboarded: boolean;
}

export interface Settings {
  theme: 'light' | 'dark';
  notifications: boolean;
  defaultPriority: TaskPriority;
  weekStart: 'Sunday' | 'Monday';
}

export interface AppData {
  tasks: Task[];
  goals: Goal[];
  habits: Habit[];
  projects: Project[];
  notes: Note[];
  focusSessions: FocusSession[];
  reflections: Reflection[];
  settings: Settings;
  profile: UserProfile | null;
}
