import type { AppData, Task, Goal, Habit, Project, Note, FocusSession, Reflection } from './types';

const STORAGE_KEY = 'liflo-data-v1';

export function loadData(): AppData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppData;
  } catch {
    return null;
  }
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore quota errors
  }
}

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function dateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function emptyData(): AppData {
  return {
    tasks: [],
    goals: [],
    habits: [],
    projects: [],
    notes: [],
    focusSessions: [],
    reflections: [],
    settings: {
      theme: 'light',
      notifications: true,
      defaultPriority: 'medium',
      weekStart: 'Monday',
    },
    profile: null,
  };
}

// ---- Seed data ----

export function seedData(): AppData {
  const today = todayStr();
  const tasks: Task[] = [
    {
      id: uid(), title: 'Complete JavaScript lesson', description: 'Finish ES6 modules chapter',
      priority: 'high', dueTime: '10:00', category: 'Study', status: 'completed',
      createdAt: today, completedAt: today, date: today,
    },
    {
      id: uid(), title: 'Finish project design', description: 'Finalize the LIFLO mockup in Figma',
      priority: 'high', dueTime: '14:00', category: 'Work', status: 'active',
      createdAt: today, completedAt: null, date: today,
    },
    {
      id: uid(), title: 'Read 20 pages', description: 'Continue Atomic Habits',
      priority: 'low', dueTime: '20:00', category: 'Personal', status: 'active',
      createdAt: today, completedAt: null, date: today,
    },
    {
      id: uid(), title: '30-minute run', description: 'Morning jog in the park',
      priority: 'medium', dueTime: '07:00', category: 'Health', status: 'completed',
      createdAt: today, completedAt: today, date: today,
    },
    {
      id: uid(), title: 'Sketch new logo ideas', description: 'Brainstorm botanical logo concepts',
      priority: 'medium', dueTime: '16:00', category: 'Creative', status: 'active',
      createdAt: today, completedAt: null, date: today,
    },
  ];

  const goals: Goal[] = [
    {
      id: uid(), title: 'Learn React', description: 'Master React fundamentals and build real projects',
      category: 'Study', deadline: '2026-12-31', progress: 58,
      milestones: [
        { id: uid(), title: 'HTML & CSS', completed: true },
        { id: uid(), title: 'JavaScript ES6', completed: true },
        { id: uid(), title: 'React Components', completed: true },
        { id: uid(), title: 'Hooks & State', completed: false },
        { id: uid(), title: 'Full Project', completed: false },
      ],
      createdAt: today,
    },
    {
      id: uid(), title: 'Build Portfolio', description: 'Create a professional portfolio website',
      category: 'Work', deadline: '2026-10-15', progress: 72,
      milestones: [
        { id: uid(), title: 'Design mockup', completed: true },
        { id: uid(), title: 'Set up project', completed: true },
        { id: uid(), title: 'Build pages', completed: true },
        { id: uid(), title: 'Deploy', completed: false },
      ],
      createdAt: today,
    },
  ];

  const habits: Habit[] = [
    {
      id: uid(), name: 'Coding', icon: '💻', color: '#5f8a52',
      currentStreak: 7, bestStreak: 12, createdAt: today,
      logs: generateHabitLogs(0.85),
    },
    {
      id: uid(), name: 'Reading', icon: '📖', color: '#9d83ba',
      currentStreak: 5, bestStreak: 9, createdAt: today,
      logs: generateHabitLogs(0.7),
    },
    {
      id: uid(), name: 'Exercise', icon: '🏃', color: '#cf8888',
      currentStreak: 3, bestStreak: 6, createdAt: today,
      logs: generateHabitLogs(0.55),
    },
  ];

  const projects: Project[] = [
    {
      id: uid(), name: 'Portfolio Website', description: 'Personal portfolio to showcase projects',
      status: 'In Progress', deadline: '2026-10-15', progress: 72,
      tasks: [
        { id: uid(), title: 'Design hero section', completed: true },
        { id: uid(), title: 'Add project gallery', completed: true },
        { id: uid(), title: 'Write about page', completed: false },
        { id: uid(), title: 'Deploy to production', completed: false },
      ],
      notes: 'Use a warm botanical palette. Keep it minimal.',
      createdAt: today,
    },
    {
      id: uid(), name: 'LIFLO App', description: 'A calm personal productivity app',
      status: 'In Progress', deadline: '2026-09-30', progress: 45,
      tasks: [
        { id: uid(), title: 'Design system', completed: true },
        { id: uid(), title: 'Build dashboard', completed: true },
        { id: uid(), title: 'Implement all features', completed: false },
        { id: uid(), title: 'Polish animations', completed: false },
      ],
      notes: 'Focus on calm botanical aesthetic. Every detail matters.',
      createdAt: today,
    },
  ];

  const notes: Note[] = [
    {
      id: uid(), title: 'Design Principles', content: 'Keep it calm. Generous whitespace. Soft botanical accents. Every card should feel like premium stationery.',
      category: 'Ideas', pinned: true, createdAt: today, updatedAt: today,
    },
    {
      id: uid(), title: 'React Hooks Notes', content: 'useState for local state. useEffect for side effects. useMemo for expensive calcs. useCallback for stable refs.',
      category: 'Study', pinned: false, createdAt: today, updatedAt: today,
    },
    {
      id: uid(), title: 'Morning Routine', content: 'Wake up, hydrate, 10 min meditation, light stretching, then start the day with the most important task.',
      category: 'Personal', pinned: false, createdAt: today, updatedAt: today,
    },
  ];

  const focusSessions: FocusSession[] = [
    { id: uid(), duration: 25, completedAt: today, label: 'React practice' },
    { id: uid(), duration: 45, completedAt: today, label: 'Design work' },
    { id: uid(), duration: 25, completedAt: todayStrOffset(-1), label: 'Reading' },
  ];

  const reflections: Reflection[] = [
    {
      id: uid(), date: todayStrOffset(-1),
      wentWell: 'Finished the React components chapter and started building the portfolio.',
      couldBeBetter: 'Got distracted by social media in the afternoon.',
      proudOf: 'Kept my coding streak going for 7 days straight.',
    },
  ];

  return {
    tasks, goals, habits, projects, notes, focusSessions, reflections,
    settings: {
      theme: 'light', notifications: true, defaultPriority: 'medium', weekStart: 'Monday',
    },
    profile: null,
  };
}

