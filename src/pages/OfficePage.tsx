import { ArrowRight, Trophy, TrendingUp, Target, Coins, Grid3X3, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MODULES } from '@/lib/constants';
import { useProgress } from '@/hooks/useProgress';

interface OfficePageProps {
  user: { name: string; telegram: string };
}

export function OfficePage({ user }: OfficePageProps) {
  const { 
    loading, 
    completedModuleIds, 
    totalProgress, 
    totalCoins, 
    currentModule 
  } = useProgress(user.telegram);

  const totalTasks = MODULES.length;
  const completedTasks = completedModuleIds.length;

  if (loading) {
    return (
      <div className="space-y-6 pb-4 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/2" />
        <div className="h-40 bg-muted rounded-2xl" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-32 bg-muted rounded-2xl" />
          <div className="h-32 bg-muted rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-4">
      {/* Welcome */}
      <div className="opacity-0 animate-fade-in">
        <p className="text-muted-foreground mb-1">Привет,</p>
        <h1 className="heading-xl text-foreground">
          {user.name} 👋
        </h1>
      </div>

      {/* Current Mission Card */}
      <div className="card-primary p-6 opacity-0 animate-fade-in stagger-1">
        <div className="flex items-start justify-between mb-4">
          <span className="text-sm font-medium text-primary-foreground/70">
            {completedTasks === totalTasks ? 'Все модули пройдены!' : 'Текущая миссия'}
          </span>
          <Target className="h-5 w-5 text-primary-foreground/50" />
        </div>

        <h2 className="font-display text-xl font-bold text-primary-foreground mb-2">
          {currentModule.title}
        </h2>
        <p className="text-primary-foreground/80 text-sm mb-6 line-clamp-2">
          {currentModule.description}
        </p>

        <Button 
          variant="secondary" 
          className="w-full sm:w-auto"
          asChild
        >
          <Link to={`/task/${currentModule.slug}`}>
            {completedTasks === totalTasks ? 'Повторить' : 'Начать'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 opacity-0 animate-fade-in stagger-2">
        <div className="card-glass p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-0.5">Прогресс</p>
          <p className="text-xl font-bold text-foreground">{totalProgress}%</p>
          <div className="mt-2 h-1 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
        </div>

        <div className="card-glass p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-accent/10">
              <Trophy className="h-3.5 w-3.5 text-accent" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-0.5">Выполнено</p>
          <p className="text-xl font-bold text-foreground">
            {completedTasks}
            <span className="text-muted-foreground text-sm font-normal">/{totalTasks}</span>
          </p>
        </div>

        <div className="card-glass p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-warning/10">
              <Coins className="h-3.5 w-3.5 text-warning" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-0.5">Коины</p>
          <p className="text-xl font-bold text-foreground">{totalCoins}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3 opacity-0 animate-fade-in stagger-3">
        <h3 className="text-sm font-medium text-muted-foreground">Быстрый доступ</h3>
        
        <Link 
          to="/tasks"
          className="flex items-center justify-between p-4 card-glass hover:border-primary/30 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-secondary">
              <Grid3X3 className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div>
              <p className="font-medium text-foreground">Все задачи</p>
              <p className="text-sm text-muted-foreground">{totalTasks} модулей</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>

        <Link 
          to="/theory"
          className="flex items-center justify-between p-4 card-glass hover:border-primary/30 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-secondary">
              <BookOpen className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div>
              <p className="font-medium text-foreground">База знаний</p>
              <p className="text-sm text-muted-foreground">Теория и формулы</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
      </div>
    </div>
  );
}
