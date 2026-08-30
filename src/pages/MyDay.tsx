import { useState, useEffect } from 'react';
import { Plus, CheckCircle2, Circle, Trash2, Edit3, Filter, ArrowUpDown, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Modal from '@/components/Modal';
import EmptyState from '@/components/EmptyState';
import type { Task, TaskPriority, TaskCategory } from '@/lib/types';

interface MyDayProps {
  quickAction?: string | null;
  clearQuickAction?: () => void;
}

const categories: TaskCategory[] = ['Personal', 'Study', 'Work', 'Health', 'Creative'];
const priorities: TaskPriority[] = ['low', 'medium', 'high'];

const priorityColors: Record<TaskPriority, string> = {
  low: '#82a874',
  medium: '#cf8888',
  high: '#9d83ba',
};

export default function MyDay({ quickAction, clearQuickAction }: MyDayProps) {
  const { data, addTask, updateTask, deleteTask, toggleTask } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<TaskCategory | 'All'>('All');
  const [sortBy, setSortBy] = useState<'priority' | 'time' | 'created'>('created');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueTime, setDueTime] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Personal');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    if (quickAction === 'new-task') {
      openCreate();
      clearQuickAction?.();
    }
  }, [quickAction, clearQuickAction]);

  const openCreate = () => {
    setEditTask(null);
    setTitle(''); setDescription(''); setPriority('medium');
    setDueTime(''); setCategory('Personal');
    setDate(new Date().toISOString().slice(0, 10));
    setModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditTask(task);
    setTitle(task.title); setDescription(task.description);
    setPriority(task.priority); setDueTime(task.dueTime);
    setCategory(task.category); setDate(task.date);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (editTask) {
      updateTask(editTask.id, { title, description, priority, dueTime, category, date });
    } else {
      addTask({ title, description, priority, dueTime, category, date });
    }
    setModalOpen(false);
  };

  let tasks = data.tasks;
  if (filter !== 'All') tasks = tasks.filter(t => t.category === filter);

  const priorityOrder: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };
  tasks = [...tasks].sort((a, b) => {
    if (sortBy === 'priority') return priorityOrder[a.priority] - priorityOrder[b.priority];
    if (sortBy === 'time') return (a.dueTime || '').localeCompare(b.dueTime || '');
    return b.createdAt.localeCompare(a.createdAt);
  });

  const today = new Date().toISOString().slice(0, 10);
  const todayTasks = tasks.filter(t => t.date === today);
  const otherTasks = tasks.filter(t => t.date !== today);

  const renderTask = (task: Task) => {
    const isDone = task.status === 'completed';
    return (
      <div
        key={task.id}
        className={`card-surface p-4 flex items-start gap-3 card-hover ${isDone ? 'opacity-60' : ''}`}
      >
        <button
          onClick={() => toggleTask(task.id)}
          className="mt-0.5 shrink-0 transition-transform hover:scale-110"
          style={{ color: isDone ? 'var(--accent-sage)' : 'var(--text-muted)' }}
        >
          {isDone ? <CheckCircle2 size={22} className="task-complete-anim" /> : <Circle size={22} />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className={`text-sm font-medium ${isDone ? 'line-through' : ''}`} style={{ color: 'var(--text-primary)' }}>
              {task.title}
            </h4>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ background: priorityColors[task.priority] + '20', color: priorityColors[task.priority] }}
            >
              {task.priority}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary-surface text-muted font-medium">
              {task.category}
            </span>
          </div>
          {task.description && <p className="text-xs text-secondary mt-1">{task.description}</p>}
          {task.dueTime && <p className="text-xs text-muted mt-1">Due: {task.dueTime}</p>}
        </div>

        <div className="flex gap-1 shrink-0">
          <button onClick={() => openEdit(task)} className="p-1.5 rounded-lg hover:bg-secondary-surface text-muted hover:text-secondary transition-colors">
            <Edit3 size={15} />
          </button>
          <button onClick={() => deleteTask(task.id)} className="p-1.5 rounded-lg hover:bg-blush-100 dark:hover:bg-blush-500/20 text-muted hover:text-blush-500 transition-colors">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 space-y-6 animate-page-enter pb-24 md:pb-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>My Day</h2>
          <p className="text-sm text-muted mt-1">{todayTasks.length} tasks today, {todayTasks.filter(t => t.status === 'completed').length} completed</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={18} /> Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <Filter size={15} className="text-muted" />
          <button
            onClick={() => setFilter('All')}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${filter === 'All' ? 'bg-secondary-surface font-medium' : 'text-muted hover:text-secondary'}`}
            style={filter === 'All' ? { color: 'var(--accent-sage)' } : {}}
          >
            All
          </button>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${filter === c ? 'bg-secondary-surface font-medium' : 'text-muted hover:text-secondary'}`}
              style={filter === c ? { color: 'var(--accent-sage)' } : {}}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <ArrowUpDown size={15} className="text-muted" />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="text-xs bg-transparent border border-soft rounded-lg px-2 py-1.5 outline-none text-secondary"
          >
            <option value="created">Newest</option>
            <option value="priority">Priority</option>
            <option value="time">Due time</option>
          </select>
        </div>
      </div>

      {/* Today's tasks */}
      {todayTasks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted uppercase tracking-wide">Today</h3>
          {todayTasks.map(renderTask)}
        </div>
      )}

      {/* Other tasks */}
      {otherTasks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted uppercase tracking-wide">Upcoming</h3>
          {otherTasks.map(renderTask)}
        </div>
      )}

      {/* Empty */}
      {tasks.length === 0 && (
        <EmptyState
          title="No tasks yet."
          message="What would you like to accomplish today?"
          actionLabel="Add Task"
          onAction={openCreate}
        />
      )}

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTask ? 'Edit Task' : 'New Task'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5 text-secondary">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="What needs doing?" className="input-field" autoFocus />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5 text-secondary">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional details..." className="input-field min-h-[80px] resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5 text-secondary">Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value as TaskPriority)} className="input-field">
                {priorities.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5 text-secondary">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value as TaskCategory)} className="input-field">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5 text-secondary">Due Time</label>
              <input type="time" value={dueTime} onChange={e => setDueTime(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5 text-secondary">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">{editTask ? 'Save' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
