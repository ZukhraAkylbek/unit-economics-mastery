import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Module } from '@/lib/constants';

interface MissionCardProps {
  module: Module;
}

export function MissionCard({ module }: MissionCardProps) {
  return (
    <div className="card-primary p-6 md:p-8">
      <div className="mb-4">
        <span className="text-sm font-medium text-primary-foreground/70">
          Текущая миссия
        </span>
      </div>

      <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
        {module.title}
      </h2>

      <p className="text-primary-foreground/80 text-sm md:text-base mb-6 max-w-md">
        {module.description}
      </p>

      <Button variant="secondary" size="lg" asChild>
        <Link to={`/task/${module.slug}`}>
          Начать
          <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      </Button>
    </div>
  );
}
