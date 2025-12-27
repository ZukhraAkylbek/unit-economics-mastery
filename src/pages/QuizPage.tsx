import { useState } from 'react';
import { CheckCircle, XCircle, ArrowRight, Trophy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Что показывает метрика LTV?',
    options: [
      'Стоимость привлечения клиента',
      'Пожизненную ценность клиента',
      'Процент оттока',
      'Средний чек'
    ],
    correctIndex: 1,
    explanation: 'LTV (Lifetime Value) — сколько денег принесёт клиент за всё время работы с вами.',
    category: 'LTV'
  },
  {
    id: 2,
    question: 'Какое минимальное соотношение LTV/CAC считается здоровым?',
    options: [
      '1:1',
      '2:1',
      '3:1',
      '5:1'
    ],
    correctIndex: 2,
    explanation: 'LTV/CAC ≥ 3 — золотой стандарт. Меньше 3 — риск, больше 5 — возможно недоинвестируете в рост.',
    category: 'Ratio'
  },
  {
    id: 3,
    question: 'CAC расшифровывается как:',
    options: [
      'Customer Annual Cost',
      'Customer Acquisition Cost',
      'Churn Acquisition Cost',
      'Customer Average Cost'
    ],
    correctIndex: 1,
    explanation: 'CAC = Customer Acquisition Cost — стоимость привлечения одного платящего клиента.',
    category: 'CAC'
  },
  {
    id: 4,
    question: 'При Churn Rate 5% в месяц, какой средний срок жизни клиента?',
    options: [
      '5 месяцев',
      '10 месяцев',
      '20 месяцев',
      '50 месяцев'
    ],
    correctIndex: 2,
    explanation: 'Average Lifetime = 1 / Churn Rate. При 5% (0.05) это 1/0.05 = 20 месяцев.',
    category: 'Churn'
  },
  {
    id: 5,
    question: 'Что входит в расчёт Unit Margin?',
    options: [
      'Выручка минус маркетинг',
      'Цена минус себестоимость (COGS)',
      'LTV минус CAC',
      'ARPU минус Churn'
    ],
    correctIndex: 1,
    explanation: 'Unit Margin = Price - COGS. Показывает чистую прибыль с одной продажи.',
    category: 'Unit'
  },
  {
    id: 6,
    question: 'ARPU — это:',
    options: [
      'Average Revenue Per User',
      'Annual Recurring Payment Unit',
      'Acquisition Rate Per User',
      'Average Retention Per User'
    ],
    correctIndex: 0,
    explanation: 'ARPU = Average Revenue Per User — средний доход с одного пользователя за период.',
    category: 'ARPU'
  },
  {
    id: 7,
    question: 'Что такое North Star Metric (NSM)?',
    options: [
      'Главная метрика прибыли',
      'Ключевая метрика, измеряющая ценность для клиентов',
      'Метрика привлечения',
      'Показатель виральности'
    ],
    correctIndex: 1,
    explanation: 'NSM — главная метрика продукта, которая измеряет ключевую ценность для клиентов. Например, для Netflix это минуты просмотра.',
    category: 'NSM'
  },
  {
    id: 8,
    question: 'NPS измеряет:',
    options: [
      'Прибыльность продукта',
      'Скорость роста',
      'Уровень лояльности клиентов',
      'Конверсию воронки'
    ],
    correctIndex: 2,
    explanation: 'NPS (Net Promoter Score) = % сторонников — % критиков. Показывает лояльность клиентов.',
    category: 'NPS'
  },
  {
    id: 9,
    question: 'Что такое Retention Rate?',
    options: [
      'Процент новых пользователей',
      'Процент вернувшихся пользователей',
      'Стоимость удержания',
      'Коэффициент конверсии'
    ],
    correctIndex: 1,
    explanation: 'Retention Rate показывает, какой процент пользователей вернулся в продукт спустя N дней.',
    category: 'Retention'
  },
  {
    id: 10,
    question: 'K-Factor > 1 означает:',
    options: [
      'Убыточный рост',
      'Стабильный рост',
      'Вирусный рост',
      'Замедление роста'
    ],
    correctIndex: 2,
    explanation: 'K-Factor > 1 означает вирусный рост — каждый пользователь приводит больше одного нового.',
    category: 'Virality'
  }
];

export function QuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentIndex];
  const isCorrect = selectedOption === currentQuestion?.correctIndex;

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === currentQuestion.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    const percentage = Math.round((score / QUIZ_QUESTIONS.length) * 100);
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-primary/10 mx-auto">
            <Trophy className="h-12 w-12 text-primary" />
          </div>
          <div>
            <h1 className="heading-lg text-foreground mb-2">Квиз завершён!</h1>
            <p className="text-muted-foreground">
              Твой результат: <span className="text-primary font-bold">{score}/{QUIZ_QUESTIONS.length}</span>
            </p>
          </div>
          <div className="w-full max-w-xs mx-auto">
            <div className="h-3 rounded-full bg-secondary overflow-hidden">
              <div 
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  percentage >= 70 ? 'bg-success' : percentage >= 50 ? 'bg-warning' : 'bg-destructive'
                )}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">{percentage}% правильных ответов</p>
          </div>
          <div className="flex gap-3 justify-center pt-4">
            <Button onClick={handleRestart} variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Пройти снова
            </Button>
            <Button onClick={() => window.history.back()}>
              Назад
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="opacity-0 animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <h1 className="heading-lg text-foreground">Квиз</h1>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {QUIZ_QUESTIONS.length}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="card-elevated p-6 sm:p-8 opacity-0 animate-fade-in stagger-1">
        <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-xs font-semibold text-primary mb-4">
          {currentQuestion.category}
        </div>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-6">
          {currentQuestion.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const showCorrect = isAnswered && index === currentQuestion.correctIndex;
            const showWrong = isAnswered && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={isAnswered}
                className={cn(
                  'w-full p-4 rounded-xl text-left transition-all border',
                  !isAnswered && 'hover:border-primary/50 hover:bg-primary/5',
                  !isAnswered && !isSelected && 'bg-card border-border',
                  isSelected && !isAnswered && 'border-primary bg-primary/10',
                  showCorrect && 'border-success bg-success/10',
                  showWrong && 'border-destructive bg-destructive/10'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold',
                    !isAnswered && 'bg-secondary text-muted-foreground',
                    showCorrect && 'bg-success text-success-foreground',
                    showWrong && 'bg-destructive text-destructive-foreground'
                  )}>
                    {showCorrect ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : showWrong ? (
                      <XCircle className="h-4 w-4" />
                    ) : (
                      String.fromCharCode(65 + index)
                    )}
                  </div>
                  <span className={cn(
                    'font-medium',
                    showCorrect && 'text-success',
                    showWrong && 'text-destructive'
                  )}>
                    {option}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {isAnswered && (
          <div className={cn(
            'mt-6 p-4 rounded-xl animate-fade-in',
            isCorrect ? 'bg-success/10 border border-success/20' : 'bg-warning/10 border border-warning/20'
          )}>
            <p className={cn(
              'text-sm font-medium mb-1',
              isCorrect ? 'text-success' : 'text-warning'
            )}>
              {isCorrect ? '✓ Правильно!' : '✗ Неправильно'}
            </p>
            <p className="text-sm text-muted-foreground">
              {currentQuestion.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Next Button */}
      {isAnswered && (
        <div className="flex justify-center opacity-0 animate-fade-in">
          <Button onClick={handleNext} size="lg" className="gap-2 px-8">
            {currentIndex < QUIZ_QUESTIONS.length - 1 ? 'Дальше' : 'Завершить'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
