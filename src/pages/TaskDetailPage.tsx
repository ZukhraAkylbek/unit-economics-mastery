import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Lightbulb, CheckCircle, XCircle, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { MODULES, CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function TaskDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const module = MODULES.find((m) => m.slug === slug);
  const { toast } = useToast();

  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [showToolkit, setShowToolkit] = useState(false);

  if (!module) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-foreground mb-4">Модуль не найден</h1>
        <Button asChild>
          <Link to="/tasks">Вернуться к задачам</Link>
        </Button>
      </div>
    );
  }

  const category = CATEGORIES[module.category];

  const handleSubmit = () => {
    if (!module.task || !answer) return;

    const userAnswer = parseFloat(answer.replace(',', '.'));
    const correctAnswer = module.task.correctAnswer;
    const tolerance = correctAnswer * 0.01; // 1% tolerance

    if (Math.abs(userAnswer - correctAnswer) <= tolerance) {
      setResult('correct');
      toast({
        title: '🎉 Отлично!',
        description: 'Правильный ответ! +50 XP',
      });
    } else {
      setResult('incorrect');
      toast({
        title: 'Попробуй ещё раз',
        description: `Проверь расчеты. Подсказка: ${module.task.hint}`,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Back Button */}
      <Link
        to="/tasks"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Назад к задачам
      </Link>

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-semibold text-primary mb-4">
          {category.label} • МОДУЛЬ {module.id}
        </div>
        <h1 className="heading-display text-foreground mb-2">
          {module.title}
        </h1>
        <p className="text-lg text-muted-foreground">{module.description}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Theory */}
          {module.theory && (
            <div className="card-elevated p-6">
              <h2 className="font-display text-lg font-bold mb-4">ТЕОРИЯ</h2>
              <div className="prose prose-sm text-muted-foreground whitespace-pre-line">
                {module.theory}
              </div>
            </div>
          )}

          {/* Formula */}
          {module.formula && (
            <div className="p-6 rounded-2xl bg-primary/10 border border-primary/30">
              <div className="text-xs tracking-wider text-primary mb-2">ФОРМУЛА</div>
              <div className="text-xl font-mono font-bold text-foreground">
                {module.formula}
              </div>
            </div>
          )}

          {/* Example */}
          {module.example && (
            <div className="card-elevated p-6">
              <h2 className="font-display text-lg font-bold mb-4">ПРИМЕР</h2>
              <p className="text-muted-foreground mb-3">{module.example.description}</p>
              <div className="p-4 rounded-xl bg-muted font-mono">
                <div className="text-foreground">{module.example.calculation}</div>
              </div>
            </div>
          )}

          {/* Task */}
          {module.task && (
            <div className="card-elevated p-6">
              <h2 className="font-display text-lg font-bold mb-4">ЗАДАЧА</h2>
              <p className="text-foreground mb-6">{module.task.question}</p>

              <div className="flex gap-4">
                <Input
                  type="text"
                  placeholder="Твой ответ..."
                  value={answer}
                  onChange={(e) => {
                    setAnswer(e.target.value);
                    setResult(null);
                  }}
                  className={cn(
                    'h-14 text-lg font-semibold',
                    result === 'correct' && 'border-success bg-success/10',
                    result === 'incorrect' && 'border-destructive bg-destructive/10'
                  )}
                />
                <Button variant="hero" size="lg" onClick={handleSubmit} disabled={!answer}>
                  ПРОВЕРИТЬ
                </Button>
              </div>

              {/* Result */}
              {result && (
                <div
                  className={cn(
                    'mt-4 p-4 rounded-xl flex items-center gap-3',
                    result === 'correct' ? 'bg-success/10' : 'bg-destructive/10'
                  )}
                >
                  {result === 'correct' ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span className="text-success font-semibold">Правильно! +50 XP</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-destructive" />
                      <span className="text-destructive font-semibold">Неверно. Попробуй ещё раз.</span>
                    </>
                  )}
                </div>
              )}

              {/* Hint Toggle */}
              <button
                onClick={() => setShowHint(!showHint)}
                className="mt-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Lightbulb className="h-4 w-4" />
                {showHint ? 'Скрыть подсказку' : 'Показать подсказку'}
              </button>

              {showHint && (
                <div className="mt-3 p-4 rounded-xl bg-accent/10 border border-accent/30 text-sm text-accent-foreground">
                  💡 {module.task.hint}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Toolkit */}
        <div className="space-y-4">
          <div className="card-elevated p-4">
            <button
              onClick={() => setShowToolkit(!showToolkit)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                <span className="font-semibold">ТУЛКИТ</span>
              </div>
              <span className="text-muted-foreground">{showToolkit ? '−' : '+'}</span>
            </button>

            {showToolkit && (
              <div className="mt-4 pt-4 border-t border-border">
                <MiniCalc />
              </div>
            )}
          </div>

          {module.formula && (
            <div className="card-elevated p-4">
              <div className="text-xs tracking-wider text-muted-foreground mb-2">ФОРМУЛА</div>
              <div className="font-mono text-sm text-primary">{module.formula}</div>
            </div>
          )}

          <Button variant="outline" className="w-full" asChild>
            <Link to="/toolkit">Открыть полный тулкит</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function MiniCalc() {
  const [display, setDisplay] = useState('0');

  const handleInput = (val: string) => {
    if (val === 'C') {
      setDisplay('0');
    } else if (val === '=') {
      try {
        const result = eval(display.replace('×', '*').replace('÷', '/'));
        setDisplay(String(result));
      } catch {
        setDisplay('Error');
      }
    } else {
      setDisplay((prev) => (prev === '0' ? val : prev + val));
    }
  };

  return (
    <div>
      <div className="bg-muted rounded-lg p-2 mb-2 text-right font-mono text-lg">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-1">
        {['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '-', 'C', '0', '=', '+'].map((btn) => (
          <button
            key={btn}
            onClick={() => handleInput(btn)}
            className={cn(
              'h-9 rounded text-sm font-semibold transition-all',
              ['÷', '×', '-', '+'].includes(btn) ? 'bg-primary/20 text-primary' :
              btn === '=' ? 'bg-success/20 text-success' :
              btn === 'C' ? 'bg-destructive/20 text-destructive' :
              'bg-muted hover:bg-muted/80'
            )}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
}
