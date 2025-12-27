import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

interface AppLayoutProps {
  user?: { name: string; telegram: string } | null;
  onLogout?: () => void;
}

export function AppLayout({ user, onLogout }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={onLogout} />
      <main className="container pb-24 pt-6">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
