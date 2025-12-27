import { ArrowRight, Trophy, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MissionCard } from '@/components/cards/MissionCard';
import { MODULES } from '@/lib/constants';

interface OfficePageProps {
  user: { name: string; telegram: string };
}

export function OfficePage({ user }: OfficePageProps) {
  const currentModule = MODULES[0]; // First incomplete module
  const progress = 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Status Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/30">
        <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
        <span className="text-xs font-semibold tracking-wider text-success">
          OPERATIONAL STATUS: ONLINE
        </span>
      </div>

      {/* Welcome */}
      <div>
        <h1 className="heading-display heading-italic text-foreground">
          HELLO,
        </h1>
        <h1 className="heading-display heading-italic text-primary">
          {user.name.toUpperCase()}
        </h1>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Mission Card */}
        <div className="lg:col-span-2">
          <MissionCard module={currentModule} />
        </div>

        {/* Status Panel */}
        <div className="space-y-4">
          <div className="card-elevated p-6">
            <div className="text-xs tracking-wider text-muted-foreground mb-3">
              DOSSIER STATUS
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span className="font-semibold text-foreground">ACCEPTED</span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div>
                <div className="text-xs tracking-wider text-muted-foreground">XP POINTS</div>
                <div className="text-2xl font-bold text-foreground">0</div>
              </div>
              <div>
                <div className="text-xs tracking-wider text-muted-foreground">RANK</div>
                <div className="text-lg font-bold text-primary">GROWTH PM</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs tracking-wider text-muted-foreground">DAILY CHALLENGE</div>
                  <div className="font-semibold text-foreground">PH Audit</div>
                </div>
                <Link to="/audit">
                  <ArrowRight className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                </Link>
              </div>
            </div>
          </div>

          <Button variant="dark" size="lg" className="w-full" asChild>
            <Link to="/tasks">
              ВСЕ ЗАДАЧИ МОДУЛЯ
            </Link>
          </Button>
        </div>
      </div>

      {/* Progress Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card-elevated p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">ПРОГРЕСС КАРЬЕРЫ</span>
            <span className="text-2xl font-bold text-foreground">{progress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="card-elevated p-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
            <Trophy className="h-6 w-6 text-accent" />
          </div>
          <div>
            <div className="text-xs tracking-wider text-muted-foreground">ПОСЛЕДНИЙ УСПЕХ</div>
            <div className="font-semibold text-foreground">НАЧНИ ОБУЧЕНИЕ</div>
          </div>
        </div>
      </div>
    </div>
  );
}
