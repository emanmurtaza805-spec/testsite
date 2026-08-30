import { Home, Sun, Target, CheckCircle, FolderOpen, Timer, BookOpen, Calendar, BarChart3 } from 'lucide-react';
import type { PageKey } from './Sidebar';

interface BottomNavProps {
  current: PageKey;
  onNavigate: (page: PageKey) => void;
}

const items: { key: PageKey; icon: typeof Home; label: string }[] = [
  { key: 'dashboard', icon: Home, label: 'Home' },
  { key: 'myday', icon: Sun, label: 'My Day' },
  { key: 'goals', icon: Target, label: 'Goals' },
  { key: 'habits', icon: CheckCircle, label: 'Habits' },
  { key: 'focus', icon: Timer, label: 'Focus' },
  { key: 'notes', icon: BookOpen, label: 'Notes' },
  { key: 'calendar', icon: Calendar, label: 'Calendar' },
  { key: 'insights', icon: BarChart3, label: 'Insights' },
];

export default function BottomNav({ current, onNavigate }: BottomNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card-surface border-t border-soft px-1 py-1.5 overflow-x-auto">
      <div className="flex gap-1 min-w-max">
        {items.map(item => {
          const Icon = item.icon;
          const active = current === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors shrink-0"
              style={active ? { color: 'var(--accent-sage)' } : { color: 'var(--text-muted)' }}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
