import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ModuleCard } from '@/components/cards/ModuleCard';
import { MODULES, LEVELS, CATEGORIES } from '@/lib/constants';

const CATEGORY_FILTERS = ['ALL', ...Object.keys(CATEGORIES).map((k) => CATEGORIES[k as keyof typeof CATEGORIES].label)];

export function TasksPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');

  const filteredModules = MODULES.filter((module) => {
    const matchesSearch =
      module.title.toLowerCase().includes(search.toLowerCase()) ||
      module.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory =
      activeCategory === 'ALL' ||
      CATEGORIES[module.category].label === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const modulesByLevel = {
    1: filteredModules.filter((m) => m.level === 1),
    2: filteredModules.filter((m) => m.level === 2),
    3: filteredModules.filter((m) => m.level === 3),
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Поиск по задачам..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-14 pl-12 rounded-2xl bg-card border-border text-foreground"
        />
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span className="text-sm">CATEGORY:</span>
        </div>
        {CATEGORY_FILTERS.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory(cat)}
            className="rounded-full"
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Modules by Level */}
      {Object.entries(modulesByLevel).map(([level, modules]) => {
        if (modules.length === 0) return null;
        const levelNum = Number(level) as 1 | 2 | 3;
        const levelInfo = LEVELS[levelNum];

        return (
          <section key={level}>
            <h2 className="font-display text-xl font-bold text-primary italic mb-6">
              LEVEL {level}: {levelInfo.name} ({levelInfo.label})
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {modules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  isActive={module.id === 2}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
