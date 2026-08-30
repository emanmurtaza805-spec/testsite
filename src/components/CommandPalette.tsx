import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Target, CheckCircle, BookOpen, Timer, Calendar, Moon, Sun, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { PageKey } from './Sidebar';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (page: PageKey) => void;
  onQuickAction: (action: string) => void;
}

export default function CommandPalette({ open, onClose, onNavigate, onQuickAction }: CommandPaletteProps) {
  const { data, toggleTheme } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  const commands = [
    { icon: Plus, label: 'Create task', action: () => { onNavigate('myday'); onQuickAction('new-task'); } },
    { icon: Target, label: 'Create goal', action: () => { onNavigate('goals'); onQuickAction('new-goal'); } },
    { icon: CheckCircle, label: 'Add habit', action: () => { onNavigate('habits'); onQuickAction('new-habit'); } },
    { icon: BookOpen, label: 'New note', action: () => { onNavigate('notes'); onQuickAction('new-note'); } },
    { icon: Timer, label: 'Start focus session', action: () => { onNavigate('focus'); } },
    { icon: Calendar, label: 'Open calendar', action: () => { onNavigate('calendar'); } },
    { icon: data.settings.theme === 'light' ? Moon : Sun, label: 'Toggle dark mode', action: () => { toggleTheme(); } },
  ];

  // Search results from data
  const searchResults: { type: string; label: string; action: () => void }[] = [];
  if (query.trim()) {
    const q = query.toLowerCase();
    data.tasks.filter(t => t.title.toLowerCase().includes(q)).forEach(t =>
      searchResults.push({ type: 'Task', label: t.title, action: () => onNavigate('myday') })
    );
    data.goals.filter(g => g.title.toLowerCase().includes(q)).forEach(g =>
      searchResults.push({ type: 'Goal', label: g.title, action: () => onNavigate('goals') })
    );
    data.habits.filter(h => h.name.toLowerCase().includes(q)).forEach(h =>
      searchResults.push({ type: 'Habit', label: h.name, action: () => onNavigate('habits') })
    );
    data.projects.filter(p => p.name.toLowerCase().includes(q)).forEach(p =>
      searchResults.push({ type: 'Project', label: p.name, action: () => onNavigate('projects') })
    );
    data.notes.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)).forEach(n =>
      searchResults.push({ type: 'Note', label: n.title, action: () => onNavigate('notes') })
    );
  }

  const allItems = query.trim() ? searchResults.slice(0, 8) : commands;
  const grouped: Record<string, typeof allItems> = {};
  allItems.forEach(item => {
    const key = query.trim() ? item.type : 'Actions';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  });

  const flatItems = Object.values(grouped).flat();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(i => Math.min(i + 1, flatItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      flatItems[selectedIdx]?.action();
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  let runningIdx = 0;

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center pt-24 px-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl card-surface modal-enter overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-soft">
          <Search size={18} className="text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIdx(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Search or type a command..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: 'var(--text-primary)' }}
          />
          <kbd className="text-xs text-muted px-1.5 py-0.5 rounded border border-soft">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {flatItems.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted">No results found.</div>
          )}
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              <div className="px-3 py-1.5 text-xs font-medium text-muted uppercase tracking-wide">{group}</div>
              {items.map((item) => {
                const idx = runningIdx++;
                const isSelected = idx === selectedIdx;
                const Icon = (item as any).icon || ArrowRight;
                return (
                  <button
                    key={idx}
                    onMouseEnter={() => setSelectedIdx(idx)}
                    onClick={() => { item.action(); onClose(); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                      isSelected ? 'bg-secondary-surface' : ''
                    }`}
                    style={isSelected ? { color: 'var(--accent-sage)' } : { color: 'var(--text-secondary)' }}
                  >
                    <Icon size={17} />
                    <span className="text-sm flex-1">{item.label}</span>
                    {query.trim() && <span className="text-xs text-muted">{item.type}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
