import { Bell, CheckCircle2, Target, Repeat, Timer, FolderOpen, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import Modal from './Modal';

export default function NotificationPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data } = useApp();
  const [dismissed, setDismissed] = useState<string[]>([]);

  const today = new Date().toISOString().slice(0, 10);
  const todayTasks = data.tasks.filter(t => t.date === today && t.status === 'active');
  const activeStreaks = data.habits.filter(h => h.currentStreak >= 3);
  const upcomingProjects = data.projects.filter(p => p.status === 'In Progress' && p.deadline);
  const recentFocus = data.focusSessions.filter(s => s.completedAt === today);

  const notifications: { id: string; icon: typeof Bell; color: string; message: string }[] = [];

  if (todayTasks.length > 0) {
    notifications.push({
      id: 'tasks-due', icon: CheckCircle2, color: 'var(--accent-sage)',
      message: `You have ${todayTasks.length} task${todayTasks.length > 1 ? 's' : ''} due today.`,
    });
  }
  activeStreaks.forEach(h => {
    notifications.push({
      id: `streak-${h.id}`, icon: Repeat, color: 'var(--accent-lavender)',
      message: `Your ${h.currentStreak}-day ${h.name} streak is active. Keep it going!`,
    });
  });
  upcomingProjects.forEach(p => {
    const days = Math.ceil((new Date(p.deadline).getTime() - Date.now()) / 86400000);
    if (days <= 14 && days >= 0) {
      notifications.push({
        id: `project-${p.id}`, icon: FolderOpen, color: 'var(--accent-blush)',
        message: `"${p.name}" deadline in ${days} day${days !== 1 ? 's' : ''}.`,
      });
    }
  });
  if (recentFocus.length > 0) {
    notifications.push({
      id: 'focus-done', icon: Timer, color: 'var(--accent-eucalyptus)',
      message: `You completed ${recentFocus.length} focus session${recentFocus.length > 1 ? 's' : ''} today.`,
    });
  }

  const visible = notifications.filter(n => !dismissed.includes(n.id));

  return (
    <Modal open={open} onClose={onClose} title="Notifications" maxWidth="max-w-md">
      {visible.length === 0 ? (
        <div className="py-10 text-center">
          <div className="w-16 h-16 rounded-full bg-secondary-surface flex items-center justify-center mx-auto mb-3">
            <Bell size={28} className="text-muted" />
          </div>
          <p className="text-sm text-muted">You're all caught up.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {visible.map(n => {
            const Icon = n.icon;
            return (
              <div key={n.id} className="flex items-start gap-3 p-3 rounded-xl bg-secondary-surface/50 animate-slide-up">
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: n.color + '20' }}>
                  <Icon size={17} style={{ color: n.color }} />
                </div>
                <p className="text-sm flex-1 pt-1.5" style={{ color: 'var(--text-primary)' }}>{n.message}</p>
                <button onClick={() => setDismissed(prev => [...prev, n.id])} className="p-1 text-muted hover:text-secondary transition-colors">
                  <X size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