function generateHabitLogs(completionRate: number): { date: string; completed: boolean }[] {
  const logs = [];
  for (let i = 30; i >= 0; i--) {
    logs.push({
      date: todayStrOffset(-i),
      completed: Math.random() < completionRate,
    });
  }
  return logs;
}

function todayStrOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// ---- LIFLO Score ----

export function calcLifloScore(data: AppData): number {
  const tasksTotal = data.tasks.length || 1;
  const tasksCompleted = data.tasks.filter(t => t.status === 'completed').length;
  const taskScore = (tasksCompleted / tasksTotal) * 30;

  const habitsActive = data.habits.length || 1;
  const habitConsistency = data.habits.reduce((sum, h) => {
    const recent = h.logs.slice(-7);
    const done = recent.filter(l => l.completed).length;
    return sum + done / 7;
  }, 0) / habitsActive;
  const habitScore = habitConsistency * 30;

  const goalsActive = data.goals.length || 1;
  const goalProgress = data.goals.reduce((sum, g) => sum + g.progress, 0) / goalsActive;
  const goalScore = (goalProgress / 100) * 25;

  const focusRecent = data.focusSessions.filter(s => {
    const diff = (Date.now() - new Date(s.completedAt).getTime()) / 86400000;
    return diff <= 7;
  });
  const focusScore = Math.min(focusRecent.length / 10, 1) * 15;

  return Math.round(taskScore + habitScore + goalScore + focusScore);
}

export function getScoreMessage(score: number): string {
  if (score >= 85) return "You're in full bloom.";
  if (score >= 70) return "You're building momentum.";
  if (score >= 50) return "Steady growth, day by day.";
  if (score >= 30) return "Every seed starts small.";
  return "Begin gently. Tomorrow is another day.";
}
