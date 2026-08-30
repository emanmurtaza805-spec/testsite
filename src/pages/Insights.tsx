import { CheckCircle, Flame, Target, Timer, TrendingUp, Award } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { calcLifloScore, getScoreMessage } from '@/lib/storage';
import ProgressRing from '@/components/ProgressRing';

export default function Insights() {
  const { data } = useApp();

  const today = new Date().toISOString().slice(0, 10);
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().slice(0, 10);

  // Tasks completed this week
  const tasksThisWeek = data.tasks.filter(t =>
    t.status === 'completed' && t.completedAt && t.completedAt >= weekAgoStr
  );
  const tasksPrevWeek = data.tasks.filter(t =>
    t.status === 'completed' && t.completedAt &&
    t.completedAt >= new Date(weekAgo.getTime() - 7 * 86400000).toISOString().slice(0, 10) &&
    t.completedAt < weekAgoStr
  );

  // Habit consistency
  const habitConsistency = data.habits.length
    ? Math.round(data.habits.reduce((sum, h) => {
        const recent = h.logs.slice(-7);
        return sum + recent.filter(l => l.completed).length / 7;
      }, 0) / data.habits.length * 100)
    : 0;

  // Goal progress
  const activeGoals = data.goals.filter(g => g.progress < 100);
  const avgGoalProgress = activeGoals.length
    ? Math.round(activeGoals.reduce((s, g) => s + g.progress, 0) / activeGoals.length)
    : 0;

  // Focus time
  const focusThisWeek = data.focusSessions
    .filter(s => s.completedAt >= weekAgoStr)
    .reduce((sum, s) => sum + s.duration, 0);

  // Weekly activity (by day of week)
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - i));
    const dayStr = day.toISOString().slice(0, 10);
    const tasks = data.tasks.filter(t => t.status === 'completed' && t.completedAt === dayStr).length;
    const focus = data.focusSessions.filter(s => s.completedAt === dayStr).length;
    return { day: dayNames[day.getDay()], tasks, focus, total: tasks + focus };
  });

  const maxActivity = Math.max(...weeklyActivity.map(a => a.total), 1);

  // Most productive day
  const mostProductiveDay = weeklyActivity.reduce((max, curr) =>
    curr.total > max.total ? curr : max, weeklyActivity[0]);

  const longestStreak = data.habits.reduce((max, h) => Math.max(max, h.bestStreak), 0);
  const score = calcLifloScore(data);

  const insights = [
    mostProductiveDay.total > 0 && `You're most productive on ${mostProductiveDay.day}s.`,
    tasksThisWeek.length > tasksPrevWeek.length && 'Your task completion improved this week.',
    longestStreak > 0 && `Your longest habit streak is ${longestStreak} days.`,
    focusThisWeek > 60 && `You've focused for ${focusThisWeek} minutes this week.`,
    habitConsistency >= 70 && 'Your habit consistency is blooming.',
  ].filter(Boolean) as string[];

  const statCards = [
    { icon: CheckCircle, label: 'Tasks Completed', value: tasksThisWeek.length, suffix: 'this week', color: 'var(--accent-sage)' },
    { icon: Flame, label: 'Habit Consistency', value: habitConsistency, suffix: '%', color: 'var(--accent-lavender)' },
    { icon: Target, label: 'Goal Progress', value: avgGoalProgress, suffix: '%', color: 'var(--accent-eucalyptus)' },
    { icon: Timer, label: 'Focus Time', value: focusThisWeek, suffix: 'min', color: '#82a874' },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 animate-page-enter pb-24 md:pb-8">
      <div>
        <h2 className="font-serif text-2xl md:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>Insights</h2>
        <p className="text-sm text-muted mt-1">A gentle look at your week.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="card-surface card-hover p-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: card.color + '15' }}>
                <Icon size={20} style={{ color: card.color }} />
              </div>
              <p className="font-serif text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {card.value}<span className="text-base text-muted ml-1">{card.suffix}</span>
              </p>
              <p className="text-xs text-secondary mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Weekly activity chart */}
      <div className="card-surface p-6">
        <h3 className="text-sm font-medium text-muted uppercase tracking-wide mb-6">Weekly Activity</h3>
        <div className="flex items-end justify-between gap-2 h-48">
          {weeklyActivity.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex-1 flex items-end">
                <div
                  className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80"
                  style={{
                    height: `${(day.total / maxActivity) * 100}%`,
                    minHeight: day.total > 0 ? '8px' : '2px',
                    background: day.total > 0 ? 'var(--accent-sage)' : 'var(--border-soft)',
                  }}
                  title={`${day.tasks} tasks, ${day.focus} sessions`}
                />
              </div>
              <span className="text-[10px] text-muted">{day.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* LIFLO Score */}
      <div className="card-surface p-6 flex flex-col md:flex-row items-center gap-6">
        <ProgressRing
          progress={score}
          size={120}
          strokeWidth={10}
          color="var(--accent-sage)"
          label={`${score}`}
          sublabel="/ 100"
        />
        <div className="flex-1 text-center md:text-left">
          <h3 className="font-serif text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Your LIFLO Score</h3>
          <p className="font-serif italic text-base" style={{ color: 'var(--text-secondary)' }}>{getScoreMessage(score)}</p>
        </div>
      </div>

      {/* Insights list */}
      {insights.length > 0 && (
        <div className="card-surface p-6">
          <h3 className="text-sm font-medium text-muted uppercase tracking-wide mb-4 flex items-center gap-2">
            <Award size={16} /> Observations
          </h3>
          <div className="space-y-3">
            {insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-3 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: 'var(--accent-sage)' }} />
                <p className="text-sm text-secondary">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
