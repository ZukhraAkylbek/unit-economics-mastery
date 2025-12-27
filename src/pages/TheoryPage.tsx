import { useState } from 'react';
import { Target, DollarSign, Zap, RefreshCw, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { THEORY_STEPS } from '@/lib/constants';

const ICONS = {
  target: Target,
  dollar: DollarSign,
  zap: Zap,
  refresh: RefreshCw,
  check: CheckCircle,
};

export function TheoryPage() {
  const [activeStep, setActiveStep] = useState(2);

  const currentStep = THEORY_STEPS.find((s) => s.id === activeStep) || THEORY_STEPS[0];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-primary mb-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/30">
            📖 INTERACTIVE TEXTBOOK
          </span>
        </div>
        <h1 className="heading-display text-foreground">
          БАЗА <span className="text-primary italic">ЗНАНИЙ</span>
        </h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Пошаговый алгоритм расчета юнит-экономики от экспертов MVP Studio.
        </p>
      </div>

      {/* Content Grid */}
      <div className="grid gap-8 lg:grid-cols-5">
        {/* Steps Navigation */}
        <div className="lg:col-span-2 space-y-2">
          {THEORY_STEPS.map((step) => {
            const Icon = ICONS[step.icon as keyof typeof ICONS] || Target;
            const isActive = step.id === activeStep;

            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={cn(
                  'w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-200',
                  isActive
                    ? 'bg-hero text-hero-foreground'
                    : 'bg-card border border-border hover:border-primary/50'
                )}
              >
                <div
                  className={cn(
                    'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
                    isActive ? 'bg-hero-foreground/20' : 'bg-muted'
                  )}
                >
                  <Icon className={cn('h-5 w-5', isActive ? 'text-hero-foreground' : 'text-primary')} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn('text-xs tracking-wider', isActive ? 'text-hero-foreground/70' : 'text-muted-foreground')}>
                    ШАГ {step.id}
                  </div>
                  <div className={cn('font-semibold truncate', isActive ? 'text-hero-foreground' : 'text-foreground')}>
                    {step.title}
                  </div>
                </div>
                {isActive && (
                  <div className="text-hero-foreground/70">›</div>
                )}
              </button>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="lg:col-span-3">
          <div className="card-elevated p-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-semibold text-primary mb-6">
              ЭТАП {currentStep.id}
            </div>

            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              ШАГ {currentStep.id}: {currentStep.title}
            </h2>

            <div className="prose prose-sm max-w-none">
              <div className="text-lg italic text-muted-foreground border-l-4 border-primary/30 pl-4 mb-6">
                {currentStep.content.split('\n\n')[0]}
              </div>

              <div className="space-y-4 text-foreground whitespace-pre-line">
                {currentStep.content.split('\n\n').slice(1).join('\n\n')}
              </div>
            </div>

            {/* Mini Calculator */}
            <div className="mt-8 p-6 rounded-2xl bg-muted">
              <div className="text-xs tracking-wider text-muted-foreground mb-4">
                ПОПРОБУЙ ФОРМУЛУ
              </div>
              <MiniCalculator stepId={currentStep.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniCalculator({ stepId }: { stepId: number }) {
  const [value1, setValue1] = useState(1000);
  const [value2, setValue2] = useState(300);

  const configs: Record<number, { label1: string; label2: string; formula: string; calculate: (a: number, b: number) => number }> = {
    1: {
      label1: 'Выручка',
      label2: 'Юнитов',
      formula: 'ARPU = Выручка / Юниты',
      calculate: (a, b) => (b > 0 ? a / b : 0),
    },
    2: {
      label1: 'Цена',
      label2: 'COGS',
      formula: 'Margin = Цена - COGS',
      calculate: (a, b) => a - b,
    },
    3: {
      label1: 'Маркетинг ₽',
      label2: 'Клиенты',
      formula: 'CAC = Маркетинг / Клиенты',
      calculate: (a, b) => (b > 0 ? a / b : 0),
    },
    4: {
      label1: 'ARPU',
      label2: 'Churn %',
      formula: 'LTV = ARPU / Churn',
      calculate: (a, b) => (b > 0 ? a / (b / 100) : 0),
    },
    5: {
      label1: 'LTV',
      label2: 'CAC',
      formula: 'Ratio = LTV / CAC',
      calculate: (a, b) => (b > 0 ? a / b : 0),
    },
  };

  const config = configs[stepId] || configs[1];
  const result = config.calculate(value1, value2);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted-foreground">{config.label1}</label>
          <input
            type="number"
            value={value1}
            onChange={(e) => setValue1(Number(e.target.value))}
            className="w-full mt-1 h-10 px-3 rounded-lg bg-background border border-border text-foreground"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">{config.label2}</label>
          <input
            type="number"
            value={value2}
            onChange={(e) => setValue2(Number(e.target.value))}
            className="w-full mt-1 h-10 px-3 rounded-lg bg-background border border-border text-foreground"
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl bg-background border border-primary/30">
        <span className="text-sm text-muted-foreground">{config.formula}</span>
        <span className="text-2xl font-bold text-primary">
          {result.toLocaleString('ru-RU', { maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
}
