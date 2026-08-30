import { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Leaf } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import BotanicalBackground from '@/components/BotanicalBackground';

interface AuthProps {
  mode: 'login' | 'signup';
  onBack: () => void;
  onSuccess: () => void;
  onSwitch: () => void;
}

export default function Auth({ mode, onBack, onSuccess, onSwitch }: AuthProps) {
  const { login, signup, showToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isSignup = mode === 'signup';

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (isSignup && !name.trim()) e.name = 'Please enter your name';
    if (!email.trim()) e.email = 'Please enter your email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Please enter a valid email';
    if (!password) e.password = 'Please enter a password';
    else if (password.length < 4) e.password = 'Password must be at least 4 characters';
    if (isSignup && password !== confirmPassword) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    if (isSignup) {
      signup(name.trim(), email.trim(), password);
      onSuccess();
    } else {
      const ok = login(email.trim(), password);
      if (ok) {
        onSuccess();
      } else {
        setErrors({ email: 'Invalid email or password. Try signing up first.' });
        showToast('Account not found. Try signing up.', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <BotanicalBackground />

      <button onClick={onBack} className="absolute top-6 left-6 flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors z-10">
        <ArrowLeft size={18} /> Back
      </button>

      <div className="w-full max-w-md card-surface p-8 animate-slide-up relative z-10">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: 'var(--accent-sage)' + '15' }}>
            <Leaf size={28} style={{ color: 'var(--accent-sage)' }} />
          </div>
          <h1 className="font-serif text-3xl font-bold" style={{ color: 'var(--accent-sage)' }}>LIFLO</h1>
          <p className="text-sm text-muted mt-1 font-serif italic">
            {isSignup ? 'Begin your journey.' : 'Welcome back.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Jane Bloom"
                className="input-field"
              />
              {errors.name && <p className="text-xs text-blush-500 mt-1">{errors.name}</p>}
            </div>
          )}

          <div>
            <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="jane@example.com"
              className="input-field"
            />
            {errors.email && <p className="text-xs text-blush-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-blush-500 mt-1">{errors.password}</p>}
          </div>

          {isSignup && (
            <div>
              <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
              />
              {errors.confirm && <p className="text-xs text-blush-500 mt-1">{errors.confirm}</p>}
            </div>
          )}

          {!isSignup && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded accent-sage-500"
                />
                Remember me
              </label>
              <button type="button" onClick={() => setForgotOpen(true)} className="text-sm text-muted hover:text-secondary transition-colors">
                Forgot password?
              </button>
            </div>
          )}

          <button type="submit" className="btn-primary w-full text-base">
            {isSignup ? 'Create My LIFLO' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-sm text-secondary mt-5">
          {isSignup ? 'Already have an account? ' : "Don't have one yet? "}
          <button onClick={onSwitch} className="font-medium hover:underline" style={{ color: 'var(--accent-sage)' }}>
            {isSignup ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </div>

      {/* Forgot password modal */}
      {forgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setForgotOpen(false)} />
          <div className="relative card-surface p-6 max-w-sm modal-enter text-center">
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Forgot Password?</h3>
            <p className="text-sm text-secondary mb-4">
              This is a demo app. Your account is stored locally in your browser. Just sign up again with the same email.
            </p>
            <button onClick={() => setForgotOpen(false)} className="btn-primary w-full">Got it</button>
          </div>
        </div>
      )}
    </div>
  );
}
