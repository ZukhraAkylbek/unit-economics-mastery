import { useState, useEffect } from 'react';
import { BarChart3, Users, BookOpen, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MODULES, LEVELS } from '@/lib/constants';

interface Progress {
  student_id: string;
  module_id: string;
  completed: boolean;
  coins_earned: number;
}

interface Student {
  id: string;
  name: string;
  telegram: string;
}

export function AdminProgressPage() {
  const [progress, setProgress] = useState<Progress[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [progressRes, studentsRes] = await Promise.all([
        supabase.from('progress').select('*'),
        supabase.from('students').select('id, name, telegram')
      ]);

      if (progressRes.error) throw progressRes.error;
      if (studentsRes.error) throw studentsRes.error;

      setProgress(progressRes.data || []);
      setStudents(studentsRes.data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить данные',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getModuleStats = (moduleId: string) => {
    const moduleProgress = progress.filter(p => p.module_id === moduleId);
    const completed = moduleProgress.filter(p => p.completed).length;
    return {
      completed,
      total: students.length,
      percent: students.length > 0 ? Math.round((completed / students.length) * 100) : 0
    };
  };

  const totalCompleted = progress.filter(p => p.completed).length;
  const totalPossible = students.length * MODULES.length;
  const overallProgress = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="heading-display text-foreground">
          Аналитика <span className="text-primary italic">прогресса</span>
        </h1>
        <p className="text-muted-foreground mt-2">Статистика прохождения модулей</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card-elevated p-4 text-center">
          <Users className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{students.length}</p>
          <p className="text-xs text-muted-foreground">Студентов</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <BookOpen className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{MODULES.length}</p>
          <p className="text-xs text-muted-foreground">Модулей</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <BarChart3 className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{totalCompleted}</p>
          <p className="text-xs text-muted-foreground">Завершений</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{overallProgress}%</p>
          <p className="text-xs text-muted-foreground">Общий прогресс</p>
        </div>
      </div>

      {/* Module Progress */}
      <div>
        <h2 className="font-semibold text-lg mb-4">Прогресс по модулям</h2>
        <div className="space-y-3">
          {MODULES.map((module, index) => {
            const stats = getModuleStats(module.slug);
            return (
              <div key={module.id} className="card-elevated p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{LEVELS[module.level].emoji}</span>
                    <div>
                      <p className="font-medium text-foreground">
                        {index + 1}. {module.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stats.completed} из {stats.total} студентов завершили
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-primary">{stats.percent}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${stats.percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
