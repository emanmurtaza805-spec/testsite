import { CheckCircle, Circle, Flame, Target, Timer, TrendingUp } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { calcLifloScore, getScoreMessage } from '@/lib/storage';
import ProgressRing from '@/components/ProgressRing';
import Orbit from '@/components/Orbit';
import type { PageKey } from '@/components/Sidebar';

interface DashboardProps {
  onNavigate: (page: PageKey) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { data } = useApp();
  const today = new Date().toISOString().slice(0, 10);

  const todayTasks = data.tasks.filter(t => t.date === today);
  const tasksCompleted = todayTasks.filter(t => t.status === 'completed').length;
  const tasksRemaining = todayTasks.filter(t => t.status === 'active').length;
  const taskTotal = todayTasks.length || 1;

  const bestStreak = data.habits.reduce((max, h) => Math.max(max, h.currentStreak), 0);

  const activeGoals = data.goals.filter(g => g.progress < 100);
  const avgGoalProgress = activeGoals.length
    ? Math.round(activeGoals.reduce((s, g) => s + g.progress, 0) / activeGoals.length)
    : 0;

  const todayFocus = data.focusSessions
    .filter(s => s.completedAt === today)
    .reduce((sum, s) => sum + s.duration, 0);

  const score = calcLifloScore(data);

  const orbitNodes = [
    { key: 'myday', label: 'Tasks', icon: CheckCircle, color: '#cf8888', count: tasksRemaining },
    { key: 'goals', label: 'Goals', icon: Target, color: '#5f8a52', count: data.goals.length },
    { key: 'habits', label: 'Habits', icon: Flame, color: '#9d83ba', count: data.habits.length },
    { key: 'projects', label: 'Projects', icon: TrendingUp, color: '#5a8a76', count: data.projects.length },
    { key: 'notes', label: 'Notes', icon: Target, color: '#7d6598', count: data.notes.length },
    { key: 'focus', label: 'Focus', icon: Timer, color: '#82a874', count: todayFocus > 0 ? Math.round(todayFocus) : undefined },
  ];

  const summaryCards = [
    {
      icon: CheckCircle, label: 'Tasks Completed', value: tasksCompleted, total: todayTasks.length,
      progress: (tasksCompleted / taskTotal) * 100, color: 'var(--accent-sage)',
    },
    {
      icon: Circle, label: 'Tasks Remaining', value: tasksRemaining, total: todayTasks.length,
      progress: (tasksRemaining / taskTotal) * 100, color: 'var(--accent-blush)',
    },
    {
      icon: Flame, label: 'Habit Streak', value: bestStreak, suffix: 'days',
      progress: Math.min(bestStreak * 8, 100), color: 'var(--accent-lavender)',
    },
    {
      icon: Target, label: 'Goal Progress', value: avgGoalProgress, suffix: '%',
      progress: avgGoalProgress, color: 'var(--accent-eucalyptus)',
    },
    {
      icon: Timer, label: 'Focus Time', value: todayFocus, suffix: 'min',
      progress: Math.min((todayFocus / 120) * 100, 100), color: '#82a874',
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8 animate-page-enter pb-24 md:pb-8">
      {/* Welcome */}
      <div>
        <h2 className="font-serif text-2xl md:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Here's your universe for today.
        </h2>
        <p className="text-sm text-muted mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {summaryCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="card-surface card-hover p-5 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: card.color + '15' }}>
                <Icon size={20} style={{ color: card.color }} />
              </div>
              <ProgressRing
                progress={card.progress}
                size={72}
                strokeWidth={6}
                color={card.color}
                label={`${card.value}${card.suffix || ''}`}
              />
              <p className="text-xs text-secondary mt-2">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* LIFLO Orbit + Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-surface p-6 md:p-8 flex flex-col items-center">
          <h3 className="font-serif text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            Your LIFLO Orbit
          </h3>
          <p className="text-xs text-muted mb-6">Click a node to explore.</p>
          <Orbit nodes={orbitNodes} onNodeClick={(key) => onNavigate(key as PageKey)} size={340} />
        </div>

        <div className="card-surface p-6 flex flex-col items-center justify-center text-center">
          <h3 className="font-serif text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Your LIFLO Score
          </h3>
          <ProgressRing
            progress={score}
            size={140}
            strokeWidth={10}
            color="var(--accent-sage)"
            label={`${score}`}
            sublabel="out of 100"
          />
          <p className="font-serif italic text-base mt-4" style={{ color: 'var(--text-secondary)' }}>
            {getScoreMessage(score)}
          </p>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Add a Task', page: 'myday' as PageKey },
          { label: 'Set a Goal', page: 'goals' as PageKey },
          { label: 'Start Focus', page: 'focus' as PageKey },
          { label: 'Evening Reflection', page: 'reflection' as PageKey },
        ].map((q, i) => (
          <button
            key={i}
            onClick={() => onNavigate(q.page)}
            className="card-surface card-hover p-4 text-sm font-medium text-left"
            style={{ color: 'var(--text-secondary)' }}
          >
            {q.label}
          </button>
        ))}
      </div>
    </div>
  );
}
