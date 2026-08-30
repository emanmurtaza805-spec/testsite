import { CheckCircle, Target, Repeat, FolderOpen, BookOpen, Timer, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import Orbit from '@/components/Orbit';
import { useApp } from '@/context/AppContext';
import BotanicalBackground from '@/components/BotanicalBackground';

interface LandingProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export default function Landing({ onGetStarted, onLogin }: LandingProps) {
  const { data, toggleTheme } = useApp();
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const orbitNodes = [
    { key: 'goals', label: 'Goals', icon: Target, color: '#5f8a52' },
    { key: 'tasks', label: 'Tasks', icon: CheckCircle, color: '#cf8888' },
    { key: 'habits', label: 'Habits', icon: Repeat, color: '#9d83ba' },
    { key: 'projects', label: 'Projects', icon: FolderOpen, color: '#5a8a76' },
    { key: 'notes', label: 'Notes', icon: BookOpen, color: '#7d6598' },
    { key: 'focus', label: 'Focus', icon: Timer, color: '#82a874' },
  ];

  const features = [
    { icon: Sun, title: 'My Day', desc: 'Plan your day with tasks, events, and reminders.' },
    { icon: Target, title: 'Goals', desc: 'Break dreams into milestones. Watch progress grow.' },
    { icon: Repeat, title: 'Habits', desc: 'Build streaks with a beautiful habit heatmap.' },
    { icon: Timer, title: 'Focus Mode', desc: 'A peaceful timer for deep, distraction-free work.' },
    { icon: BookOpen, title: 'Notes', desc: 'Capture ideas on elegant digital stationery.' },
    { icon: FolderOpen, title: 'Projects', desc: 'Organize work with project workspaces.' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BotanicalBackground />

      {/* Top nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
        <h1 className="font-serif text-3xl font-bold tracking-tight" style={{ color: 'var(--accent-sage)' }}>LIFLO</h1>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2 rounded-xl border border-soft bg-card-surface hover:bg-secondary-surface transition-colors">
            {data.settings.theme === 'light' ? <Moon size={18} className="text-secondary" /> : <Sun size={18} className="text-secondary" />}
          </button>
          <button onClick={onLogin} className="btn-secondary text-sm">Log In</button>
          <button onClick={onGetStarted} className="btn-primary text-sm">Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-12 md:pt-20 pb-16">
        <div className="animate-fade-in">
          <p className="text-sm md:text-base text-muted mb-3 font-serif italic">Your life. Connected.</p>
          <h1 className="font-serif text-6xl md:text-8xl font-bold mb-6 tracking-tight" style={{ color: 'var(--text-primary)' }}>
            LIFLO
          </h1>
          <p className="text-lg md:text-xl text-secondary max-w-xl mx-auto leading-relaxed">
            One peaceful space for your goals, tasks, habits, projects, notes, and everyday life.
          </p>
        </div>

        {/* Orbit visualization */}
        <div className="my-12 animate-scale-in">
          <Orbit nodes={orbitNodes} size={380} interactive={false} />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={onGetStarted} className="btn-primary text-base px-8 py-3.5">Get Started</button>
          <button onClick={onLogin} className="btn-secondary text-base px-8 py-3.5">Log In</button>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 md:px-12 py-16 max-w-5xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-center mb-12" style={{ color: 'var(--text-primary)' }}>
          Everything grows here.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="card-surface card-hover p-6"
                onMouseEnter={() => setHoveredFeature(f.title)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'var(--accent-sage)' + '15' }}>
                  <Icon size={24} style={{ color: 'var(--accent-sage)' }} />
                </div>
                <h3 className="text-lg font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
                <p className="text-sm text-secondary leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quote */}
      <section className="relative z-10 px-6 py-20 text-center">
        <p className="font-serif text-2xl md:text-3xl italic max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          "Small steps, taken daily, become a life well lived."
        </p>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 text-center border-t border-soft">
        <p className="text-sm text-muted">LIFLO — Your life. Connected.</p>
      </footer>
    </div>
  );
}
