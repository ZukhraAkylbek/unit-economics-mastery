import { ArrowRight, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Module, CATEGORIES } from '@/lib/constants';

interface ModuleCardProps {
  module: Module;
  isActive?: boolean;
  isCompleted?: boolean;
}

export function ModuleCard({ module, isActive, isCompleted }: ModuleCardProps) {
  const category = CATEGORIES[module.category];

  return (
    <div
      className={cn(
        'group relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300 hover:shadow-elevated',
        isActive
          ? 'border-primary bg-card shadow-primary'
          : 'border-border bg-card hover:border-primary/50',
        isCompleted && 'opacity-75'
      )}
    >
      <div>
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Zap className="h-3 w-3" />
          {category.label}
        </div>

        <h3
          className={cn(
            'mb-2 font-display text-xl font-bold leading-tight',
            isActive ? 'text-primary' : 'text-foreground'
          )}
        >
          {module.id}. {module.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {module.description}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Link
          to={`/task/${module.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
        >
          LAUNCH SIMULATION
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>

        {isCompleted ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/20">
            <Star className="h-4 w-4 text-success fill-success" />
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            <Star className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
}
