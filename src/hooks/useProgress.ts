import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MODULES } from '@/lib/constants';

interface Progress {
  module_id: string;
  step_completed: number;
  completed: boolean;
  coins_earned: number;
}

const COINS_PER_MODULE = 50;

export function useProgress(userTelegram: string | null) {
  const [progress, setProgress] = useState<Progress[]>([]);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch student and progress
  useEffect(() => {
    if (!userTelegram) {
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      try {
        // Get student ID
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('id')
          .eq('telegram', userTelegram)
          .single();

        if (studentError || !studentData) {
          console.error('Student not found:', studentError);
          setLoading(false);
          return;
        }

        setStudentId(studentData.id);

        // Get progress
        const { data: progressData, error: progressError } = await supabase
          .from('progress')
          .select('*')
          .eq('student_id', studentData.id);

        if (progressError) {
          console.error('Progress fetch error:', progressError);
        } else {
          setProgress(progressData || []);
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userTelegram]);

  // Complete a module
  const completeModule = useCallback(async (moduleSlug: string) => {
    if (!studentId) return false;

    const module = MODULES.find(m => m.slug === moduleSlug);
    if (!module) return false;

    try {
      // Check if already completed
      const existing = progress.find(p => p.module_id === moduleSlug);
      if (existing?.completed) {
        return true; // Already completed
      }

      if (existing) {
        // Update existing progress
        const { error } = await supabase
          .from('progress')
          .update({
            completed: true,
            step_completed: 6,
            coins_earned: COINS_PER_MODULE
          })
          .eq('student_id', studentId)
          .eq('module_id', moduleSlug);

        if (error) throw error;
      } else {
        // Create new progress
        const { error } = await supabase
          .from('progress')
          .insert({
            student_id: studentId,
            module_id: moduleSlug,
            completed: true,
            step_completed: 6,
            coins_earned: COINS_PER_MODULE
          });

        if (error) throw error;
      }

      // Update student coins
      const { data: studentData } = await supabase
        .from('students')
        .select('coins')
        .eq('id', studentId)
        .single();

      if (studentData) {
        await supabase
          .from('students')
          .update({ coins: (studentData.coins || 0) + COINS_PER_MODULE })
          .eq('id', studentId);
      }

      // Update local state
      setProgress(prev => {
        const updated = prev.filter(p => p.module_id !== moduleSlug);
        return [...updated, {
          module_id: moduleSlug,
          step_completed: 6,
          completed: true,
          coins_earned: COINS_PER_MODULE
        }];
      });

      toast({
        title: 'Модуль завершён! 🎉',
        description: `+${COINS_PER_MODULE} коинов`,
      });

      return true;
    } catch (error) {
      console.error('Error completing module:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить прогресс',
        variant: 'destructive'
      });
      return false;
    }
  }, [studentId, progress, toast]);

  // Update step progress
  const updateStep = useCallback(async (moduleSlug: string, step: number) => {
    if (!studentId) return;

    const existing = progress.find(p => p.module_id === moduleSlug);
    
    try {
      if (existing) {
        if (step <= existing.step_completed) return; // Don't go backwards
        
        await supabase
          .from('progress')
          .update({ step_completed: step })
          .eq('student_id', studentId)
          .eq('module_id', moduleSlug);
      } else {
        await supabase
          .from('progress')
          .insert({
            student_id: studentId,
            module_id: moduleSlug,
            step_completed: step,
            completed: false,
            coins_earned: 0
          });
      }

      setProgress(prev => {
        const updated = prev.filter(p => p.module_id !== moduleSlug);
        return [...updated, {
          module_id: moduleSlug,
          step_completed: step,
          completed: false,
          coins_earned: 0
        }];
      });
    } catch (error) {
      console.error('Error updating step:', error);
    }
  }, [studentId, progress]);

  // Get completed module IDs
  const completedModuleIds = progress
    .filter(p => p.completed)
    .map(p => {
      const module = MODULES.find(m => m.slug === p.module_id);
      return module?.id;
    })
    .filter((id): id is number => id !== undefined);

  // Calculate total progress percentage
  const totalProgress = Math.round((completedModuleIds.length / MODULES.length) * 100);

  // Get total coins
  const totalCoins = progress.reduce((sum, p) => sum + (p.coins_earned || 0), 0);

  // Get current module (first uncompleted)
  const currentModule = MODULES.find(m => !completedModuleIds.includes(m.id)) || MODULES[0];

  // Check if module is completed
  const isModuleCompleted = (moduleSlug: string) => {
    return progress.some(p => p.module_id === moduleSlug && p.completed);
  };

  // Get module step
  const getModuleStep = (moduleSlug: string) => {
    return progress.find(p => p.module_id === moduleSlug)?.step_completed || 0;
  };

  return {
    loading,
    progress,
    completedModuleIds,
    totalProgress,
    totalCoins,
    currentModule,
    completeModule,
    updateStep,
    isModuleCompleted,
    getModuleStep
  };
}
