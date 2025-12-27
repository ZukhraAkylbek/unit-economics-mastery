import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { STUDENTS } from '@/lib/constants';

interface LoginPageProps {
  onLogin: (user: { name: string; telegram: string }) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [name, setName] = useState('');
  const [telegram, setTelegram] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCheckAccess = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const normalizedTelegram = telegram.startsWith('@') ? telegram : `@${telegram}`;
      const student = STUDENTS.find(
        (s) => s.telegram.toLowerCase() === normalizedTelegram.toLowerCase()
      );

      if (student || telegram.toLowerCase() === 'demo') {
        onLogin({ name: name || 'Студент', telegram: normalizedTelegram });
        toast({
          title: 'Добро пожаловать!',
          description: 'Доступ подтвержден.',
        });
        navigate('/office');
      } else {
        toast({
          title: 'Доступ ограничен',
          description: 'Ваш аккаунт не найден в списке.',
          variant: 'destructive',
        });
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10 opacity-0 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            MVP Studio
          </h1>
          <p className="text-muted-foreground">
            Unit Economics Master
          </p>
        </div>

        {/* Form */}
        <div className="card-glass p-8 opacity-0 animate-fade-in stagger-1">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Имя
              </label>
              <Input
                placeholder="Как тебя зовут?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Telegram
              </label>
              <Input
                placeholder="@username"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                className="h-12 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <Button
              size="lg"
              className="w-full h-12 rounded-xl font-semibold btn-glow"
              onClick={handleCheckAccess}
              disabled={!telegram || isLoading}
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Войти
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Демо-доступ: <span className="text-primary font-medium">demo</span>
          </p>
        </div>
      </div>
    </div>
  );
}
