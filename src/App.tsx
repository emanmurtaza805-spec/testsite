import { useState, useEffect } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import BotanicalBackground from '@/components/BotanicalBackground';
import Sidebar, { type PageKey } from '@/components/Sidebar';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import ToastContainer from '@/components/ToastContainer';
import CommandPalette from '@/components/CommandPalette';
import NotificationPanel from '@/components/NotificationPanel';

import Landing from '@/pages/Landing';
import Auth from '@/pages/Auth';
import Onboarding from '@/pages/Onboarding';
import Dashboard from '@/pages/Dashboard';
import MyDay from '@/pages/MyDay';
import Goals from '@/pages/Goals';
import Habits from '@/pages/Habits';
import Projects from '@/pages/Projects';
import Focus from '@/pages/Focus';
import Notes from '@/pages/Notes';
import Calendar from '@/pages/Calendar';
import Insights from '@/pages/Insights';
import Reflection from '@/pages/Reflection';
import Settings from '@/pages/Settings';

type AuthScreen = 'landing' | 'login' | 'signup' | 'onboarding';

function AppContent() {
  const { data, isLoggedIn } = useApp();
  const [authScreen, setAuthScreen] = useState<AuthScreen>('landing');
  const [page, setPage] = useState<PageKey>('dashboard');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [quickAction, setQuickAction] = useState<string | null>(null);

  // Ctrl+K command palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isLoggedIn) setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isLoggedIn]);

  // Not logged in: show auth flow
  if (!isLoggedIn) {
    if (authScreen === 'landing') {
      return (
        <>
          <Landing
            onGetStarted={() => setAuthScreen('signup')}
            onLogin={() => setAuthScreen('login')}
          />
          <ToastContainer />
        </>
      );
    }
    if (authScreen === 'onboarding' || (data.profile && !data.profile.onboarded)) {
      return (
        <>
          <Onboarding onComplete={() => setAuthScreen('landing')} />
          <ToastContainer />
        </>
      );
    }
    return (
      <>
        <Auth
          mode={authScreen === 'signup' ? 'signup' : 'login'}
          onBack={() => setAuthScreen('landing')}
          onSuccess={() => {
            // After signup, go to onboarding; after login, check onboarding status
            if (data.profile && !data.profile.onboarded) {
              setAuthScreen('onboarding');
            } else {
              setAuthScreen('landing');
            }
          }}
          onSwitch={() => setAuthScreen(authScreen === 'signup' ? 'login' : 'signup')}
        />
        <ToastContainer />
      </>
    );
  }

  // Check onboarding
  if (data.profile && !data.profile.onboarded) {
    return (
      <>
        <Onboarding onComplete={() => {}} />
        <ToastContainer />
      </>
    );
  }

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard onNavigate={setPage} />;
      case 'myday': return <MyDay quickAction={quickAction} clearQuickAction={() => setQuickAction(null)} />;
      case 'goals': return <Goals quickAction={quickAction} clearQuickAction={() => setQuickAction(null)} />;
      case 'habits': return <Habits quickAction={quickAction} clearQuickAction={() => setQuickAction(null)} />;
      case 'projects': return <Projects />;
      case 'focus': return <Focus />;
      case 'notes': return <Notes quickAction={quickAction} clearQuickAction={() => setQuickAction(null)} />;
      case 'calendar': return <Calendar />;
      case 'insights': return <Insights />;
      case 'reflection': return <Reflection />;
      case 'settings': return <Settings />;
      default: return <Dashboard onNavigate={setPage} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-app">
      <BotanicalBackground />
      <Sidebar current={page} onNavigate={setPage} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenSearch={() => setSearchOpen(true)}
          onOpenNotifications={() => setNotifOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>

      <BottomNav current={page} onNavigate={setPage} />
      <ToastContainer />
      <CommandPalette
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={setPage}
        onQuickAction={setQuickAction}
      />
      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
