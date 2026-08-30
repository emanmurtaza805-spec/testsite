import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { AppData, Settings, UserProfile, Task, Goal, Habit, Project, Note, FocusSession, Reflection } from '@/lib/types';
import { loadData, saveData, emptyData, seedData, uid, todayStr } from '@/lib/storage';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextValue {
  data: AppData;
  isLoggedIn: boolean;
  // auth
  signup: (name: string, email: string, password: string) => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  completeOnboarding: (focusAreas: string[], mainFocus: string) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  // settings
  updateSettings: (settings: Partial<Settings>) => void;
  toggleTheme: () => void;
  // data ops
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completedAt' | 'status'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'progress' | 'milestones'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  addMilestone: (goalId: string, title: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'currentStreak' | 'bestStreak' | 'logs'>) => void;
  toggleHabit: (habitId: string, date: string) => void;
  deleteHabit: (id: string) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'progress' | 'tasks' | 'notes'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  toggleProjectTask: (projectId: string, taskId: string) => void;
  addProjectTask: (projectId: string, title: string) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  addFocusSession: (duration: number, label: string) => void;
  addReflection: (r: Omit<Reflection, 'id' | 'date'>) => void;
  deleteReflection: (id: string) => void;
  loadDemoData: () => void;
  clearAllData: () => void;
  exportData: () => void;
  importData: (json: string) => boolean;
  // toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

const AUTH_KEY = 'liflo-auth-v1';

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadData() || emptyData());
  const [authUser, setAuthUser] = useState<{ name: string; email: string; password: string } | null>(
    () => {
      try {
        return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null');
      } catch {
        return null;
      }
    }
  );
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Persist data
  useEffect(() => { saveData(data); }, [data]);

  // Apply theme
  useEffect(() => {
    if (data.settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [data.settings.theme]);

  const isLoggedIn = !!authUser && !!data.profile;

  // Toast
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = uid();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);
  const dismissToast = useCallback((id: string) => setToasts(prev => prev.filter(t => t.id !== id)), []);

  // Auth
  const signup = useCallback((name: string, email: string, password: string) => {
    const user = { name, email, password };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    setAuthUser(user);
    setData(prev => ({
      ...prev,
      profile: { name, email, avatar: '', focusAreas: [], mainFocus: '', onboarded: false },
    }));
  }, []);

  const login = useCallback((email: string, password: string): boolean => {
    try {
      const stored = JSON.parse(localStorage.getItem(AUTH_KEY) || 'null');
      if (stored && stored.email === email && stored.password === password) {
        setAuthUser(stored);
        if (!data.profile) {
          setData(prev => ({
            ...prev,
            profile: { name: stored.name, email: stored.email, avatar: '', focusAreas: [], mainFocus: '', onboarded: false },
          }));
        }
        return true;
      }
    } catch { /* ignore */ }
    return false;
  }, [data.profile]);

  const logout = useCallback(() => {
    setAuthUser(null);
    setData(emptyData());
    localStorage.removeItem(AUTH_KEY);
  }, []);

  const completeOnboarding = useCallback((focusAreas: string[], mainFocus: string) => {
    setData(prev => ({
      ...prev,
      profile: prev.profile ? { ...prev.profile, focusAreas, mainFocus, onboarded: true } : null,
    }));
  }, []);

  const updateProfile = useCallback((profile: Partial<UserProfile>) => {
    setData(prev => ({ ...prev, profile: prev.profile ? { ...prev.profile, ...profile } : null }));
  }, []);

  // Settings
  const updateSettings = useCallback((settings: Partial<Settings>) => {
    setData(prev => ({ ...prev, settings: { ...prev.settings, ...settings } }));
  }, []);

  const toggleTheme = useCallback(() => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, theme: prev.settings.theme === 'light' ? 'dark' : 'light' },
    }));
  }, []);

  // Tasks
  const addTask: AppContextValue['addTask'] = useCallback((task) => {
    setData(prev => ({
      ...prev,
      tasks: [{ ...task, id: uid(), createdAt: todayStr(), completedAt: null, status: 'active' }, ...prev.tasks],
    }));
    showToast('Task created');
  }, [showToast]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setData(prev => ({ ...prev, tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates } : t) }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setData(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
    showToast('Task deleted', 'info');
  }, [showToast]);

  const toggleTask = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t =>
        t.id === id
          ? { ...t, status: t.status === 'completed' ? 'active' : 'completed', completedAt: t.status === 'completed' ? null : todayStr() }
          : t
      ),
    }));
  }, []);

  // Goals
  const addGoal: AppContextValue['addGoal'] = useCallback((goal) => {
    setData(prev => ({
      ...prev,
      goals: [{ ...goal, id: uid(), createdAt: todayStr(), progress: 0, milestones: [] }, ...prev.goals],
    }));
    showToast('Goal created');
  }, [showToast]);

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setData(prev => ({ ...prev, goals: prev.goals.map(g => g.id === id ? { ...g, ...updates } : g) }));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setData(prev => ({ ...prev, goals: prev.goals.filter(g => g.id !== id) }));
    showToast('Goal deleted', 'info');
  }, [showToast]);

  const toggleMilestone = useCallback((goalId: string, milestoneId: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.map(g => {
        if (g.id !== goalId) return g;
        const milestones = g.milestones.map(m =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const completed = milestones.filter(m => m.completed).length;
        const progress = Math.round((completed / milestones.length) * 100);
        return { ...g, milestones, progress };
      }),
    }));
  }, []);

  const addMilestone = useCallback((goalId: string, title: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.map(g =>
        g.id === goalId
          ? { ...g, milestones: [...g.milestones, { id: uid(), title, completed: false }] }
          : g
      ),
    }));
  }, []);

  // Habits
  const addHabit: AppContextValue['addHabit'] = useCallback((habit) => {
    setData(prev => ({
      ...prev,
      habits: [{ ...habit, id: uid(), createdAt: todayStr(), currentStreak: 0, bestStreak: 0, logs: [] }, ...prev.habits],
    }));
    showToast('Habit added');
  }, [showToast]);

  const toggleHabit = useCallback((habitId: string, date: string) => {
    setData(prev => ({
      ...prev,
      habits: prev.habits.map(h => {
        if (h.id !== habitId) return h;
        const existing = h.logs.find(l => l.date === date);
        let logs;
        if (existing) {
          logs = h.logs.map(l => l.date === date ? { ...l, completed: !l.completed } : l);
        } else {
          logs = [...h.logs, { date, completed: true }];
        }
        // recalc streak
        const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date));
        let streak = 0;
        for (let i = sorted.length - 1; i >= 0; i--) {
          if (sorted[i].completed) streak++;
          else break;
        }
        const bestStreak = Math.max(h.bestStreak, streak);
        return { ...h, logs, currentStreak: streak, bestStreak };
      }),
    }));
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setData(prev => ({ ...prev, habits: prev.habits.filter(h => h.id !== id) }));
    showToast('Habit deleted', 'info');
  }, [showToast]);

  // Projects
  const addProject: AppContextValue['addProject'] = useCallback((project) => {
    setData(prev => ({
      ...prev,
      projects: [{ ...project, id: uid(), createdAt: todayStr(), progress: 0, tasks: [], notes: '' }, ...prev.projects],
    }));
    showToast('Project created');
  }, [showToast]);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setData(prev => ({ ...prev, projects: prev.projects.map(p => p.id === id ? { ...p, ...updates } : p) }));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
    showToast('Project deleted', 'info');
  }, [showToast]);

  const toggleProjectTask = useCallback((projectId: string, taskId: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => {
        if (p.id !== projectId) return p;
        const tasks = p.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
        const completed = tasks.filter(t => t.completed).length;
        const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
        return { ...p, tasks, progress };
      }),
    }));
  }, []);

  const addProjectTask = useCallback((projectId: string, title: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === projectId
          ? { ...p, tasks: [...p.tasks, { id: uid(), title, completed: false }] }
          : p
      ),
    }));
  }, []);

  // Notes
  const addNote: AppContextValue['addNote'] = useCallback((note) => {
    setData(prev => ({
      ...prev,
      notes: [{ ...note, id: uid(), createdAt: todayStr(), updatedAt: todayStr() }, ...prev.notes],
    }));
    showToast('Note created');
  }, [showToast]);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setData(prev => ({
      ...prev,
      notes: prev.notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: todayStr() } : n),
    }));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setData(prev => ({ ...prev, notes: prev.notes.filter(n => n.id !== id) }));
    showToast('Note deleted', 'info');
  }, [showToast]);

  // Focus
  const addFocusSession = useCallback((duration: number, label: string) => {
    setData(prev => ({
      ...prev,
      focusSessions: [...prev.focusSessions, { id: uid(), duration, completedAt: todayStr(), label }],
    }));
    showToast('Focus session completed');
  }, [showToast]);

  // Reflections
  const addReflection: AppContextValue['addReflection'] = useCallback((r) => {
    setData(prev => ({
      ...prev,
      reflections: [{ ...r, id: uid(), date: todayStr() }, ...prev.reflections],
    }));
    showToast('Reflection saved');
  }, [showToast]);

  const deleteReflection = useCallback((id: string) => {
    setData(prev => ({ ...prev, reflections: prev.reflections.filter(r => r.id !== id) }));
  }, []);

  // Data management
  const loadDemoData = useCallback(() => {
    setData(seedData());
    showToast('Demo data loaded');
  }, [showToast]);

  const clearAllData = useCallback(() => {
    const profile = data.profile;
    setData({ ...emptyData(), profile });
    showToast('Data cleared', 'info');
  }, [data.profile, showToast]);

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'liflo-export.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported');
  }, [data, showToast]);

  const importData = useCallback((json: string): boolean => {
    try {
      const parsed = JSON.parse(json) as AppData;
      setData(parsed);
      showToast('Data imported');
      return true;
    } catch {
      showToast('Import failed', 'error');
      return false;
    }
  }, [showToast]);

  const value: AppContextValue = {
    data, isLoggedIn,
    signup, login, logout, completeOnboarding, updateProfile,
    updateSettings, toggleTheme,
    addTask, updateTask, deleteTask, toggleTask,
    addGoal, updateGoal, deleteGoal, toggleMilestone, addMilestone,
    addHabit, toggleHabit, deleteHabit,
    addProject, updateProject, deleteProject, toggleProjectTask, addProjectTask,
    addNote, updateNote, deleteNote,
    addFocusSession, addReflection, deleteReflection,
    loadDemoData, clearAllData, exportData, importData,
    toasts, showToast, dismissToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
