import { useState } from 'react';
import { Moon, BookHeart } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import EmptyState from '@/components/EmptyState';

export default function Reflection() {
  const { data, addReflection, deleteReflection } = useApp();
  const [wentWell, setWentWell] = useState('');
  const [couldBeBetter, setCouldBeBetter] = useState('');
  const [proudOf, setProudOf] = useState('');

  const today = new Date().toISOString().slice(0, 10);
  const todayReflection = data.reflections.find(r => r.date === today);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wentWell.trim() && !couldBeBetter.trim() && !proudOf.trim()) return;
    addReflection({ wentWell, couldBeBetter, proudOf });
    setWentWell(''); setCouldBeBetter(''); setProudOf('');
  };

  const questions = [
    { key: 'wentWell', label: 'What went well today?', placeholder: 'A moment of progress, a kind word, a small win...', value: wentWell, setter: setWentWell },
    { key: 'couldBeBetter', label: 'What could have gone better?', placeholder: 'Something to learn from, gently...', value: couldBeBetter, setter: setCouldBeBetter },
    { key: 'proudOf', label: "What's one thing you're proud of?", placeholder: 'You deserve to celebrate this...', value: proudOf, setter: setProudOf },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 animate-page-enter pb-24 md:pb-8 max-w-3xl mx-auto">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: 'var(--accent-lavender)' + '15' }}>
          <Moon size={26} style={{ color: 'var(--accent-lavender)' }} />
        </div>
        <h2 className="font-serif text-2xl md:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>Evening Reflection</h2>
        <p className="text-sm text-muted mt-1 font-serif italic">Take a moment to pause and look back.</p>
      </div>

      {/* Form */}
      {todayReflection ? (
        <div className="card-surface p-6 text-center">
          <BookHeart size={32} className="mx-auto mb-3 text-sage-500" />
          <p className="text-sm text-secondary">You've reflected today. Come back tomorrow for a new entry.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card-surface p-6 space-y-5">
          {questions.map(q => (
            <div key={q.key}>
              <label className="text-sm font-medium block mb-2 font-serif italic" style={{ color: 'var(--text-secondary)' }}>
                {q.label}
              </label>
              <textarea
                value={q.value}
                onChange={e => q.setter(e.target.value)}
                placeholder={q.placeholder}
                className="input-field min-h-[80px] resize-none"
              />
            </div>
          ))}
          <button type="submit" className="btn-primary w-full">Save Reflection</button>
        </form>
      )}

      {/* Timeline */}
      <div>
        <h3 className="text-sm font-medium text-muted uppercase tracking-wide mb-4">Past Reflections</h3>
        {data.reflections.length === 0 ? (
          <EmptyState
            title="No reflections yet."
            message="Your story begins with the first page."
            icon={<BookHeart size={32} className="text-sage-400" />}
          />
        ) : (
          <div className="space-y-4">
            {data.reflections.map((r, i) => (
              <div key={r.id} className="card-surface p-5 relative animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                {/* Timeline dot */}
                <div className="absolute -left-1.5 top-7 w-3 h-3 rounded-full" style={{ background: 'var(--accent-lavender)' }} />

                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {new Date(r.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                  <button
                    onClick={() => deleteReflection(r.id)}
                    className="text-xs text-muted hover:text-blush-500 transition-colors"
                  >
                    Delete
                  </button>
                </div>

                <div className="space-y-2.5">
                  {r.wentWell && (
                    <div>
                      <span className="text-xs font-medium text-sage-500">Went well</span>
                      <p className="text-sm text-secondary mt-0.5">{r.wentWell}</p>
                    </div>
                  )}
                  {r.couldBeBetter && (
                    <div>
                      <span className="text-xs font-medium text-blush-500">Could be better</span>
                      <p className="text-sm text-secondary mt-0.5">{r.couldBeBetter}</p>
                    </div>
                  )}
                  {r.proudOf && (
                    <div>
                      <span className="text-xs font-medium text-lavender-500">Proud of</span>
                      <p className="text-sm text-secondary mt-0.5">{r.proudOf}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
