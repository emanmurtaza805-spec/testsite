import { useState, useEffect } from 'react';
import { Plus, Target, Trash2, Edit3, CheckCircle2, Circle, Calendar } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Modal from '@/components/Modal';
import EmptyState from '@/components/EmptyState';
import ProgressRing from '@/components/ProgressRing';
import type { Goal, TaskCategory } from '@/lib/types';

interface GoalsProps {
  quickAction?: string | null;
  clearQuickAction?: () => void;
}

const categories: TaskCategory[] = ['Personal', 'Study', 'Work', 'Health', 'Creative'];

export default function Goals({ quickAction, clearQuickAction }: GoalsProps) {
  const { data, addGoal, updateGoal, deleteGoal, toggleMilestone, addMilestone } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editGoal, setEditGoal] = useState<Goal | null>(null);
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  const [newMilestone, setNewMilestone] = useState('');

  // Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Personal');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    if (quickAction === 'new-goal') {
      openCreate();
      clearQuickAction?.();
    }
  }, [quickAction, clearQuickAction]);

  const openCreate = () => {
    setEditGoal(null);
    setTitle(''); setDescription(''); setCategory('Personal'); setDeadline('');
    setModalOpen(true);
  };

  const openEdit = (goal: Goal) => {
    setEditGoal(goal);
    setTitle(goal.title); setDescription(goal.description);
    setCategory(goal.category); setDeadline(goal.deadline);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (editGoal) {
      updateGoal(editGoal.id, { title, description, category, deadline });
    } else {
      addGoal({ title, description, category, deadline });
    }
    setModalOpen(false);
  };

  const handleAddMilestone = (goalId: string) => {
    if (!newMilestone.trim()) return;
    addMilestone(goalId, newMilestone.trim());
    setNewMilestone('');
  };

  return (
    <div className="p-4 md:p-8 space-y-6 animate-page-enter pb-24 md:pb-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>Goals</h2>
          <p className="text-sm text-muted mt-1">{data.goals.length} goals, {data.goals.filter(g => g.progress === 100).length} completed</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={18} /> New Goal
        </button>
      </div>

      {data.goals.length === 0 ? (
        <EmptyState
          title="No goals yet."
          message="Turn an idea into a destination."
          actionLabel="Create Goal"
          onAction={openCreate}
          icon={<Target size={32} className="text-sage-400" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {data.goals.map(goal => (
            <div key={goal.id} className="card-surface card-hover p-5">
              <div className="flex items-start gap-4">
                <ProgressRing
                  progress={goal.progress}
                  size={64}
                  strokeWidth={6}
                  color="var(--accent-sage)"
                  label={`${goal.progress}%`}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{goal.title}</h3>
                  <p className="text-xs text-secondary mt-0.5 line-clamp-2">{goal.description}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary-surface text-muted font-medium">{goal.category}</span>
                    {goal.deadline && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary-surface text-muted font-medium flex items-center gap-1">
                        <Calendar size={10} /> {new Date(goal.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openEdit(goal)} className="p-1.5 rounded-lg hover:bg-secondary-surface text-muted hover:text-secondary transition-colors">
                    <Edit3 size={15} />
                  </button>
                  <button onClick={() => deleteGoal(goal.id)} className="p-1.5 rounded-lg hover:bg-blush-100 dark:hover:bg-blush-500/20 text-muted hover:text-blush-500 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Milestones */}
              <div className="mt-4 pt-4 border-t border-soft">
                <button
                  onClick={() => setExpandedGoal(expandedGoal === goal.id ? null : goal.id)}
                  className="text-xs text-muted hover:text-secondary transition-colors w-full text-left"
                >
                  {goal.milestones.filter(m => m.completed).length}/{goal.milestones.length} milestones {expandedGoal === goal.id ? '▲' : '▼'}
                </button>

                {expandedGoal === goal.id && (
                  <div className="mt-3 space-y-1.5 animate-fade-in">
                    {goal.milestones.map(m => (
                      <button
                        key={m.id}
                        onClick={() => toggleMilestone(goal.id, m.id)}
                        className="flex items-center gap-2 text-sm w-full text-left p-1.5 rounded-lg hover:bg-secondary-surface/50 transition-colors"
                      >
                        {m.completed
                          ? <CheckCircle2 size={16} className="text-sage-500" />
                          : <Circle size={16} className="text-muted" />}
                        <span className={m.completed ? 'line-through text-muted' : 'text-secondary'}>{m.title}</span>
                      </button>
                    ))}
                    <div className="flex gap-2 mt-2">
                      <input
                        value={expandedGoal === goal.id ? newMilestone : ''}
                        onChange={e => setNewMilestone(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddMilestone(goal.id); } }}
                        placeholder="Add milestone..."
                        className="input-field text-sm py-2"
                      />
                      <button onClick={() => handleAddMilestone(goal.id)} className="btn-secondary text-sm px-3">Add</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editGoal ? 'Edit Goal' : 'New Goal'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5 text-secondary">Goal Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="What do you want to achieve?" className="input-field" autoFocus />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5 text-secondary">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Why does this matter?" className="input-field min-h-[80px] resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5 text-secondary">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value as TaskCategory)} className="input-field">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5 text-secondary">Deadline</label>
              <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="input-field" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">{editGoal ? 'Save' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
