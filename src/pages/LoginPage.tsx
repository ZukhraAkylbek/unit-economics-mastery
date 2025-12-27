import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { STUDENTS } from '@/lib/constants';

interface LoginPageProps {
  onLogin: (user: { name: string; telegram: string }) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [telegram, setTelegram] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCheckAccess = () => {
    setIsLoading(true);
    
    // Simulate API check
    setTimeout(() => {
      const normalizedTelegram = telegram.startsWith('@') ? telegram : `@${telegram}`;
      const student = STUDENTS.find(
        (s) => s.telegram.toLowerCase() === normalizedTelegram.toLowerCase()
      );

      if (student || telegram.toLowerCase() === 'demo') {
        onLogin({ name: name || 'Студент', telegram: normalizedTelegram });
        toast({
          title: 'Добро пожаловать!',
          description: 'Доступ подтвержден. Начинаем обучение.',
        });
        navigate('/office');
      } else {
        toast({
          title: 'Доступ ограничен',
          description: 'Ваш аккаунт не найден в списке участников.',
          variant: 'destructive',
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-3xl p-8 shadow-elevated animate-slide-up">
          {/* Progress */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-2">
              <div className={`h-1 w-8 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`h-1 w-8 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            </div>
            <span className="text-sm text-muted-foreground">PHASE {step} / 2</span>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground">
              ВХОД В
            </h1>
            <h1 className="font-display text-3xl font-bold text-primary italic">
              MVP STUDIO
            </h1>
            <p className="mt-3 text-muted-foreground">
              Доступ ограничен для участников закрытого потока.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs tracking-wider text-muted-foreground">
                ТВОЕ ИМЯ
              </Label>
              <Input
                id="name"
                placeholder="Напр. Артем"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-14 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telegram" className="text-xs tracking-wider text-muted-foreground">
                TELEGRAM USERNAME
              </Label>
              <Input
                id="telegram"
                placeholder="@username"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                className="h-14 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground/50"
              />
            </div>

            <Button
              variant="dark"
              size="xl"
              className="w-full"
              onClick={handleCheckAccess}
              disabled={!telegram || isLoading}
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-hero-foreground/30 border-t-hero-foreground rounded-full animate-spin" />
              ) : (
                <>
                  ПРОВЕРИТЬ ДОСТУП
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Используй username <span className="text-primary">demo</span> для демо-доступа
          </p>
        </div>
      </div>
    </div>
  );
}
