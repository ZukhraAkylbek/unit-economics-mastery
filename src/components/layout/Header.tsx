import { useState } from 'react';
import { User, LogOut } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/office" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
            P
          </div>
          <div className="hidden sm:block">
            <div className="font-display font-bold text-foreground">
              PROJECT <span className="text-primary">LAB</span>
            </div>
            <div className="text-xs text-muted-foreground tracking-wider">
              GROWTH INTELLIGENCE SYSTEM
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-accent bg-accent/10">
            <span className="text-accent">🏆</span>
            <span className="font-semibold text-foreground">500 PC</span>
          </div>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-colors"
              >
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-semibold text-foreground">LEAD PM</div>
                  <div className="text-xs text-primary">ONLINE • MVP STUDIO</div>
                </div>
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-card border border-border shadow-elevated animate-fade-in">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-3 hover:bg-muted transition-colors rounded-t-xl"
                    onClick={() => setShowDropdown(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>Профиль</span>
                  </Link>
                  <button
                    onClick={() => {
                      onLogout?.();
                      setShowDropdown(false);
                      navigate('/');
                    }}
                    className="flex items-center gap-2 px-4 py-3 hover:bg-muted transition-colors rounded-b-xl w-full text-left text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Выйти</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button variant="hero" onClick={() => navigate('/')}>
              Войти
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
