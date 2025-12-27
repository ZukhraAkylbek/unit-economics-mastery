import { Settings, TrendingUp, Target, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MODULES } from '@/lib/constants';

interface ProfilePageProps {
  user: { name: string; telegram: string };
}

export function ProfilePage({ user }: ProfilePageProps) {
  const completedCount = 0;
  const totalModules = MODULES.length;
  const progress = Math.round((completedCount / totalModules) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-4">
      {/* Profile Header */}
      <div className="card-glass p-6 opacity-0 animate-fade-in">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">
                {user.name}
              </h1>
              <p className="text-muted-foreground">{user.telegram}</p>
            </div>
          </div>
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <Settings className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Coins */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/10 border border-accent/20">
          <span className="text-2xl">🪙</span>
          <div>
            <p className="text-sm text-muted-foreground">Баланс</p>
            <p className="text-xl font-bold text-foreground">500 монет</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 opacity-0 animate-fade-in stagger-1">
        <div className="card-glass p-5">
          <div className="p-2 rounded-lg bg-primary/10 w-fit mb-3">
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">Прогресс</p>
          <p className="text-2xl font-bold text-foreground">{progress}%</p>
        </div>

        <div className="card-glass p-5">
          <div className="p-2 rounded-lg bg-success/10 w-fit mb-3">
            <Target className="h-4 w-4 text-success" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">Выполнено</p>
          <p className="text-2xl font-bold text-foreground">
            {completedCount}
            <span className="text-base font-normal text-muted-foreground">/{totalModules}</span>
          </p>
        </div>
      </div>

      {/* Level */}
      <div className="card-glass p-5 opacity-0 animate-fade-in stagger-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-accent/10">
            <Award className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="font-medium text-foreground">Уровень</p>
            <p className="text-sm text-muted-foreground">Junior Growth PM</p>
          </div>
        </div>
        
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <div 
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {progress}% до следующего уровня
        </p>
      </div>

      {/* Quick Link */}
      <Link 
        to="/tasks"
        className="block p-5 card-glass hover:border-primary/30 transition-colors opacity-0 animate-fade-in stagger-3"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">Продолжить обучение</p>
            <p className="text-sm text-muted-foreground">
              {totalModules - completedCount} задач осталось
            </p>
          </div>
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
        </div>
      </Link>
    </div>
  );
}
