import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Calculator, Lightbulb, Target, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { MODULES, CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

type Step = 'theory' | 'formula' | 'example' | 'task';

const STEPS: { id: Step; label: string; icon: React.ElementType }[] = [
  { id: 'theory', label: 'Теория', icon: BookOpen },
  { id: 'formula', label: 'Формула', icon: Calculator },
  { id: 'example', label: 'Пример', icon: Lightbulb },
  { id: 'task', label: 'Задача', icon: Target },
];

export function TaskDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const module = MODULES.find((m) => m.slug === slug);
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState<Step>('theory');
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);

  if (!module) {
    return (
      <div className="text-center py-20">
        <h1 className="text-xl font-bold text-foreground mb-4">Модуль не найден</h1>
        <Button asChild>
          <Link to="/tasks">К задачам</Link>
        </Button>
      </div>
    );
  }

  const category = CATEGORIES[module.category];
  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  const goNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex].id);
    }
  };

  const goPrev = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex].id);
    }
  };

  const handleSubmit = () => {
    if (!module.task || !answer) return;

    const userAnswer = parseFloat(answer.replace(',', '.'));
    const correctAnswer = module.task.correctAnswer;
    const tolerance = correctAnswer * 0.02;

    if (Math.abs(userAnswer - correctAnswer) <= tolerance) {
      setResult('correct');
      toast({
        title: 'Отлично! 🎉',
        description: '+50 XP за правильный ответ',
      });
    } else {
      setResult('incorrect');
    }
  };

  const resetTask = () => {
    setAnswer('');
    setResult(null);
    setShowHint(false);
  };

  return (
    <div className="max-w-2xl mx-auto pb-8">
      {/* Header */}
      <div className="mb-6 opacity-0 animate-fade-in">
        <Link
          to="/tasks"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад
        </Link>

        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary">
            {category.label}
          </span>
          <span className="text-sm text-muted-foreground">
            Модуль {module.id}
          </span>
        </div>

        <h1 className="heading-lg text-foreground">{module.title}</h1>
      </div>

      {/* Progress */}
      <div className="mb-8 opacity-0 animate-fade-in stagger-1">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            const isPassed = index < currentStepIndex;
            const StepIcon = step.icon;

            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={cn(
                  'flex flex-col items-center gap-1.5 transition-all',
                  isActive ? 'text-primary' : isPassed ? 'text-success' : 'text-muted-foreground'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                  isActive ? 'bg-primary text-primary-foreground' :
                  isPassed ? 'bg-success/10 text-success' :
                  'bg-secondary'
                )}>
                  {isPassed ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <StepIcon className="h-5 w-5" />
                  )}
                </div>
                <span className="text-xs font-medium hidden sm:block">{step.label}</span>
              </button>
            );
          })}
        </div>
        <Progress value={progress} className="h-1" />
      </div>

      {/* Content */}
      <div className="card-glass p-6 sm:p-8 opacity-0 animate-fade-in stagger-2">
        {/* Theory Step */}
        {currentStep === 'theory' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-display text-xl font-bold text-foreground">Теория</h2>
            </div>

            <div className="prose prose-sm max-w-none">
              {module.theory?.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-foreground/80 leading-relaxed">
                  {paragraph.split('**').map((part, j) => 
                    j % 2 === 1 ? (
                      <strong key={j} className="text-foreground font-semibold">{part}</strong>
                    ) : part
                  )}
                </p>
              ))}
            </div>

            {/* Key Insight Box */}
            <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
              <div className="flex items-start gap-3">
                <span className="text-xl">💡</span>
                <div>
                  <p className="font-medium text-foreground mb-1">Ключевой инсайт</p>
                  <p className="text-sm text-muted-foreground">
                    {module.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Formula Step */}
        {currentStep === 'formula' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Calculator className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-display text-xl font-bold text-foreground">Формула</h2>
            </div>

            {/* Formula Display */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 text-center">
              <p className="text-2xl sm:text-3xl font-mono font-bold text-foreground">
                {module.formula}
              </p>
            </div>

            {/* Formula Breakdown */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Разбор формулы:</p>
              <div className="grid gap-2">
                {module.formula?.split(/[=+\-×÷*/]/).filter(Boolean).map((part, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {i + 1}
                    </div>
                    <span className="font-mono text-foreground">{part.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Example Step */}
        {currentStep === 'example' && module.example && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-display text-xl font-bold text-foreground">Пример</h2>
            </div>

            {/* Scenario */}
            <div className="p-4 rounded-xl bg-secondary">
              <p className="text-sm text-muted-foreground mb-1">Условие</p>
              <p className="text-foreground font-medium">{module.example.description}</p>
            </div>

            {/* Step by Step Solution */}
            <div className="space-y-4">
              <p className="text-sm font-medium text-muted-foreground">Решение пошагово:</p>
              
              <div className="relative pl-6 border-l-2 border-primary/30 space-y-4">
                <div className="relative">
                  <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-primary" />
                  <div className="p-4 rounded-xl bg-card border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Подставляем значения</p>
                    <p className="font-mono text-foreground">{module.example.calculation}</p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-success" />
                  <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                    <p className="text-sm text-success mb-1">Ответ</p>
                    <p className="text-2xl font-bold text-success">{module.example.answer.toLocaleString('ru-RU')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Task Step */}
        {currentStep === 'task' && module.task && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-display text-xl font-bold text-foreground">Задача</h2>
            </div>

            {/* Question */}
            <div className="p-5 rounded-xl bg-secondary">
              <p className="text-lg text-foreground">{module.task.question}</p>
            </div>

            {/* Answer Input */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <Input
                  type="text"
                  placeholder="Введи ответ..."
                  value={answer}
                  onChange={(e) => {
                    setAnswer(e.target.value);
                    setResult(null);
                  }}
                  className={cn(
                    'h-14 text-lg font-semibold flex-1',
                    result === 'correct' && 'border-success bg-success/5',
                    result === 'incorrect' && 'border-destructive bg-destructive/5'
                  )}
                  disabled={result === 'correct'}
                />
                {result === 'correct' ? (
                  <Button size="lg" className="h-14 bg-success hover:bg-success/90" disabled>
                    <CheckCircle className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button size="lg" className="h-14" onClick={handleSubmit} disabled={!answer}>
                    Проверить
                  </Button>
                )}
              </div>

              {/* Result */}
              {result === 'correct' && (
                <div className="p-4 rounded-xl bg-success/10 border border-success/20 flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success shrink-0" />
                  <div>
                    <p className="font-medium text-success">Правильно!</p>
                    <p className="text-sm text-success/80">+50 XP добавлено к твоему профилю</p>
                  </div>
                </div>
              )}

              {result === 'incorrect' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3">
                    <XCircle className="h-5 w-5 text-destructive shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-destructive">Неверно</p>
                      <p className="text-sm text-destructive/80">Попробуй ещё раз или используй подсказку</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={resetTask}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Hint */}
              {result !== 'correct' && (
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Lightbulb className="h-4 w-4" />
                  {showHint ? 'Скрыть подсказку' : 'Показать подсказку'}
                </button>
              )}

              {showHint && (
                <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                  <p className="text-sm text-foreground">
                    💡 {module.task.hint}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <Button
            variant="ghost"
            onClick={goPrev}
            disabled={currentStepIndex === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад
          </Button>

          {currentStepIndex < STEPS.length - 1 ? (
            <Button onClick={goNext} className="gap-2">
              Далее
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : result === 'correct' ? (
            <Button asChild className="gap-2 bg-success hover:bg-success/90">
              <Link to="/tasks">
                Завершить
                <CheckCircle className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button disabled className="gap-2">
              Реши задачу
              <Target className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
