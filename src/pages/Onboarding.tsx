import { useState } from 'react';
import { GraduationCap, Briefcase, Wallet, Activity, Target, Brain, Palette, FileText, ArrowRight, Leaf } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import BotanicalBackground from '@/components/BotanicalBackground';

interface OnboardingProps {
  onComplete: () => void;
}

const focusAreas = [
  { key: 'Study', icon: GraduationCap },
  { key: 'Work', icon: Briefcase },
  { key: 'Finance', icon: Wallet },
  { key: 'Fitness', icon: Activity },
  { key: 'Goals', icon: Target },
  { key: 'Personal Growth', icon: Brain },
  { key: 'Creative Projects', icon: Palette },
  { key: 'Organization', icon: FileText },
];

const focusOptions = [
  'Building better habits',
  'Learning something new',
  'Growing my career',
  'Finding balance',
  'Getting organized',
  'Staying focused',
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const { data, completeOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [mainFocus, setMainFocus] = useState('');

  const toggleArea = (key: string) => {
    setSelected(prev =>
      prev.includes(key) ? prev.filter(a => a !== key) : [...prev, key]
    );
  };

  const finish = () => {
    completeOnboarding(selected, mainFocus || 'Finding balance');
    onComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <BotanicalBackground />

      <div className="w-full max-w-2xl card-surface p-8 md:p-10 animate-slide-up relative z-10">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === step ? 32 : 8,
                background: i <= step ? 'var(--accent-sage)' : 'var(--border-medium)',
              }}
            />
          ))}
        </div>

        {step === 0 && (
          <div className="text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--accent-sage)' + '15' }}>
              <Leaf size={28} style={{ color: 'var(--accent-sage)' }} />
            </div>
            <h2 className="font-serif text-3xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              What matters most to you?
            </h2>
            <p className="text-sm text-secondary mb-8">Select all that resonate. You can change this later.</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {focusAreas.map(area => {
                const Icon = area.icon;
                const isSel = selected.includes(area.key);
                return (
                  <button
                    key={area.key}
                    onClick={() => toggleArea(area.key)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 ${
                      isSel ? 'scale-105' : 'hover:scale-105'
                    }`}
                    style={{
                      borderColor: isSel ? 'var(--accent-sage)' : 'var(--border-soft)',
                      background: isSel ? 'var(--accent-sage)' + '10' : 'var(--bg-card)',
                    }}
                  >
                    <Icon size={26} style={{ color: isSel ? 'var(--accent-sage)' : 'var(--text-secondary)' }} />
                    <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{area.key}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep(1)}
              disabled={selected.length === 0}
              className="btn-primary mt-8 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="text-center animate-fade-in">
            <h2 className="font-serif text-3xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              What's your main focus right now?
            </h2>
            <p className="text-sm text-secondary mb-8">Choose one that feels most true today.</p>

            <div className="flex flex-wrap gap-3 justify-center">
              {focusOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => setMainFocus(opt)}
                  className={`px-5 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                    mainFocus === opt ? 'scale-105' : 'hover:scale-105'
                  }`}
                  style={{
                    borderColor: mainFocus === opt ? 'var(--accent-sage)' : 'var(--border-soft)',
                    background: mainFocus === opt ? 'var(--accent-sage)' + '10' : 'var(--bg-card)',
                    color: mainFocus === opt ? 'var(--accent-sage)' : 'var(--text-secondary)',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="flex gap-3 justify-center mt-8">
              <button onClick={() => setStep(0)} className="btn-secondary">Back</button>
              <button
                onClick={() => setStep(2)}
                disabled={!mainFocus}
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="text-center animate-fade-in">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 animate-scale-in" style={{ background: 'var(--accent-sage)' + '15' }}>
              <Leaf size={36} style={{ color: 'var(--accent-sage)' }} />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-3 leading-tight" style={{ color: 'var(--text-primary)' }}>
              Welcome to your little corner of the world, {data.profile?.name?.split(' ')[0] || 'friend'}.
            </h2>
            <p className="text-base text-secondary mb-8 max-w-md mx-auto leading-relaxed">
              Take a breath. This is your space to grow, one gentle step at a time.
            </p>
            <button onClick={finish} className="btn-primary text-base px-8 py-3.5 inline-flex items-center gap-2">
              Enter LIFLO <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
