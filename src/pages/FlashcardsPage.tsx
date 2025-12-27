import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Flashcard {
  id: number;
  front: string;
  back: string;
  formula?: string;
  category: string;
}

const FLASHCARDS: Flashcard[] = [
  {
    id: 1,
    front: 'LTV',
    back: 'Lifetime Value — пожизненная ценность клиента. Сколько денег принесёт клиент за всё время.',
    formula: 'LTV = ARPU × Avg. Lifetime',
    category: 'Основы'
  },
  {
    id: 2,
    front: 'CAC',
    back: 'Customer Acquisition Cost — стоимость привлечения одного платящего клиента.',
    formula: 'CAC = Marketing Spend / New Customers',
    category: 'Основы'
  },
  {
    id: 3,
    front: 'Unit Margin',
    back: 'Прибыль с одной продажи после вычета прямых расходов.',
    formula: 'Unit Margin = Price - COGS',
    category: 'Основы'
  },
  {
    id: 4,
    front: 'Churn Rate',
    back: 'Процент клиентов, которые уходят за период.',
    formula: 'Churn = Lost / Total × 100%',
    category: 'Retention'
  },
  {
    id: 5,
    front: 'ARPU',
    back: 'Average Revenue Per User — средний доход с одного пользователя за период.',
    formula: 'ARPU = Revenue / Users',
    category: 'Revenue'
  },
  {
    id: 6,
    front: 'ARPPU',
    back: 'Average Revenue Per Paying User — средний доход только с платящих пользователей.',
    formula: 'ARPPU = Revenue / Paying Users',
    category: 'Revenue'
  },
  {
    id: 7,
    front: 'LTV/CAC Ratio',
    back: 'Главная метрика здоровья бизнеса. Должно быть ≥ 3.',
    formula: 'Ratio = LTV / CAC',
    category: 'Основы'
  },
  {
    id: 8,
    front: 'Payback Period',
    back: 'Время, за которое клиент окупает затраты на привлечение.',
    formula: 'Payback = CAC / (ARPU × Margin)',
    category: 'Strategy'
  },
  {
    id: 9,
    front: 'MRR',
    back: 'Monthly Recurring Revenue — ежемесячная повторяющаяся выручка.',
    formula: 'Net MRR = New + Expansion - Churned',
    category: 'SaaS'
  },
  {
    id: 10,
    front: 'K-Factor',
    back: 'Коэффициент виральности. K > 1 означает вирусный рост.',
    formula: 'K = Invites × Conversion',
    category: 'Growth'
  },
  {
    id: 11,
    front: 'NPS',
    back: 'Net Promoter Score — уровень лояльности клиентов от -100 до 100.',
    formula: 'NPS = % Promoters - % Detractors',
    category: 'Metrics'
  },
  {
    id: 12,
    front: 'Retention Rate',
    back: 'Процент пользователей, которые вернулись в продукт спустя N дней.',
    formula: 'Retention = Active(N) / Cohort',
    category: 'Retention'
  },
  {
    id: 13,
    front: 'Burn Rate',
    back: 'Скорость расходования денег компанией.',
    formula: 'Runway = Cash / Burn Rate',
    category: 'Startups'
  },
  {
    id: 14,
    front: 'North Star Metric',
    back: 'Главная метрика продукта, измеряющая ключевую ценность для клиентов.',
    category: 'Strategy'
  },
  {
    id: 15,
    front: 'AARRR',
    back: 'Пиратские метрики: Acquisition, Activation, Retention, Referral, Revenue.',
    category: 'Framework'
  },
  {
    id: 16,
    front: 'CPA',
    back: 'Cost Per Acquisition — общие затраты на приобретение клиента.',
    formula: 'CPA = Total Spend / Conversions',
    category: 'Marketing'
  }
];

export function FlashcardsPage() {
  const [cards, setCards] = useState(FLASHCARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<Set<number>>(new Set());
  const [unknownCards, setUnknownCards] = useState<Set<number>>(new Set());

  const currentCard = cards[currentIndex];
  const progress = ((knownCards.size + unknownCards.size) / cards.length) * 100;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleKnown = () => {
    setKnownCards(prev => new Set(prev).add(currentCard.id));
    setUnknownCards(prev => {
      const next = new Set(prev);
      next.delete(currentCard.id);
      return next;
    });
    handleNext();
  };

  const handleUnknown = () => {
    setUnknownCards(prev => new Set(prev).add(currentCard.id));
    setKnownCards(prev => {
      const next = new Set(prev);
      next.delete(currentCard.id);
      return next;
    });
    handleNext();
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleReset = () => {
    setCards(FLASHCARDS);
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards(new Set());
    setUnknownCards(new Set());
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="opacity-0 animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <h1 className="heading-lg text-foreground">Флэшкарты</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleShuffle}>
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {cards.length}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 opacity-0 animate-fade-in stagger-1">
        <div className="flex-1 p-3 rounded-xl bg-success/10 text-center">
          <p className="text-2xl font-bold text-success">{knownCards.size}</p>
          <p className="text-xs text-success/80">Знаю</p>
        </div>
        <div className="flex-1 p-3 rounded-xl bg-destructive/10 text-center">
          <p className="text-2xl font-bold text-destructive">{unknownCards.size}</p>
          <p className="text-xs text-destructive/80">Повторить</p>
        </div>
        <div className="flex-1 p-3 rounded-xl bg-muted text-center">
          <p className="text-2xl font-bold text-muted-foreground">{cards.length - knownCards.size - unknownCards.size}</p>
          <p className="text-xs text-muted-foreground">Осталось</p>
        </div>
      </div>

      {/* Flashcard */}
      <div 
        className="perspective-1000 opacity-0 animate-fade-in stagger-2"
        onClick={handleFlip}
      >
        <div 
          className={cn(
            'relative w-full aspect-[3/2] cursor-pointer transition-transform duration-500 transform-style-3d',
            isFlipped && 'rotate-y-180'
          )}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Front */}
          <div 
            className="absolute inset-0 backface-hidden card-elevated p-8 flex flex-col items-center justify-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-xs font-semibold text-primary mb-4">
              {currentCard.category}
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-primary text-center">
              {currentCard.front}
            </h2>
            <p className="text-sm text-muted-foreground mt-6">Нажми, чтобы перевернуть</p>
          </div>

          {/* Back */}
          <div 
            className="absolute inset-0 backface-hidden card-elevated p-8 flex flex-col items-center justify-center"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <p className="text-lg text-center text-foreground mb-4">
              {currentCard.back}
            </p>
            {currentCard.formula && (
              <div className="px-4 py-3 rounded-xl bg-primary/10 mt-2">
                <code className="font-mono text-primary font-semibold">
                  {currentCard.formula}
                </code>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between opacity-0 animate-fade-in stagger-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="h-12 w-12"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleUnknown}
            className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            <X className="h-4 w-4" />
            Не знаю
          </Button>
          <Button
            variant="outline"
            onClick={handleKnown}
            className="gap-2 border-success/30 text-success hover:bg-success/10"
          >
            <Check className="h-4 w-4" />
            Знаю
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          className="h-12 w-12"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
