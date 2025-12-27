import { useState } from 'react';
import { User, LogOut, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  user?: { name: string; telegram: string } | null;
  onLogout?: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/office" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="hidden sm:block">
            <div className="font-display font-bold text-foreground text-lg">
              MVP Studio
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
              <span className="text-lg">🪙</span>
              <span className="font-semibold text-foreground">500</span>
            </div>
          )}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary transition-colors"
              >
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-card border border-border shadow-elevated animate-scale-in origin-top-right">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors rounded-t-xl text-sm"
                    onClick={() => setShowDropdown(false)}
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Профиль</span>
                  </Link>
                  <button
                    onClick={() => {
                      onLogout?.();
                      setShowDropdown(false);
                      navigate('/');
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors rounded-b-xl w-full text-left text-sm text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Выйти</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button onClick={() => navigate('/')}>
              Войти
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
