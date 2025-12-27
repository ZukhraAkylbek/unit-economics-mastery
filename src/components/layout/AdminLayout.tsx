import { Outlet } from 'react-router-dom';
import { AdminNav } from './AdminNav';
import { LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  user?: { name: string; telegram: string } | null;
  onLogout?: () => void;
}

export function AdminLayout({ user, onLogout }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">Админ Панель</h1>
              <p className="text-xs text-muted-foreground">{user?.telegram}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Выйти
          </Button>
        </div>
      </header>
      <main className="container pb-24 pt-6">
        <Outlet />
      </main>
      <AdminNav />
    </div>
  );
}
