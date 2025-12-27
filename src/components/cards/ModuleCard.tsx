import { ArrowRight, Check, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Module, CATEGORIES } from '@/lib/constants';

interface ModuleCardProps {
  module: Module;
  index?: number;
  isCompleted?: boolean;
  isLocked?: boolean;
}

export function ModuleCard({ module, index = 0, isCompleted, isLocked }: ModuleCardProps) {
  const category = CATEGORIES[module.category];

  return (
    <Link
      to={isLocked ? '#' : `/task/${module.slug}`}
      className={cn(
        'group block p-5 card-glass transition-all duration-300',
        'hover:shadow-elevated hover:border-primary/30',
        isLocked && 'opacity-60 cursor-not-allowed',
        isCompleted && 'bg-success/5 border-success/20'
      )}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Category Badge */}
          <div className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-3',
            isCompleted 
              ? 'bg-success/10 text-success'
              : 'bg-primary/10 text-primary'
          )}>
            {isCompleted ? (
              <>
                <Check className="h-3 w-3" />
                Пройдено
              </>
            ) : (
              category.label
            )}
          </div>

          {/* Title */}
          <h3 className="font-display text-lg font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors">
            {module.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {module.description}
          </p>
        </div>

        {/* Action Icon */}
        <div className={cn(
          'shrink-0 p-2 rounded-lg transition-colors',
          isLocked 
            ? 'bg-muted'
            : 'bg-secondary group-hover:bg-primary/10'
        )}>
          {isLocked ? (
            <Lock className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          )}
        </div>
      </div>
    </Link>
  );
}
