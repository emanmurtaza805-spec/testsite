import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalIcon } from 'lucide-react';
import { useApp } from '@/context/AppContext';

type ViewMode = 'month' | 'week' | 'day';

export default function Calendar() {
  const { data } = useApp();
  const [view, setView] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getItemsForDate = (dateStr: string) => {
    const tasks = data.tasks.filter(t => t.date === dateStr);
    const goals = data.goals.filter(g => g.deadline === dateStr);
    const projects = data.projects.filter(p => p.deadline === dateStr);
    return { tasks, goals, projects };
  };

  const hasItems = (dateStr: string) => {
    const { tasks, goals, projects } = getItemsForDate(dateStr);
    return tasks.length > 0 || goals.length > 0 || projects.length > 0;
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const prevWeek = () => setCurrentDate(new Date(year, month, currentDate.getDate() - 7));
  const nextWeek = () => setCurrentDate(new Date(year, month, currentDate.getDate() + 7));
  const prevDay = () => { const d = new Date(currentDate); d.setDate(d.getDate() - 1); setCurrentDate(d); };
  const nextDay = () => { const d = new Date(currentDate); d.setDate(d.getDate() + 1); setCurrentDate(d); };

  // Month view
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const cells: { date: string; day: number; current: boolean }[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, daysInPrevMonth - i);
    cells.push({ date: d.toISOString().slice(0, 10), day: d.getDate(), current: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ date: new Date(year, month, i).toISOString().slice(0, 10), day: i, current: true });
  }
  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i);
    cells.push({ date: d.toISOString().slice(0, 10), day: d.getDate(), current: false });
  }

  // Week view
  const weekStart = new Date(currentDate);
  const dayOfWeek = currentDate.getDay();
  weekStart.setDate(currentDate.getDate() - dayOfWeek);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const selectedItems = getItemsForDate(selectedDate);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="p-4 md:p-8 space-y-6 animate-page-enter pb-24 md:pb-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-serif text-2xl md:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>Calendar</h2>
        <div className="flex items-center gap-1.5">
          {(['month', 'week', 'day'] as ViewMode[]).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors capitalize ${view === v ? 'bg-secondary-surface font-medium' : 'text-muted hover:text-secondary'}`}
              style={view === v ? { color: 'var(--accent-sage)' } : {}}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { if (view === 'month') prevMonth(); else if (view === 'week') prevWeek(); else prevDay(); }}
          className="p-2 rounded-lg hover:bg-secondary-surface text-secondary transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
          {view === 'month' && `${monthNames[month]} ${year}`}
          {view === 'week' && `${weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
          {view === 'day' && currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </h3>
        <button
          onClick={() => { if (view === 'month') nextMonth(); else if (view === 'week') nextWeek(); else nextDay(); }}
          className="p-2 rounded-lg hover:bg-secondary-surface text-secondary transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar grid */}
        <div className="lg:col-span-2 card-surface p-4">
          {view === 'month' && (
            <>
              <div className="grid grid-cols-7 mb-2">
                {dayNames.map(d => (
                  <div key={d} className="text-center text-xs font-medium text-muted py-2">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {cells.map((cell, i) => {
                  const isSelected = cell.date === selectedDate;
                  const isToday = cell.date === today;
                  const has = hasItems(cell.date);
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(cell.date)}
                      className={`aspect-square rounded-lg flex flex-col items-center justify-center transition-all text-sm ${
                        !cell.current ? 'opacity-30' : ''
                      } ${isSelected ? 'scale-105' : 'hover:bg-secondary-surface/50'}`}
                      style={isSelected ? {
                        background: 'var(--accent-sage)',
                        color: 'white',
                      } : {
                        background: isToday ? 'var(--accent-sage)' + '15' : 'transparent',
                        color: isToday ? 'var(--accent-sage)' : 'var(--text-secondary)',
                        fontWeight: isToday ? 600 : 400,
                      }}
                    >
                      {cell.day}
                      {has && (
                        <div className="w-1 h-1 rounded-full mt-0.5" style={{ background: isSelected ? 'white' : 'var(--accent-sage)' }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {view === 'week' && (
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map(d => {
                const dateStr = d.toISOString().slice(0, 10);
                const isSelected = dateStr === selectedDate;
                const isToday = dateStr === today;
                const has = hasItems(dateStr);
                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`rounded-xl p-3 flex flex-col items-center gap-1 transition-all ${isSelected ? 'scale-105' : 'hover:bg-secondary-surface/50'}`}
                    style={isSelected ? { background: 'var(--accent-sage)', color: 'white' } : { color: 'var(--text-secondary)' }}
                  >
                    <span className="text-xs">{dayNames[d.getDay()]}</span>
                    <span className="text-lg font-semibold" style={isToday && !isSelected ? { color: 'var(--accent-sage)' } : {}}>
                      {d.getDate()}
                    </span>
                    {has && <div className="w-1.5 h-1.5 rounded-full" style={{ background: isSelected ? 'white' : 'var(--accent-sage)' }} />}
                  </button>
                );
              })}
            </div>
          )}

          {view === 'day' && (
            <div className="py-8 text-center">
              <p className="text-4xl font-serif font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {currentDate.getDate()}
              </p>
              <p className="text-sm text-muted">{currentDate.toLocaleDateString('en-US', { weekday: 'long' })}</p>
            </div>
          )}
        </div>

        {/* Selected date items */}
        <div className="card-surface p-5">
          <h3 className="text-sm font-medium text-muted uppercase tracking-wide mb-4">
            {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </h3>

          {selectedItems.tasks.length === 0 && selectedItems.goals.length === 0 && selectedItems.projects.length === 0 ? (
            <div className="py-8 text-center">
              <CalIcon size={28} className="text-muted mx-auto mb-2" />
              <p className="text-sm text-muted">Nothing scheduled.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedItems.tasks.map(t => (
                <div key={t.id} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-sage-500" />
                  <span style={{ color: 'var(--text-secondary)' }}>{t.title}</span>
                  {t.dueTime && <span className="text-xs text-muted ml-auto">{t.dueTime}</span>}
                </div>
              ))}
              {selectedItems.goals.map(g => (
                <div key={g.id} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-lavender-500" />
                  <span style={{ color: 'var(--text-secondary)' }}>{g.title}</span>
                  <span className="text-xs text-muted ml-auto">deadline</span>
                </div>
              ))}
              {selectedItems.projects.map(p => (
                <div key={p.id} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-blush-500" />
                  <span style={{ color: 'var(--text-secondary)' }}>{p.name}</span>
                  <span className="text-xs text-muted ml-auto">deadline</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
