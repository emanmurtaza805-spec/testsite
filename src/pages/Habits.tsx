import { useState, useEffect } from 'react';
import { Plus, Flame, Trash2, TrendingUp } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Modal from '@/components/Modal';
import EmptyState from '@/components/EmptyState';
import type { Habit } from '@/lib/types';

interface HabitsProps {
  quickAction?: string | null;
  clearQuickAction?: () => void;
}

const habitColors = ['#5f8a52', '#9d83ba', '#cf8888', '#5a8a76', '#82a874', '#7d6598'];
const habitIcons = ['💧', '📖', '🏃', '💻', '🧘', '🎨', '🌱', '☀️', '🪴', '✍️'];

export default function Habits({ quickAction, clearQuickAction }: HabitsProps) {
  const { data, addHabit, toggleHabit, deleteHabit } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🌱');
  const [color, setColor] = useState(habitColors[0]);

  useEffect(() => {
    if (quickAction === 'new-habit') {
      setModalOpen(true);
      clearQuickAction?.();
    }
  }, [quickAction, clearQuickAction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addHabit({ name, icon, color });
    setName(''); setIcon('🌱'); setColor(habitColors[0]);
    setModalOpen(false);
  };

  // Generate last 7 days for weekly view
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  // Generate 30-day heatmap data
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().slice(0, 10);
  });

  const renderHeatmap = (habit: Habit) => {
    return last30Days.map(date => {
      const log = habit.logs.find(l => l.date === date);
      const isToday = date === new Date().toISOString().slice(0, 10);
      return (
        <div
          key={date}
          onClick={() => toggleHabit(habit.id, date)}
          className="w-5 h-5 rounded-md cursor-pointer transition-all hover:scale-110"
          style={{
            background: log?.completed ? habit.color : 'var(--border-soft)',
            border: isToday ? `2px solid ${habit.color}` : 'none',
          }}
          title={`${date}: ${log?.completed ? 'Done' : 'Not done'}`}
        />
      );
    });
  };

  return (
    <div className="p-4 md:p-8 space-y-6 animate-page-enter pb-24 md:pb-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>Habits</h2>
          <p className="text-sm text-muted mt-1">{data.habits.length} habits tracked</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={18} /> Add Habit
        </button>
      </div>

      {data.habits.length === 0 ? (
        <EmptyState
          title="No habits yet."
          message="Start small. One gentle practice at a time."
          actionLabel="Add Habit"
          onAction={() => setModalOpen(true)}
          icon={<Flame size={32} className="text-sage-400" />}
        />
      ) : (
        <div className="space-y-5">
          {data.habits.map(habit => {
            const completionRate = habit.logs.length
              ? Math.round((habit.logs.filter(l => l.completed).length / habit.logs.length) * 100)
              : 0;
            return (
              <div key={habit.id} className="card-surface card-hover p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{ background: habit.color + '20' }}>
                      {habit.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{habit.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted mt-0.5">
                        <span className="flex items-center gap-1"><Flame size={12} style={{ color: habit.color }} /> {habit.currentStreak} days</span>
                        <span>Best: {habit.bestStreak}</span>
                        <span>{completionRate}% complete</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => deleteHabit(habit.id)} className="p-1.5 rounded-lg hover:bg-blush-100 dark:hover:bg-blush-500/20 text-muted hover:text-blush-500 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>

                {/* Weekly view */}
                <div className="flex gap-2 mb-4">
                  {last7Days.map(date => {
                    const log = habit.logs.find(l => l.date === date);
                    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
                    const isToday = date === new Date().toISOString().slice(0, 10);
                    return (
                      <button
                        key={date}
                        onClick={() => toggleHabit(habit.id, date)}
                        className="flex-1 flex flex-col items-center gap-1.5 py-2 rounded-lg transition-all hover:scale-105"
                        style={{ background: log?.completed ? habit.color + '20' : 'var(--bg-secondary)' }}
                      >
                        <span className="text-[10px] text-muted">{dayName}</span>
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ background: log?.completed ? habit.color : 'transparent', border: isToday ? `2px solid ${habit.color}` : '2px solid var(--border-soft)' }}
                        >
                          {log?.completed && <span className="text-white text-xs">✓</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Heatmap */}
                <div className="flex flex-wrap gap-1">
                  {renderHeatmap(habit)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Habit">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5 text-secondary">Habit Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Read 20 minutes" className="input-field" autoFocus />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5 text-secondary">Icon</label>
            <div className="flex flex-wrap gap-2">
              {habitIcons.map(ic => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${icon === ic ? 'scale-110' : ''}`}
                  style={{ background: icon === ic ? color + '30' : 'var(--bg-secondary)' }}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5 text-secondary">Color</label>
            <div className="flex flex-wrap gap-2">
              {habitColors.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-all ${color === c ? 'scale-110 ring-2 ring-offset-2' : ''}`}
                  style={{ background: c, ringColor: c } as any}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Add</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
