import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const messages = [
  'One thing at a time.',
  'Progress over perfection.',
  'Stay in the moment.',
  'Give this moment your attention.',
  'Breathe in. Focus out.',
  'Small steps, big change.',
];

const modes = [
  { label: '25 min', value: 25 },
  { label: '45 min', value: 45 },
  { label: '60 min', value: 60 },
];

export default function Focus() {
  const { data, addFocusSession } = useApp();
  const [duration, setDuration] = useState(25);
  const [custom, setCustom] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [label, setLabel] = useState('');
  const [messageIdx, setMessageIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            // Session complete
            setRunning(false);
            addFocusSession(duration, label || 'Focus session');
            setMessageIdx(Math.floor(Math.random() * messages.length));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, duration, label, addFocusSession]);

  const setMode = (mins: number) => {
    setRunning(false);
    setDuration(mins);
    setSecondsLeft(mins * 60);
  };

  const handleCustom = () => {
    const mins = parseInt(custom);
    if (mins > 0 && mins <= 180) {
      setMode(mins);
      setCustom('');
    }
  };

  const handleStart = () => {
    if (secondsLeft === 0) setSecondsLeft(duration * 60);
    setRunning(true);
  };
  const handlePause = () => setRunning(false);
  const handleReset = () => {
    setRunning(false);
    setSecondsLeft(duration * 60);
  };

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const progress = ((duration * 60 - secondsLeft) / (duration * 60)) * 100;

  const todayFocus = data.focusSessions
    .filter(s => s.completedAt === new Date().toISOString().slice(0, 10))
    .reduce((sum, s) => sum + s.duration, 0);
  const totalFocus = data.focusSessions.reduce((sum, s) => sum + s.duration, 0);

  return (
    <div className="p-4 md:p-8 animate-page-enter pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-center mb-1" style={{ color: 'var(--text-primary)' }}>Focus Mode</h2>
        <p className="text-sm text-muted text-center mb-8 font-serif italic">{messages[messageIdx]}</p>

        {/* Timer */}
        <div className="card-surface p-8 md:p-12 flex flex-col items-center">
          {/* Progress ring */}
          <div className="relative w-64 h-64 mb-8">
            <svg className="absolute inset-0 -rotate-90" width="256" height="256">
              <circle cx="128" cy="128" r="120" fill="none" stroke="var(--border-soft)" strokeWidth="6" />
              <circle
                cx="128" cy="128" r="120" fill="none"
                stroke="var(--accent-sage)" strokeWidth="6"
                strokeDasharray={2 * Math.PI * 120}
                strokeDashoffset={2 * Math.PI * 120 - (progress / 100) * 2 * Math.PI * 120}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-serif text-6xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
              </span>
              <span className="text-sm text-muted mt-2">{duration} minute session</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mb-8">
            {!running ? (
              <button onClick={handleStart} className="w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: 'var(--accent-sage)', color: 'white' }}>
                <Play size={28} fill="white" />
              </button>
            ) : (
              <button onClick={handlePause} className="w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: 'var(--accent-blush)', color: 'white' }}>
                <Pause size={28} fill="white" />
              </button>
            )}
            <button onClick={handleReset} className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-soft text-secondary hover:bg-secondary-surface transition-all hover:scale-105">
              <RotateCcw size={22} />
            </button>
          </div>

          {/* Mode selection */}
          <div className="flex items-center gap-2 mb-4">
            {modes.map(m => (
              <button
                key={m.value}
                onClick={() => setMode(m.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  duration === m.value ? 'scale-105' : ''
                }`}
                style={{
                  background: duration === m.value ? 'var(--accent-sage)' + '20' : 'var(--bg-secondary)',
                  color: duration === m.value ? 'var(--accent-sage)' : 'var(--text-muted)',
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Custom */}
          <div className="flex gap-2 w-full max-w-xs">
            <input
              type="number"
              value={custom}
              onChange={e => setCustom(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleCustom(); } }}
              placeholder="Custom (min)"
              className="input-field text-sm"
              min="1" max="180"
            />
            <button onClick={handleCustom} className="btn-secondary text-sm px-4">Set</button>
          </div>

          {/* Label */}
          <input
            value={label}
            onChange={e => setLabel(e.target.value)}
            placeholder="What are you focusing on?"
            className="input-field text-sm mt-4 w-full max-w-xs text-center"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="card-surface p-5 text-center">
            <p className="font-serif text-3xl font-bold" style={{ color: 'var(--accent-sage)' }}>{todayFocus}</p>
            <p className="text-xs text-muted mt-1">minutes today</p>
          </div>
          <div className="card-surface p-5 text-center">
            <p className="font-serif text-3xl font-bold" style={{ color: 'var(--accent-lavender)' }}>{data.focusSessions.length}</p>
            <p className="text-xs text-muted mt-1">total sessions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
