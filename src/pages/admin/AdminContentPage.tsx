import { BookOpen, FileText, HelpCircle, Layers } from 'lucide-react';
import { MODULES, LEVELS } from '@/lib/constants';

export function AdminContentPage() {
  const totalTasks = MODULES.filter(m => m.task).length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="heading-display text-foreground">
          Управление <span className="text-primary italic">контентом</span>
        </h1>
        <p className="text-muted-foreground mt-2">Обзор модулей и учебных материалов</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card-elevated p-4 text-center">
          <Layers className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{MODULES.length}</p>
          <p className="text-xs text-muted-foreground">Модулей</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <FileText className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{MODULES.filter(m => m.theory).length}</p>
          <p className="text-xs text-muted-foreground">Теорий</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <HelpCircle className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{totalTasks}</p>
          <p className="text-xs text-muted-foreground">Задач</p>
        </div>
      </div>

      {/* Modules List */}
      <div>
        <h2 className="font-semibold text-lg mb-4">Все модули</h2>
        <div className="space-y-3">
          {MODULES.map((module, index) => (
            <div key={module.id} className="card-elevated p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                    {LEVELS[module.level].emoji}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {index + 1}. {module.title}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {module.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{module.theory ? 'Теория' : '—'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HelpCircle className="h-4 w-4" />
                    <span>{module.task ? 'Задача' : '—'}</span>
                  </div>
                  <span className="text-primary font-medium">Ур. {module.level}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
