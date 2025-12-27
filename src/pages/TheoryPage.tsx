import { useState } from 'react';
import { ChevronRight, ChevronDown, CheckCircle, Lock, BookOpen, Calculator, TrendingUp, Users, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CaseStep {
  id: number;
  title: string;
  content: string;
  formula?: string;
  calculation?: string;
  result?: string;
}

const CASE_STUDY: CaseStep[] = [
  {
    id: 1,
    title: 'Исходные данные',
    content: 'Стартап продаёт подписку на сервис за 2000₽/мес. Себестоимость обслуживания одного клиента — 400₽/мес.',
  },
  {
    id: 2,
    title: 'Считаем маржу',
    content: 'Маржа с одного юнита (клиента) в месяц:',
    formula: 'Unit Margin = Price - COGS',
    calculation: '2000₽ - 400₽',
    result: '1600₽',
  },
  {
    id: 3,
    title: 'Данные по привлечению',
    content: 'На маркетинг потратили 500 000₽ и привлекли 200 новых клиентов.',
  },
  {
    id: 4,
    title: 'Считаем CAC',
    content: 'Стоимость привлечения одного клиента:',
    formula: 'CAC = Marketing Spend / New Customers',
    calculation: '500 000₽ / 200',
    result: '2500₽',
  },
  {
    id: 5,
    title: 'Данные по удержанию',
    content: 'Средний Churn Rate составляет 5% в месяц (5 из 100 клиентов уходят каждый месяц).',
  },
  {
    id: 6,
    title: 'Считаем LTV',
    content: 'Пожизненная ценность клиента:',
    formula: 'LTV = ARPU / Churn Rate',
    calculation: '2000₽ / 0.05',
    result: '40 000₽',
  },
  {
    id: 7,
    title: 'Главный показатель',
    content: 'Соотношение LTV к CAC показывает здоровье экономики:',
    formula: 'LTV/CAC Ratio',
    calculation: '40 000₽ / 2500₽',
    result: '16x ✅',
  },
  {
    id: 8,
    title: 'Вывод',
    content: 'LTV/CAC = 16 — это отличный показатель! Стандарт ≥ 3. Бизнес-модель здорова, можно масштабировать.',
  },
];

const TOPICS = [
  { id: 'unit', label: 'Юнит и маржа', icon: BookOpen, description: 'Базовая единица бизнеса' },
  { id: 'cac', label: 'CAC', icon: Users, description: 'Стоимость привлечения' },
  { id: 'ltv', label: 'LTV', icon: TrendingUp, description: 'Пожизненная ценность' },
  { id: 'churn', label: 'Churn', icon: Repeat, description: 'Отток клиентов' },
  { id: 'ratio', label: 'LTV/CAC', icon: Calculator, description: 'Главная метрика' },
];

export function TheoryPage() {
  const [revealedStep, setRevealedStep] = useState(1);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  const revealNext = () => {
    if (revealedStep < CASE_STUDY.length) {
      setRevealedStep(revealedStep + 1);
    }
  };

  const resetCase = () => {
    setRevealedStep(1);
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="opacity-0 animate-fade-in">
        <h1 className="heading-lg text-foreground mb-1">База знаний</h1>
        <p className="text-muted-foreground">Интерактивное обучение unit-экономике</p>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 opacity-0 animate-fade-in stagger-1">
        {TOPICS.map((topic) => {
          const Icon = topic.icon;
          const isActive = activeTopic === topic.id;
          
          return (
            <button
              key={topic.id}
              onClick={() => setActiveTopic(isActive ? null : topic.id)}
              className={cn(
                'p-4 rounded-xl text-left transition-all',
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card border border-border hover:border-primary/30'
              )}
            >
              <Icon className={cn('h-5 w-5 mb-2', isActive ? 'text-primary-foreground' : 'text-primary')} />
              <p className={cn('font-medium text-sm', isActive ? 'text-primary-foreground' : 'text-foreground')}>
                {topic.label}
              </p>
            </button>
          );
        })}
      </div>

      {/* Case Study */}
      <div className="card-glass p-6 sm:p-8 opacity-0 animate-fade-in stagger-2">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">Разбор кейса</h2>
            <p className="text-sm text-muted-foreground">Пошаговый расчёт экономики SaaS</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {revealedStep}/{CASE_STUDY.length}
            </span>
            {revealedStep > 1 && (
              <Button variant="ghost" size="sm" onClick={resetCase}>
                Сначала
              </Button>
            )}
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {CASE_STUDY.map((step, index) => {
            const isRevealed = index < revealedStep;
            const isLast = index === revealedStep - 1;
            const isLocked = index >= revealedStep;

            return (
              <div
                key={step.id}
                className={cn(
                  'transition-all duration-300',
                  isLocked && 'opacity-40'
                )}
              >
                <div
                  className={cn(
                    'p-4 rounded-xl border transition-all',
                    isLast ? 'bg-primary/5 border-primary/30' :
                    isRevealed ? 'bg-card border-border' :
                    'bg-secondary/50 border-transparent'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Step indicator */}
                    <div className={cn(
                      'shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold',
                      isLast ? 'bg-primary text-primary-foreground' :
                      isRevealed ? 'bg-success/10 text-success' :
                      'bg-muted text-muted-foreground'
                    )}>
                      {isRevealed && !isLast ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : isLocked ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        step.id
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'font-medium mb-1',
                        isLocked ? 'text-muted-foreground' : 'text-foreground'
                      )}>
                        {step.title}
                      </p>
                      
                      {isRevealed && (
                        <div className="space-y-3 animate-fade-in">
                          <p className="text-sm text-muted-foreground">{step.content}</p>
                          
                          {step.formula && (
                            <div className="p-3 rounded-lg bg-secondary">
                              <p className="text-xs text-muted-foreground mb-1">Формула</p>
                              <p className="font-mono text-foreground">{step.formula}</p>
                            </div>
                          )}
                          
                          {step.calculation && (
                            <div className="flex items-center gap-3">
                              <div className="flex-1 p-3 rounded-lg bg-secondary">
                                <p className="font-mono text-foreground">{step.calculation}</p>
                              </div>
                              <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                              <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                                <p className="font-mono font-bold text-success">{step.result}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Next Button */}
        {revealedStep < CASE_STUDY.length && (
          <div className="mt-8 flex justify-center">
            <Button 
              onClick={revealNext} 
              size="lg" 
              className="gap-2 h-14 px-10 text-base font-bold shadow-lg hover:scale-105 transition-transform"
            >
              Далее
              <ChevronDown className="h-5 w-5" />
            </Button>
          </div>
        )}

        {revealedStep >= CASE_STUDY.length && (
          <div className="mt-6 p-4 rounded-xl bg-success/10 border border-success/20 text-center">
            <p className="font-medium text-success">🎉 Кейс разобран!</p>
            <p className="text-sm text-success/80 mt-1">Теперь попробуй решить задачи самостоятельно</p>
          </div>
        )}
      </div>

      {/* Formula Cards */}
      <div className="opacity-0 animate-fade-in stagger-3">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Шпаргалка формул</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormulaCard 
            title="Unit Margin" 
            formula="Price - COGS" 
            description="Прибыль с одной продажи"
          />
          <FormulaCard 
            title="CAC" 
            formula="Marketing / New Customers" 
            description="Стоимость привлечения"
          />
          <FormulaCard 
            title="LTV" 
            formula="ARPU / Churn Rate" 
            description="Пожизненная ценность"
          />
          <FormulaCard 
            title="LTV/CAC" 
            formula="LTV ÷ CAC ≥ 3" 
            description="Здоровье экономики"
          />
        </div>
      </div>
    </div>
  );
}

function FormulaCard({ title, formula, description }: { title: string; formula: string; description: string }) {
  return (
    <div className="p-4 card-glass">
      <p className="text-sm font-medium text-foreground mb-1">{title}</p>
      <p className="font-mono text-lg text-primary mb-2">{formula}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
