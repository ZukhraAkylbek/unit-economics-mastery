import { useState } from 'react';
import { Target, DollarSign, RefreshCw, Trash2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type TabType = 'standard' | 'unit-logic' | 'ai-audit';

// Currency exchange rates - mid-market approximations
const RATES: Record<string, Record<string, number>> = {
  USD: { USD: 1, EUR: 0.85, RUB: 77.69, KGS: 89.00 },
  EUR: { USD: 1.17, EUR: 1, RUB: 91.21, KGS: 104.50 },
  RUB: { USD: 0.0129, EUR: 0.0110, RUB: 1, KGS: 1.11 },
  KGS: { USD: 0.0112, EUR: 0.0096, RUB: 0.90, KGS: 1 }
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  RUB: '₽',
  KGS: 'сом'
};

export function ToolkitPage() {
  const [activeTab, setActiveTab] = useState<TabType>('unit-logic');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="heading-display text-foreground">
          ТУЛКИТ <span className="text-primary italic">ПЛАТФОРМЫ</span>
        </h1>
      </div>

      {/* Tabs */}
      <div className="inline-flex p-1 rounded-2xl bg-card border border-border">
        {[
          { id: 'standard', label: 'STANDARD' },
          { id: 'unit-logic', label: 'UNIT LOGIC' },
          { id: 'ai-audit', label: 'AI AUDIT' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={cn(
              'px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200',
              activeTab === tab.id
                ? 'bg-hero text-hero-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {activeTab === 'standard' && <StandardCalculator />}
          {activeTab === 'unit-logic' && <UnitLogicCalculator />}
          {activeTab === 'ai-audit' && <AIAuditPanel />}
        </div>

        <div className="space-y-6">
          <HistoryPanel />
          <CheatsheetPanel />
        </div>
      </div>
    </div>
  );
}

function StandardCalculator() {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);

  const handleNumber = (num: string) => {
    setDisplay((prev) => (prev === '0' ? num : prev + num));
  };

  const handleOperation = (op: string) => {
    setPrevValue(parseFloat(display));
    setOperation(op);
    setDisplay('0');
  };

  const handleEquals = () => {
    if (prevValue === null || !operation) return;
    const current = parseFloat(display);
    let result = 0;
    switch (operation) {
      case '+': result = prevValue + current; break;
      case '-': result = prevValue - current; break;
      case '×': result = prevValue * current; break;
      case '÷': result = current !== 0 ? prevValue / current : 0; break;
    }
    setDisplay(result.toString());
    setPrevValue(null);
    setOperation(null);
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
  };

  return (
    <div className="card-elevated p-6">
      <h2 className="font-display text-xl font-bold mb-6">КАЛЬКУЛЯТОР</h2>
      
      <div className="bg-muted rounded-xl p-4 mb-4">
        <div className="text-right text-3xl font-mono font-bold text-foreground">
          {parseFloat(display).toLocaleString('ru-RU')}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '-', '0', '.', '=', '+'].map((btn) => (
          <button
            key={btn}
            onClick={() => {
              if (btn === '=') handleEquals();
              else if (['+', '-', '×', '÷'].includes(btn)) handleOperation(btn);
              else handleNumber(btn);
            }}
            className={cn(
              'h-14 rounded-xl font-semibold text-lg transition-all',
              ['+', '-', '×', '÷'].includes(btn)
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : btn === '='
                ? 'bg-success text-success-foreground hover:bg-success/90'
                : 'bg-muted hover:bg-muted/80 text-foreground'
            )}
          >
            {btn}
          </button>
        ))}
        <button
          onClick={handleClear}
          className="col-span-4 h-12 rounded-xl bg-destructive/10 text-destructive font-semibold hover:bg-destructive/20 transition-all"
        >
          CLEAR
        </button>
      </div>
    </div>
  );
}

function UnitLogicCalculator() {
  const [cac, setCac] = useState(20);
  const [arpu, setArpu] = useState(15);
  const [churn, setChurn] = useState(10);
  const [baseCurrency, setBaseCurrency] = useState<'USD' | 'EUR' | 'RUB' | 'KGS'>('USD');

  const ltv = churn > 0 ? arpu / (churn / 100) : 0;
  const ratio = cac > 0 ? ltv / cac : 0;
  const payback = arpu > 0 ? cac / arpu : 0;

  const getHealthStatus = () => {
    if (ratio >= 3) return { label: 'HEALTHY', color: 'text-success', bg: 'bg-success/10' };
    if (ratio >= 1) return { label: 'RISK', color: 'text-warning', bg: 'bg-warning/10' };
    return { label: 'CRITICAL', color: 'text-destructive', bg: 'bg-destructive/10' };
  };

  const health = getHealthStatus();
  
  // Convert value to all currencies
  const convertValue = (value: number) => {
    return Object.entries(RATES[baseCurrency]).map(([curr, rate]) => ({
      currency: curr,
      symbol: CURRENCY_SYMBOLS[curr],
      value: (value * rate).toFixed(curr === 'RUB' || curr === 'KGS' ? 0 : 2)
    }));
  };

  const symbol = CURRENCY_SYMBOLS[baseCurrency];

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold">UNIT CONSTRUCTOR</h2>
        <div className="flex gap-1">
          {(['USD', 'EUR', 'RUB', 'KGS'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setBaseCurrency(c)}
              className={cn(
                'px-2 h-8 rounded-lg text-xs font-semibold transition-all',
                baseCurrency === c ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {CURRENCY_SYMBOLS[c]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {/* CAC Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              СТОИМОСТЬ CAC
            </div>
            <span className="text-xl font-bold">{symbol}{cac}</span>
          </div>
          <Slider
            value={[cac]}
            onValueChange={([v]) => setCac(v)}
            max={500}
            step={5}
            className="w-full"
          />
          {/* Currency conversion for CAC */}
          <div className="flex gap-2 mt-2">
            {convertValue(cac).filter(c => c.currency !== baseCurrency).map(({ currency, symbol: sym, value }) => (
              <span key={currency} className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                {sym}{value}
              </span>
            ))}
          </div>
        </div>

        {/* ARPU Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              СРЕДНИЙ ARPU
            </div>
            <span className="text-xl font-bold">{symbol}{arpu}</span>
          </div>
          <Slider
            value={[arpu]}
            onValueChange={([v]) => setArpu(v)}
            max={200}
            step={1}
            className="w-full"
          />
          {/* Currency conversion for ARPU */}
          <div className="flex gap-2 mt-2">
            {convertValue(arpu).filter(c => c.currency !== baseCurrency).map(({ currency, symbol: sym, value }) => (
              <span key={currency} className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                {sym}{value}
              </span>
            ))}
          </div>
        </div>

        {/* Churn Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4" />
              ОТТОК (CHURN %)
            </div>
            <span className="text-xl font-bold">{churn}%</span>
          </div>
          <Slider
            value={[churn]}
            onValueChange={([v]) => setChurn(v)}
            max={50}
            step={1}
            className="w-full"
          />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
          <div className="p-4 rounded-xl bg-muted">
            <div className="text-xs text-muted-foreground">LTV</div>
            <div className="text-2xl font-bold text-foreground">{symbol}{ltv.toFixed(0)}</div>
            <div className="flex gap-1 mt-1 flex-wrap">
              {convertValue(ltv).filter(c => c.currency !== baseCurrency).map(({ currency, symbol: sym, value }) => (
                <span key={currency} className="text-[10px] text-muted-foreground">
                  {sym}{value}
                </span>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-muted">
            <div className="text-xs text-muted-foreground">PAYBACK</div>
            <div className="text-2xl font-bold text-foreground">{payback.toFixed(1)} мес</div>
          </div>
        </div>

        {/* Health Indicator */}
        <div className={cn('p-4 rounded-xl flex items-center justify-between', health.bg)}>
          <span className="text-sm font-semibold">LTV/CAC RATIO</span>
          <div className="flex items-center gap-3">
            <span className={cn('text-2xl font-bold', health.color)}>{ratio.toFixed(2)}</span>
            <span className={cn('text-xs font-semibold px-2 py-1 rounded-full', health.bg, health.color)}>
              {health.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AIAuditPanel() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('ai-mentor', {
        body: { 
          projectData: { 
            description: input,
            projectName: 'Анализируемый проект'
          },
          action: 'analyze'
        }
      });

      if (error) throw error;
      
      setResult(data.feedback?.replace(/\*+/g, '') || 'Анализ недоступен');
    } catch (error: any) {
      console.error('AI audit error:', error);
      toast({
        title: 'Ошибка анализа',
        description: error.message || 'Не удалось проанализировать',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card-elevated p-6">
      <h2 className="font-display text-xl font-bold mb-2 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        AI AUDIT
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Опиши свой проект, и AI разберет его юнит-экономику
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Например: SaaS для управления проектами, подписка $29/мес, команда 3 человека, 500 пользователей, тратим $3000/мес на маркетинг..."
        className="w-full h-40 p-4 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground/50 resize-none"
      />

      <Button
        variant="hero"
        size="lg"
        className="w-full mt-4"
        onClick={handleSubmit}
        disabled={isLoading || !input.trim()}
      >
        {isLoading ? (
          <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
        ) : (
          'ЗАПУСТИТЬ АНАЛИЗ'
        )}
      </Button>

      {result && (
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
          <p className="text-xs font-semibold text-primary mb-2 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            AI Анализ
          </p>
          <p className="text-sm text-foreground whitespace-pre-line">{result}</p>
        </div>
      )}
    </div>
  );
}

function HistoryPanel() {
  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <RefreshCw className="h-4 w-4" />
          HISTORY
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center justify-center h-20 text-sm text-muted-foreground">
        LOG EMPTY
      </div>
    </div>
  );
}

function CheatsheetPanel() {
  const formulas = [
    { name: 'CAC PAYBACK', formula: 'CAC / Margin per Month' },
    { name: 'UNIT MARGIN', formula: 'Price - COGS' },
    { name: 'LTV', formula: 'ARPU / Churn' },
    { name: 'RATIO', formula: 'LTV / CAC' },
  ];

  return (
    <div className="card-elevated p-6">
      <div className="text-xs tracking-wider text-muted-foreground mb-4">PM CHEATSHEET</div>
      <div className="space-y-3">
        {formulas.map((f) => (
          <div key={f.name}>
            <div className="text-sm font-semibold text-primary">{f.name}</div>
            <div className="text-sm text-muted-foreground">{f.formula}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
