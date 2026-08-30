import { LayoutGrid, Sun, Target, CheckCircle, FolderOpen, Timer, BookOpen, Calendar, BarChart3, Settings, Moon } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export type PageKey = 'dashboard' | 'myday' | 'goals' | 'habits' | 'projects' | 'focus' | 'notes' | 'calendar' | 'insights' | 'reflection' | 'settings';

interface SidebarProps {
  current: PageKey;
  onNavigate: (page: PageKey) => void;
}

const navItems: { key: PageKey; label: string; icon: typeof LayoutGrid }[] = [
  { key: 'dashboard', label: 'Overview', icon: LayoutGrid },
  { key: 'myday', label: 'My Day', icon: Sun },
  { key: 'goals', label: 'Goals', icon: Target },
  { key: 'habits', label: 'Habits', icon: CheckCircle },
  { key: 'projects', label: 'Projects', icon: FolderOpen },
  { key: 'focus', label: 'Focus', icon: Timer },
  { key: 'notes', label: 'Notes', icon: BookOpen },
  { key: 'calendar', label: 'Calendar', icon: Calendar },
  { key: 'insights', label: 'Insights', icon: BarChart3 },
];

export default function Sidebar({ current, onNavigate }: SidebarProps) {
  const { data, toggleTheme, logout } = useApp();
  const profile = data.profile;

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r border-soft bg-card-surface shrink-0">
      {/* Logo */}
      <div className="px-6 py-6">
        <h1 className="font-serif text-3xl font-bold tracking-tight" style={{ color: 'var(--accent-sage)' }}>
          LIFLO
        </h1>
        <p className="text-xs text-muted mt-0.5 italic font-serif">Your life. Connected.</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = current === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                active ? 'bg-secondary-surface font-medium' : 'hover:bg-secondary-surface/60'
              }`}
              style={active ? { color: 'var(--accent-sage)' } : { color: 'var(--text-secondary)' }}
            >
              <Icon size={19} />
              <span className="text-sm">{item.label}</span>
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent-sage)' }} />}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-soft space-y-1">
        <button
          onClick={() => onNavigate('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-secondary-surface/60 ${
            current === 'settings' ? 'bg-secondary-surface font-medium' : ''
          }`}
          style={current === 'settings' ? { color: 'var(--accent-sage)' } : { color: 'var(--text-secondary)' }}
        >
          <Settings size={19} />
          <span className="text-sm">Settings</span>
        </button>

        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-secondary-surface/60 text-secondary"
        >
          {data.settings.theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
          <span className="text-sm">{data.settings.theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
      </div>

      {/* Profile */}
      <button
        onClick={() => onNavigate('settings')}
        className="flex items-center gap-3 px-4 py-3.5 border-t border-soft hover:bg-secondary-surface/60 transition-colors w-full text-left"
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0"
          style={{ background: 'var(--accent-sage)' }}
        >
          {profile?.name?.[0]?.toUpperCase() || '?'}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{profile?.name || 'Guest'}</p>
          <p className="text-xs text-muted truncate">{profile?.email || ''}</p>
        </div>
      </button>
    </aside>
  );
}
