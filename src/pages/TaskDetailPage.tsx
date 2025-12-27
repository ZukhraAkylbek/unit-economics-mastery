import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Calculator, Lightbulb, Target, CheckCircle, XCircle, RotateCcw, Brain, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { MODULES, CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

type Step = 'theory' | 'formula' | 'example' | 'quiz' | 'flashcard' | 'task';

const STEPS: { id: Step; label: string; icon: React.ElementType }[] = [
  { id: 'theory', label: 'Теория', icon: BookOpen },
  { id: 'formula', label: 'Формула', icon: Calculator },
  { id: 'example', label: 'Пример', icon: Lightbulb },
  { id: 'quiz', label: 'Квиз', icon: Brain },
  { id: 'flashcard', label: 'Карточка', icon: Layers },
  { id: 'task', label: 'Задача', icon: Target },
];

// Quiz questions per module
const MODULE_QUIZZES: Record<string, { question: string; options: string[]; correctIndex: number; explanation: string }[]> = {
  'unit-margin': [
    {
      question: 'Что такое COGS?',
      options: ['Прибыль с продажи', 'Себестоимость товара', 'Стоимость привлечения', 'Маржа'],
      correctIndex: 1,
      explanation: 'COGS (Cost of Goods Sold) — прямые расходы на производство или оказание услуги'
    },
    {
      question: 'Если маржа отрицательная, это значит:',
      options: ['Бизнес прибыльный', 'Каждая продажа убыточна', 'Нужно больше клиентов', 'Всё в порядке'],
      correctIndex: 1,
      explanation: 'Отрицательная маржа означает, что вы теряете деньги на каждой продаже'
    }
  ],
  'cac': [
    {
      question: 'CAC учитывает:',
      options: ['Только рекламу', 'Все затраты на привлечение', 'Только зарплаты', 'Себестоимость'],
      correctIndex: 1,
      explanation: 'CAC включает все расходы: рекламу, зарплаты маркетологов, инструменты, комиссии'
    },
    {
      question: 'Если CAC = 5000₽, а ARPU = 1000₽, сколько месяцев до окупаемости?',
      options: ['1 месяц', '5 месяцев', '50 месяцев', 'Невозможно посчитать'],
      correctIndex: 1,
      explanation: 'Payback = CAC / ARPU = 5000 / 1000 = 5 месяцев'
    }
  ],
  'ltv': [
    {
      question: 'LTV показывает:',
      options: ['Стоимость привлечения', 'Сколько денег принесёт клиент за всё время', 'Месячную выручку', 'Процент оттока'],
      correctIndex: 1,
      explanation: 'LTV (Lifetime Value) — пожизненная ценность клиента'
    },
    {
      question: 'При Churn 10% в месяц, какой средний срок жизни клиента?',
      options: ['1 месяц', '10 месяцев', '100 месяцев', '5 месяцев'],
      correctIndex: 1,
      explanation: 'Avg. Lifetime = 1 / Churn = 1 / 0.10 = 10 месяцев'
    }
  ],
  'ltv-cac-ratio': [
    {
      question: 'Какое минимальное LTV/CAC считается здоровым?',
      options: ['1:1', '2:1', '3:1', '10:1'],
      correctIndex: 2,
      explanation: 'LTV/CAC ≥ 3 — золотой стандарт здоровой экономики'
    },
    {
      question: 'LTV/CAC = 1 означает:',
      options: ['Отличный результат', 'Вы в нуле', 'Убытки', 'Нужно масштабировать'],
      correctIndex: 1,
      explanation: 'При ratio 1:1 вы только окупаете затраты на привлечение, без прибыли'
    }
  ],
  'churn': [
    {
      question: 'Churn Rate измеряет:',
      options: ['Процент новых клиентов', 'Процент ушедших клиентов', 'Выручку', 'Конверсию'],
      correctIndex: 1,
      explanation: 'Churn Rate — доля клиентов, которые перестали платить за период'
    },
    {
      question: 'Снижение Churn на 1% может увеличить LTV на:',
      options: ['1%', '5%', '10-30%', '100%'],
      correctIndex: 2,
      explanation: 'Удержание клиентов — один из самых мощных рычагов роста LTV'
    }
  ],
  'arpu': [
    {
      question: 'ARPU — это:',
      options: ['Средний доход на пользователя', 'Количество пользователей', 'Стоимость привлечения', 'Процент оттока'],
      correctIndex: 0,
      explanation: 'ARPU = Average Revenue Per User — средний доход на пользователя'
    }
  ]
};

// Flashcards per module
const MODULE_FLASHCARDS: Record<string, { front: string; back: string; formula?: string }[]> = {
  'unit-margin': [
    { front: 'Unit Margin', back: 'Прибыль с одной продажи после вычета прямых расходов', formula: 'Price - COGS' },
    { front: 'COGS', back: 'Cost of Goods Sold — себестоимость проданных товаров или услуг' },
    { front: 'Юнит', back: 'Базовая единица бизнеса: подписчик, заказ, чашка кофе' }
  ],
  'cac': [
    { front: 'CAC', back: 'Customer Acquisition Cost — стоимость привлечения клиента', formula: 'Marketing / Customers' },
    { front: 'CPA', back: 'Cost Per Acquisition — стоимость действия (регистрации, покупки)' }
  ],
  'ltv': [
    { front: 'LTV', back: 'Lifetime Value — пожизненная ценность клиента', formula: 'ARPU / Churn' },
    { front: 'Avg. Lifetime', back: 'Средний срок жизни клиента в месяцах', formula: '1 / Churn Rate' }
  ],
  'ltv-cac-ratio': [
    { front: 'LTV/CAC', back: 'Главная метрика здоровья бизнеса. Должно быть ≥ 3', formula: 'LTV ÷ CAC' },
    { front: 'Здоровый Ratio', back: '3-5x оптимально. < 3 — риск, > 5 — недоинвестируете в рост' }
  ],
  'churn': [
    { front: 'Churn Rate', back: 'Процент клиентов, которые уходят за период', formula: 'Lost / Total × 100%' },
    { front: 'Retention', back: 'Обратная сторона Churn — процент оставшихся', formula: '100% - Churn' }
  ],
  'arpu': [
    { front: 'ARPU', back: 'Average Revenue Per User — средний доход на пользователя', formula: 'Revenue / Users' },
    { front: 'ARPPU', back: 'Average Revenue Per Paying User — только по платящим', formula: 'Revenue / Paying Users' }
  ]
};

export function TaskDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const module = MODULES.find((m) => m.slug === slug);
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState<Step>('theory');
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  
  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizCorrect, setQuizCorrect] = useState(0);

  // Flashcard state
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);

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

  const quizzes = MODULE_QUIZZES[slug || ''] || [];
  const flashcards = MODULE_FLASHCARDS[slug || ''] || [];
  const currentQuiz = quizzes[quizIndex];
  const currentFlashcard = flashcards[flashcardIndex];

  const goNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex].id);
      // Reset states for new step
      if (STEPS[nextIndex].id === 'quiz') {
        setQuizIndex(0);
        setQuizAnswer(null);
        setQuizCorrect(0);
      }
      if (STEPS[nextIndex].id === 'flashcard') {
        setFlashcardIndex(0);
        setFlashcardFlipped(false);
      }
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
        description: '+50 коинов за правильный ответ',
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

  const handleQuizAnswer = (index: number) => {
    if (quizAnswer !== null) return;
    setQuizAnswer(index);
    if (index === currentQuiz.correctIndex) {
      setQuizCorrect(prev => prev + 1);
    }
  };

  const nextQuizQuestion = () => {
    if (quizIndex < quizzes.length - 1) {
      setQuizIndex(prev => prev + 1);
      setQuizAnswer(null);
    } else {
      goNext();
    }
  };

  const nextFlashcard = () => {
    if (flashcardIndex < flashcards.length - 1) {
      setFlashcardIndex(prev => prev + 1);
      setFlashcardFlipped(false);
    } else {
      goNext();
    }
  };

  const prevFlashcard = () => {
    if (flashcardIndex > 0) {
      setFlashcardIndex(prev => prev - 1);
      setFlashcardFlipped(false);
    }
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
        <div className="flex items-center justify-between mb-3 overflow-x-auto pb-2">
          {STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            const isPassed = index < currentStepIndex;
            const StepIcon = step.icon;

            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={cn(
                  'flex flex-col items-center gap-1 transition-all min-w-[50px]',
                  isActive ? 'text-primary' : isPassed ? 'text-success' : 'text-muted-foreground'
                )}
              >
                <div className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center transition-all',
                  isActive ? 'bg-primary text-primary-foreground' :
                  isPassed ? 'bg-success/10 text-success' :
                  'bg-secondary'
                )}>
                  {isPassed ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <StepIcon className="h-4 w-4" />
                  )}
                </div>
                <span className="text-[10px] font-medium">{step.label}</span>
              </button>
            );
          })}
        </div>
        <Progress value={progress} className="h-1" />
      </div>

      {/* Content */}
      <div className="card-glass p-5 sm:p-6 opacity-0 animate-fade-in stagger-2">
        {/* Theory Step */}
        {currentStep === 'theory' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-display text-lg font-bold text-foreground">Теория</h2>
            </div>

            <div className="prose prose-sm max-w-none">
              {module.theory?.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-foreground/80 text-sm leading-relaxed">
                  {paragraph.split('**').map((part, j) => 
                    j % 2 === 1 ? (
                      <strong key={j} className="text-foreground font-semibold">{part}</strong>
                    ) : part
                  )}
                </p>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
              <div className="flex items-start gap-3">
                <span className="text-lg">💡</span>
                <div>
                  <p className="font-medium text-foreground text-sm mb-1">Ключевой инсайт</p>
                  <p className="text-xs text-muted-foreground">{module.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Formula Step */}
        {currentStep === 'formula' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Calculator className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-display text-lg font-bold text-foreground">Формула</h2>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 text-center">
              <p className="text-xl sm:text-2xl font-mono font-bold text-foreground">
                {module.formula}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Разбор формулы:</p>
              <div className="grid gap-2">
                {module.formula?.split(/[=+\-×÷*/]/).filter(Boolean).map((part, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {i + 1}
                    </div>
                    <span className="font-mono text-sm text-foreground">{part.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Example Step */}
        {currentStep === 'example' && module.example && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-display text-lg font-bold text-foreground">Пример</h2>
            </div>

            <div className="p-4 rounded-xl bg-secondary">
              <p className="text-xs text-muted-foreground mb-1">Условие</p>
              <p className="text-foreground text-sm font-medium">{module.example.description}</p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground">Решение:</p>
              
              <div className="relative pl-5 border-l-2 border-primary/30 space-y-3">
                <div className="relative">
                  <div className="absolute -left-[21px] w-3 h-3 rounded-full bg-primary" />
                  <div className="p-3 rounded-xl bg-card border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Подставляем</p>
                    <p className="font-mono text-sm text-foreground">{module.example.calculation}</p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[21px] w-3 h-3 rounded-full bg-success" />
                  <div className="p-3 rounded-xl bg-success/10 border border-success/20">
                    <p className="text-xs text-success mb-1">Ответ</p>
                    <p className="text-xl font-bold text-success">{module.example.answer.toLocaleString('ru-RU')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Step */}
        {currentStep === 'quiz' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-display text-lg font-bold text-foreground">Квиз</h2>
              </div>
              <span className="text-xs text-muted-foreground">
                {quizIndex + 1}/{quizzes.length}
              </span>
            </div>

            {quizzes.length > 0 && currentQuiz ? (
              <>
                <p className="text-foreground font-medium">{currentQuiz.question}</p>

                <div className="space-y-2">
                  {currentQuiz.options.map((option, i) => {
                    const isSelected = quizAnswer === i;
                    const isCorrect = i === currentQuiz.correctIndex;
                    const showResult = quizAnswer !== null;

                    return (
                      <button
                        key={i}
                        onClick={() => handleQuizAnswer(i)}
                        disabled={quizAnswer !== null}
                        className={cn(
                          'w-full p-3 rounded-xl text-left transition-all border text-sm',
                          !showResult && 'hover:border-primary/50 bg-card border-border',
                          showResult && isCorrect && 'border-success bg-success/10',
                          showResult && isSelected && !isCorrect && 'border-destructive bg-destructive/10'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold',
                            showResult && isCorrect ? 'bg-success text-white' :
                            showResult && isSelected ? 'bg-destructive text-white' :
                            'bg-secondary text-muted-foreground'
                          )}>
                            {showResult && isCorrect ? <CheckCircle className="h-4 w-4" /> :
                             showResult && isSelected ? <XCircle className="h-4 w-4" /> :
                             String.fromCharCode(65 + i)}
                          </div>
                          <span>{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {quizAnswer !== null && (
                  <div className={cn(
                    'p-3 rounded-xl text-sm',
                    quizAnswer === currentQuiz.correctIndex 
                      ? 'bg-success/10 border border-success/20 text-success'
                      : 'bg-warning/10 border border-warning/20 text-warning'
                  )}>
                    <p className="font-medium mb-1">
                      {quizAnswer === currentQuiz.correctIndex ? '✓ Правильно!' : '✗ Неверно'}
                    </p>
                    <p className="text-xs opacity-80">{currentQuiz.explanation}</p>
                  </div>
                )}

                {quizAnswer !== null && (
                  <Button onClick={nextQuizQuestion} className="w-full">
                    {quizIndex < quizzes.length - 1 ? 'Следующий вопрос' : 'Далее →'}
                  </Button>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p>Квиз для этого модуля в разработке</p>
                <Button onClick={goNext} className="mt-4">Пропустить</Button>
              </div>
            )}
          </div>
        )}

        {/* Flashcard Step */}
        {currentStep === 'flashcard' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Layers className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-display text-lg font-bold text-foreground">Карточка</h2>
              </div>
              <span className="text-xs text-muted-foreground">
                {flashcardIndex + 1}/{flashcards.length}
              </span>
            </div>

            {flashcards.length > 0 && currentFlashcard ? (
              <>
                <div 
                  onClick={() => setFlashcardFlipped(!flashcardFlipped)}
                  className="cursor-pointer min-h-[200px] p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 flex flex-col items-center justify-center text-center transition-all hover:scale-[1.01]"
                >
                  {!flashcardFlipped ? (
                    <>
                      <p className="text-2xl font-bold text-primary mb-2">{currentFlashcard.front}</p>
                      <p className="text-xs text-muted-foreground">Нажми, чтобы перевернуть</p>
                    </>
                  ) : (
                    <>
                      <p className="text-foreground mb-3">{currentFlashcard.back}</p>
                      {currentFlashcard.formula && (
                        <code className="px-3 py-2 rounded-lg bg-primary/20 font-mono text-primary">
                          {currentFlashcard.formula}
                        </code>
                      )}
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Button 
                    variant="ghost" 
                    onClick={prevFlashcard}
                    disabled={flashcardIndex === 0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Назад
                  </Button>
                  <Button onClick={nextFlashcard}>
                    {flashcardIndex < flashcards.length - 1 ? 'Далее' : 'Завершить'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Layers className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p>Карточки для этого модуля в разработке</p>
                <Button onClick={goNext} className="mt-4">Пропустить</Button>
              </div>
            )}
          </div>
        )}

        {/* Task Step */}
        {currentStep === 'task' && module.task && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-display text-lg font-bold text-foreground">Задача</h2>
            </div>

            <div className="p-4 rounded-xl bg-secondary">
              <p className="text-foreground">{module.task.question}</p>
            </div>

            <div className="space-y-3">
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
                    'h-12 text-lg font-semibold flex-1',
                    result === 'correct' && 'border-success bg-success/5',
                    result === 'incorrect' && 'border-destructive bg-destructive/5'
                  )}
                  disabled={result === 'correct'}
                />
                {result === 'correct' ? (
                  <Button size="lg" className="h-12 bg-success hover:bg-success/90" disabled>
                    <CheckCircle className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button size="lg" className="h-12" onClick={handleSubmit} disabled={!answer}>
                    Проверить
                  </Button>
                )}
              </div>

              {result === 'correct' && (
                <div className="p-3 rounded-xl bg-success/10 border border-success/20 flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success shrink-0" />
                  <div>
                    <p className="font-medium text-success text-sm">Правильно!</p>
                    <p className="text-xs text-success/80">+50 коинов добавлено</p>
                  </div>
                </div>
              )}

              {result === 'incorrect' && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3">
                  <XCircle className="h-5 w-5 text-destructive shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-destructive text-sm">Неверно</p>
                    <p className="text-xs text-destructive/80">Попробуй ещё раз</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={resetTask}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {result !== 'correct' && (
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <Lightbulb className="h-4 w-4" />
                  {showHint ? 'Скрыть подсказку' : 'Показать подсказку'}
                </button>
              )}

              {showHint && (
                <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
                  <p className="text-xs text-foreground">💡 {module.task.hint}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={goPrev}
            disabled={currentStepIndex === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад
          </Button>

          {currentStep !== 'quiz' && currentStep !== 'flashcard' && (
            currentStepIndex < STEPS.length - 1 ? (
              <Button size="sm" onClick={goNext} className="gap-2">
                Далее
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : result === 'correct' ? (
              <Button asChild size="sm" className="gap-2 bg-success hover:bg-success/90">
                <Link to="/tasks">
                  Завершить
                  <CheckCircle className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button size="sm" disabled className="gap-2">
                Реши задачу
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
