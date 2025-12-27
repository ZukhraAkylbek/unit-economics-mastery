import { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronDown, CheckCircle, Lock, BookOpen, Calculator, TrendingUp, Users, Repeat, Lightbulb, FileText, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CaseStep {
  id: number;
  title: string;
  content: string;
  formula?: string;
  calculation?: string;
  result?: string;
  tip?: string;
}

const CASE_STUDY: CaseStep[] = [
  {
    id: 1,
    title: 'Исходные данные',
    content: 'Стартап продаёт подписку на сервис за 2000₽/мес. Себестоимость обслуживания одного клиента — 400₽/мес.',
    tip: 'Всегда начинай с понимания базовых цифр: цена и себестоимость',
  },
  {
    id: 2,
    title: 'Считаем маржу',
    content: 'Маржа с одного юнита (клиента) в месяц:',
    formula: 'Unit Margin = Price - COGS',
    calculation: '2000₽ - 400₽',
    result: '1600₽',
    tip: 'Положительная маржа — первый шаг к прибыли',
  },
  {
    id: 3,
    title: 'Данные по привлечению',
    content: 'На маркетинг потратили 500 000₽ и привлекли 200 новых клиентов.',
    tip: 'Важно трекать все каналы привлечения отдельно',
  },
  {
    id: 4,
    title: 'Считаем CAC',
    content: 'Стоимость привлечения одного клиента:',
    formula: 'CAC = Marketing Spend / New Customers',
    calculation: '500 000₽ / 200',
    result: '2500₽',
    tip: 'CAC должен окупаться быстрее, чем клиент уходит',
  },
  {
    id: 5,
    title: 'Данные по удержанию',
    content: 'Средний Churn Rate составляет 5% в месяц (5 из 100 клиентов уходят каждый месяц).',
    tip: 'Снижение Churn на 1% может увеличить LTV на 10-30%',
  },
  {
    id: 6,
    title: 'Считаем LTV',
    content: 'Пожизненная ценность клиента:',
    formula: 'LTV = ARPU / Churn Rate',
    calculation: '2000₽ / 0.05',
    result: '40 000₽',
    tip: 'Альтернативная формула: LTV = ARPU × Avg. Lifetime',
  },
  {
    id: 7,
    title: 'Главный показатель',
    content: 'Соотношение LTV к CAC показывает здоровье экономики:',
    formula: 'LTV/CAC Ratio',
    calculation: '40 000₽ / 2500₽',
    result: '16x ✅',
    tip: 'LTV/CAC ≥ 3 — можно масштабировать, < 3 — риск',
  },
  {
    id: 8,
    title: 'Вывод',
    content: 'LTV/CAC = 16 — это отличный показатель! Стандарт ≥ 3. Бизнес-модель здорова, можно масштабировать.',
    tip: '> 5 — возможно недоинвестируете в маркетинг',
  },
];

const TOPICS = [
  { id: 'unit', label: 'Юнит и маржа', icon: BookOpen, description: 'Базовая единица бизнеса', color: 'bg-blue-500/10 text-blue-600' },
  { id: 'cac', label: 'CAC', icon: Users, description: 'Стоимость привлечения', color: 'bg-green-500/10 text-green-600' },
  { id: 'ltv', label: 'LTV', icon: TrendingUp, description: 'Пожизненная ценность', color: 'bg-purple-500/10 text-purple-600' },
  { id: 'churn', label: 'Churn', icon: Repeat, description: 'Отток клиентов', color: 'bg-orange-500/10 text-orange-600' },
  { id: 'ratio', label: 'LTV/CAC', icon: Calculator, description: 'Главная метрика', color: 'bg-primary/10 text-primary' },
];

// Content from PDF materials
const METRICS_CONTENT = {
  aarrr: {
    title: 'AARRR — Пиратские метрики',
    items: [
      { name: 'Acquisition', desc: 'Привлечение — как люди узнают о продукте' },
      { name: 'Activation', desc: 'Активация — первый успешный опыт использования' },
      { name: 'Retention', desc: 'Удержание — возвращаются ли пользователи' },
      { name: 'Referral', desc: 'Рекомендации — приводят ли друзей' },
      { name: 'Revenue', desc: 'Выручка — платят ли за продукт' },
    ]
  },
  nps: {
    title: 'NPS — Net Promoter Score',
    formula: 'NPS = % сторонников — % критиков',
    items: [
      { name: '9-10 баллов', desc: 'Промоутеры — рекомендуют продукт' },
      { name: '7-8 баллов', desc: 'Нейтральные — довольны, но не восторге' },
      { name: '0-6 баллов', desc: 'Критики — недовольны, могут навредить' },
    ]
  },
  nsm: {
    title: 'NSM — North Star Metric',
    desc: 'Главная метрика продукта, которая измеряет ключевую ценность для клиентов.',
    examples: [
      { company: 'Netflix', metric: 'Минуты просмотра контента' },
      { company: 'Airbnb', metric: 'Количество забронированных ночей' },
      { company: 'Uber', metric: 'Количество поездок в неделю' },
      { company: 'Slack', metric: 'Сообщения, отправленные командой' },
    ]
  }
};

export function TheoryPage() {
  const [revealedStep, setRevealedStep] = useState(1);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'case' | 'metrics' | 'formulas'>('case');
  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const lastRevealedRef = useRef<HTMLDivElement>(null);

  const revealNext = () => {
    if (revealedStep < CASE_STUDY.length) {
      setRevealedStep(revealedStep + 1);
    }
  };

  const resetCase = () => {
    setRevealedStep(1);
  };

  // Auto-scroll to the last revealed step
  useEffect(() => {
    if (lastRevealedRef.current) {
      lastRevealedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [revealedStep]);

  return (
    <div className="pb-32 relative">
      {/* Header */}
      <div className="opacity-0 animate-fade-in mb-6">
        <h1 className="heading-lg text-foreground mb-1">База знаний</h1>
        <p className="text-muted-foreground">Интерактивное обучение unit-экономике</p>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 opacity-0 animate-fade-in stagger-1">
        {[
          { id: 'case', label: 'Разбор кейса', icon: FileText },
          { id: 'metrics', label: 'Метрики', icon: Zap },
          { id: 'formulas', label: 'Формулы', icon: Calculator },
        ].map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as any)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap',
                activeSection === section.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border hover:border-primary/30'
              )}
            >
              <Icon className="h-4 w-4" />
              {section.label}
            </button>
          );
        })}
      </div>

      {/* Topics Quick Access */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6 opacity-0 animate-fade-in stagger-2">
        {TOPICS.map((topic) => {
          const Icon = topic.icon;
          const isActive = activeTopic === topic.id;
          
          return (
            <button
              key={topic.id}
              onClick={() => setActiveTopic(isActive ? null : topic.id)}
              className={cn(
                'p-3 rounded-xl text-left transition-all',
                isActive 
                  ? 'bg-primary text-primary-foreground scale-[1.02]' 
                  : 'bg-card border border-border hover:border-primary/30'
              )}
            >
              <Icon className={cn('h-4 w-4 mb-1', isActive ? 'text-primary-foreground' : 'text-primary')} />
              <p className={cn('font-medium text-xs', isActive ? 'text-primary-foreground' : 'text-foreground')}>
                {topic.label}
              </p>
            </button>
          );
        })}
      </div>

      {/* Case Study Section */}
      {activeSection === 'case' && (
        <div className="card-glass p-5 sm:p-6 opacity-0 animate-fade-in stagger-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">Разбор кейса SaaS</h2>
              <p className="text-xs text-muted-foreground">Пошаговый расчёт экономики</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 px-3 rounded-full bg-primary/10 flex items-center">
                <span className="text-xs font-semibold text-primary">
                  {revealedStep}/{CASE_STUDY.length}
                </span>
              </div>
              {revealedStep > 1 && (
                <Button variant="ghost" size="sm" onClick={resetCase} className="h-8 text-xs">
                  Сначала
                </Button>
              )}
            </div>
          </div>

          {/* Steps */}
          <div ref={stepsContainerRef} className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
            {CASE_STUDY.map((step, index) => {
              const isRevealed = index < revealedStep;
              const isLast = index === revealedStep - 1;
              const isLocked = index >= revealedStep;

              return (
                <div
                  key={step.id}
                  ref={isLast ? lastRevealedRef : null}
                  className={cn(
                    'transition-all duration-300',
                    isLocked && 'opacity-30'
                  )}
                >
                  <div
                    className={cn(
                      'p-4 rounded-xl border transition-all',
                      isLast ? 'bg-primary/5 border-primary/30 shadow-sm' :
                      isRevealed ? 'bg-card border-border' :
                      'bg-secondary/50 border-transparent'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold',
                        isLast ? 'bg-primary text-primary-foreground' :
                        isRevealed ? 'bg-success/10 text-success' :
                        'bg-muted text-muted-foreground'
                      )}>
                        {isRevealed && !isLast ? (
                          <CheckCircle className="h-3.5 w-3.5" />
                        ) : isLocked ? (
                          <Lock className="h-3.5 w-3.5" />
                        ) : (
                          step.id
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          'font-medium text-sm mb-1',
                          isLocked ? 'text-muted-foreground' : 'text-foreground'
                        )}>
                          {step.title}
                        </p>
                        
                        {isRevealed && (
                          <div className="space-y-2 animate-fade-in">
                            <p className="text-xs text-muted-foreground">{step.content}</p>
                            
                            {step.formula && (
                              <div className="p-2.5 rounded-lg bg-secondary">
                                <p className="text-[10px] text-muted-foreground mb-0.5">Формула</p>
                                <p className="font-mono text-sm text-foreground">{step.formula}</p>
                              </div>
                            )}
                            
                            {step.calculation && (
                              <div className="flex items-center gap-2">
                                <div className="flex-1 p-2.5 rounded-lg bg-secondary">
                                  <p className="font-mono text-sm text-foreground">{step.calculation}</p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                                <div className="p-2.5 rounded-lg bg-success/10 border border-success/20">
                                  <p className="font-mono text-sm font-bold text-success">{step.result}</p>
                                </div>
                              </div>
                            )}

                            {step.tip && (
                              <div className="flex items-start gap-2 p-2 rounded-lg bg-warning/10 border border-warning/20">
                                <Lightbulb className="h-3.5 w-3.5 text-warning shrink-0 mt-0.5" />
                                <p className="text-xs text-warning">{step.tip}</p>
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

          {revealedStep >= CASE_STUDY.length && (
            <div className="mt-4 p-4 rounded-xl bg-success/10 border border-success/20 text-center">
              <p className="font-medium text-success">🎉 Кейс разобран!</p>
              <p className="text-xs text-success/80 mt-1">Теперь попробуй решить задачи самостоятельно</p>
            </div>
          )}
        </div>
      )}

      {/* Metrics Section */}
      {activeSection === 'metrics' && (
        <div className="space-y-4 opacity-0 animate-fade-in">
          {/* AARRR */}
          <div className="card-glass p-5">
            <h3 className="font-display text-lg font-bold text-foreground mb-3">{METRICS_CONTENT.aarrr.title}</h3>
            <div className="space-y-2">
              {METRICS_CONTENT.aarrr.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{item.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NPS */}
          <div className="card-glass p-5">
            <h3 className="font-display text-lg font-bold text-foreground mb-2">{METRICS_CONTENT.nps.title}</h3>
            <div className="p-3 rounded-lg bg-primary/10 mb-3">
              <code className="font-mono text-primary">{METRICS_CONTENT.nps.formula}</code>
            </div>
            <div className="grid gap-2">
              {METRICS_CONTENT.nps.items.map((item, i) => (
                <div key={i} className={cn(
                  'p-3 rounded-lg border',
                  i === 0 ? 'bg-success/10 border-success/20' :
                  i === 1 ? 'bg-warning/10 border-warning/20' :
                  'bg-destructive/10 border-destructive/20'
                )}>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* NSM */}
          <div className="card-glass p-5">
            <h3 className="font-display text-lg font-bold text-foreground mb-2">{METRICS_CONTENT.nsm.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{METRICS_CONTENT.nsm.desc}</p>
            <div className="grid gap-2">
              {METRICS_CONTENT.nsm.examples.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <span className="font-medium text-sm text-foreground">{item.company}</span>
                  <span className="text-xs text-primary font-mono">{item.metric}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Formulas Section */}
      {activeSection === 'formulas' && (
        <div className="grid sm:grid-cols-2 gap-3 opacity-0 animate-fade-in">
          <FormulaCard 
            title="Unit Margin" 
            formula="Price - COGS" 
            description="Прибыль с одной продажи"
            example="2000₽ - 400₽ = 1600₽"
          />
          <FormulaCard 
            title="CAC" 
            formula="Marketing / New Customers" 
            description="Стоимость привлечения"
            example="500k₽ / 200 = 2500₽"
          />
          <FormulaCard 
            title="ARPU" 
            formula="Revenue / Users" 
            description="Средний доход на юзера"
            example="1M₽ / 500 = 2000₽"
          />
          <FormulaCard 
            title="LTV" 
            formula="ARPU / Churn Rate" 
            description="Пожизненная ценность"
            example="2000₽ / 0.05 = 40k₽"
          />
          <FormulaCard 
            title="LTV/CAC" 
            formula="LTV ÷ CAC ≥ 3" 
            description="Здоровье экономики"
            example="40k₽ / 2.5k₽ = 16x ✅"
          />
          <FormulaCard 
            title="Payback" 
            formula="CAC / ARPU" 
            description="Месяцев до окупаемости"
            example="2500₽ / 2000₽ = 1.25 мес"
          />
          <FormulaCard 
            title="Churn Rate" 
            formula="Lost / Total × 100%" 
            description="Процент оттока"
            example="50 / 1000 = 5%"
          />
          <FormulaCard 
            title="NPS" 
            formula="% Promoters - % Detractors" 
            description="Индекс лояльности"
            example="60% - 20% = 40"
          />
        </div>
      )}

      {/* Fixed Bottom Button */}
      {activeSection === 'case' && revealedStep < CASE_STUDY.length && (
        <div className="fixed bottom-20 left-0 right-0 z-30 px-4 pb-4 pt-8 bg-gradient-to-t from-background via-background to-transparent">
          <div className="container max-w-lg mx-auto">
            <Button 
              onClick={revealNext} 
              size="lg" 
              className="w-full gap-2 h-14 text-base font-bold shadow-elevated hover:scale-[1.02] transition-transform"
            >
              Далее
              <ChevronDown className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function FormulaCard({ title, formula, description, example }: { title: string; formula: string; description: string; example?: string }) {
  return (
    <div className="p-4 card-glass hover:border-primary/30 transition-all">
      <p className="text-sm font-medium text-foreground mb-1">{title}</p>
      <p className="font-mono text-lg text-primary mb-1">{formula}</p>
      <p className="text-xs text-muted-foreground mb-2">{description}</p>
      {example && (
        <div className="p-2 rounded-lg bg-secondary/50">
          <p className="font-mono text-xs text-foreground">{example}</p>
        </div>
      )}
    </div>
  );
}
