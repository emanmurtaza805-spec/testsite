import { useState } from 'react';
import { Search, Bell, Command } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
}

export default function Header({ onOpenSearch, onOpenNotifications }: HeaderProps) {
  const { data } = useApp();
  const [notifCount] = useState(3);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <header className="sticky top-0 z-30 bg-app/80 backdrop-blur-md border-b border-soft px-4 md:px-8 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-xl md:text-2xl font-serif font-semibold" style={{ color: 'var(--text-primary)' }}>
          {greeting}, {data.profile?.name?.split(' ')[0] || 'there'}.
        </h2>
        <p className="text-sm text-muted hidden sm:block">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-soft bg-card-surface hover:bg-secondary-surface transition-colors text-muted text-sm"
        >
          <Search size={16} />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden md:flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded border border-soft bg-secondary-surface">
            <Command size={10} />K
          </kbd>
        </button>

        <button
          onClick={onOpenNotifications}
          className="relative p-2.5 rounded-xl border border-soft bg-card-surface hover:bg-secondary-surface transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} className="text-secondary" />
          {notifCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blush-500 text-white text-[10px] flex items-center justify-center font-bold">
              {notifCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
