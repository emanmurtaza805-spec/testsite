import { useState, useRef } from 'react';
import { User, Palette, Bell, Download, Upload, Trash2, LogOut, Sun, Moon } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import ConfirmDialog from '@/components/ConfirmDialog';
import type { TaskPriority } from '@/lib/types';

export default function Settings() {
  const {
    data, updateProfile, updateSettings, toggleTheme,
    loadDemoData, clearAllData, exportData, importData, logout,
  } = useApp();
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const profile = data.profile;
  const settings = data.settings;

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => importData(reader.result as string);
    reader.readAsText(file);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 animate-page-enter pb-24 md:pb-8 max-w-3xl mx-auto">
      <h2 className="font-serif text-2xl md:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>Settings</h2>

      {/* Profile */}
      <section className="card-surface p-6">
        <h3 className="text-sm font-medium text-muted uppercase tracking-wide mb-4 flex items-center gap-2">
          <User size={16} /> Profile
        </h3>
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
            style={{ background: 'var(--accent-sage)' }}
          >
            {profile?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="flex-1">
            <input
              value={profile?.name || ''}
              onChange={e => updateProfile({ name: e.target.value })}
              className="input-field mb-2"
              placeholder="Your name"
            />
            <input
              value={profile?.email || ''}
              onChange={e => updateProfile({ email: e.target.value })}
              className="input-field text-sm"
              placeholder="Your email"
            />
          </div>
        </div>
      </section>

      {/* Appearance */}
      <section className="card-surface p-6">
        <h3 className="text-sm font-medium text-muted uppercase tracking-wide mb-4 flex items-center gap-2">
          <Palette size={16} /> Appearance
        </h3>
        <div className="flex gap-3">
          <button
            onClick={() => updateSettings({ theme: 'light' })}
            className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${settings.theme === 'light' ? 'scale-105' : ''}`}
            style={{ borderColor: settings.theme === 'light' ? 'var(--accent-sage)' : 'var(--border-soft)' }}
          >
            <Sun size={20} style={{ color: 'var(--accent-sage)' }} />
            <span className="text-sm font-medium text-secondary">Light</span>
          </button>
          <button
            onClick={() => updateSettings({ theme: 'dark' })}
            className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${settings.theme === 'dark' ? 'scale-105' : ''}`}
            style={{ borderColor: settings.theme === 'dark' ? 'var(--accent-sage)' : 'var(--border-soft)' }}
          >
            <Moon size={20} style={{ color: 'var(--accent-lavender)' }} />
            <span className="text-sm font-medium text-secondary">Dark</span>
          </button>
        </div>
      </section>

      {/* Preferences */}
      <section className="card-surface p-6 space-y-4">
        <h3 className="text-sm font-medium text-muted uppercase tracking-wide flex items-center gap-2">
          <Bell size={16} /> Preferences
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-secondary">Notifications</span>
          <button
            onClick={() => updateSettings({ notifications: !settings.notifications })}
            className="relative w-12 h-6 rounded-full transition-colors"
            style={{ background: settings.notifications ? 'var(--accent-sage)' : 'var(--border-medium)' }}
          >
            <div
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform"
              style={{ transform: settings.notifications ? 'translateX(26px)' : 'translateX(2px)' }}
            />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-secondary">Default Task Priority</span>
          <select
            value={settings.defaultPriority}
            onChange={e => updateSettings({ defaultPriority: e.target.value as TaskPriority })}
            className="input-field w-auto text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-secondary">Week Starts On</span>
          <select
            value={settings.weekStart}
            onChange={e => updateSettings({ weekStart: e.target.value as 'Sunday' | 'Monday' })}
            className="input-field w-auto text-sm"
          >
            <option value="Monday">Monday</option>
            <option value="Sunday">Sunday</option>
          </select>
        </div>
      </section>

      {/* Data */}
      <section className="card-surface p-6 space-y-3">
        <h3 className="text-sm font-medium text-muted uppercase tracking-wide mb-2">Data</h3>
        <button onClick={loadDemoData} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary-surface transition-colors text-sm text-secondary text-left">
          <Download size={18} className="text-muted" /> Load Demo Data
        </button>
        <button onClick={exportData} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary-surface transition-colors text-sm text-secondary text-left">
          <Download size={18} className="text-muted" /> Export Data
        </button>
        <button onClick={() => fileRef.current?.click()} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary-surface transition-colors text-sm text-secondary text-left">
          <Upload size={18} className="text-muted" /> Import Data
        </button>
        <input ref={fileRef} type="file" accept="application/json" onChange={handleImport} className="hidden" />
        <button onClick={() => setConfirmClear(true)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-blush-100 dark:hover:bg-blush-500/20 transition-colors text-sm text-blush-500 text-left">
          <Trash2 size={18} /> Clear All Data
        </button>
      </section>

      {/* Account */}
      <section className="card-surface p-6">
        <h3 className="text-sm font-medium text-muted uppercase tracking-wide mb-3">Account</h3>
        <button
          onClick={() => setConfirmLogout(true)}
          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-blush-100 dark:hover:bg-blush-500/20 transition-colors text-sm text-blush-500"
        >
          <LogOut size={18} /> Log Out
        </button>
      </section>

      <ConfirmDialog
        open={confirmClear}
        title="Clear All Data?"
        message="This will remove all your tasks, goals, habits, projects, notes, and reflections. This cannot be undone."
        confirmLabel="Clear"
        onConfirm={() => { clearAllData(); setConfirmClear(false); }}
        onCancel={() => setConfirmClear(false)}
      />
      <ConfirmDialog
        open={confirmLogout}
        title="Log Out?"
        message="You'll need to log back in to access your LIFLO."
        confirmLabel="Log Out"
        onConfirm={() => { logout(); setConfirmLogout(false); }}
        onCancel={() => setConfirmLogout(false)}
      />
    </div>
  );
}
