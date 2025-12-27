import { useState, useEffect } from 'react';
import { Search, Brain, Layers, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { ModuleCard } from '@/components/cards/ModuleCard';
import { MODULES, LEVELS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useProgress } from '@/hooks/useProgress';

const FILTER_OPTIONS = ['Все', 'Не пройдено', 'Пройдено'];

interface TasksPageProps {
  userTelegram?: string;
}

export function TasksPage({ userTelegram }: TasksPageProps) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Все');
  const { completedModuleIds, loading } = useProgress(userTelegram || null);

  const filteredModules = MODULES.filter((module) => {
    const matchesSearch =
      module.title.toLowerCase().includes(search.toLowerCase()) ||
      module.description.toLowerCase().includes(search.toLowerCase());
    
    const isCompleted = completedModuleIds.includes(module.id);
    
    if (activeFilter === 'Пройдено' && !isCompleted) return false;
    if (activeFilter === 'Не пройдено' && isCompleted) return false;

    return matchesSearch;
  });

  const modulesByLevel = {
    1: filteredModules.filter((m) => m.level === 1),
    2: filteredModules.filter((m) => m.level === 2),
    3: filteredModules.filter((m) => m.level === 3),
  };

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <div className="opacity-0 animate-fade-in">
        <h1 className="heading-lg text-foreground mb-1">Задачи</h1>
        <p className="text-muted-foreground">Пошаговое обучение unit-экономике</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3 opacity-0 animate-fade-in stagger-1">
        <Link to="/quiz" className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center hover:bg-primary/20 transition-all">
          <Brain className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground">Квиз</p>
        </Link>
        <Link to="/flashcards" className="p-4 rounded-xl bg-card border border-border text-center hover:border-primary/30 transition-all">
          <Layers className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground">Флэшкарты</p>
        </Link>
        <Link to="/personal" className="p-4 rounded-xl bg-card border border-border text-center hover:border-primary/30 transition-all">
          <Briefcase className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground">Мой проект</p>
        </Link>
      </div>

      {/* Search */}
      <div className="relative opacity-0 animate-fade-in stagger-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Поиск по задачам..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-12 pl-12 rounded-xl bg-card border-border"
        />
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 opacity-0 animate-fade-in stagger-2">
        {FILTER_OPTIONS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all',
              activeFilter === filter
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Modules by Level */}
      <div className="space-y-8 opacity-0 animate-fade-in stagger-3">
        {Object.entries(modulesByLevel).map(([level, modules]) => {
          if (modules.length === 0) return null;
          const levelNum = Number(level) as 1 | 2 | 3;
          const levelInfo = LEVELS[levelNum];

          return (
            <section key={level}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{levelInfo.emoji}</span>
                <div>
                  <h2 className="font-display text-lg font-bold text-foreground">
                    {levelInfo.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">{levelInfo.label}</p>
                </div>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                {modules.map((module, index) => (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    index={index}
                    isCompleted={completedModuleIds.includes(module.id)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
