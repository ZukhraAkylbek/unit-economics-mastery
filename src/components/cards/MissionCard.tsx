import { ArrowRight, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Module } from '@/lib/constants';

interface MissionCardProps {
  module: Module;
}

export function MissionCard({ module }: MissionCardProps) {
  return (
    <div className="card-hero p-6 md:p-8">
      <div className="flex items-start justify-between mb-4">
        <div className="text-xs font-semibold tracking-wider text-hero-foreground/70">
          ТЕКУЩАЯ МИССИЯ
        </div>
        <div className="relative">
          <Target className="h-12 w-12 text-hero-foreground/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-4 rounded-full bg-primary animate-pulse" />
          </div>
        </div>
      </div>

      <h2 className="font-display text-2xl md:text-3xl font-bold text-hero-foreground mb-3">
        {module.id}. {module.title}
      </h2>

      <p className="text-hero-foreground/80 text-sm md:text-base mb-6 max-w-md">
        {module.description}
      </p>

      <Button variant="hero" size="lg" asChild>
        <Link to={`/task/${module.slug}`}>
          ПРИСТУПИТЬ
          <ArrowRight className="h-5 w-5" />
        </Link>
      </Button>
    </div>
  );
}
