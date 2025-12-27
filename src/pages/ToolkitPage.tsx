import { useState } from 'react';
import { Target, DollarSign, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

type TabType = 'standard' | 'unit-logic' | 'ai-audit';

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
  const [currency, setCurrency] = useState<'$' | '€' | '₽' | '¢'>('$');

  const ltv = churn > 0 ? arpu / (churn / 100) : 0;
  const ratio = cac > 0 ? ltv / cac : 0;
  const payback = arpu > 0 ? cac / arpu : 0;

  const getHealthStatus = () => {
    if (ratio >= 3) return { label: 'HEALTHY', color: 'text-success', bg: 'bg-success/10' };
    if (ratio >= 1) return { label: 'RISK', color: 'text-warning', bg: 'bg-warning/10' };
    return { label: 'CRITICAL', color: 'text-destructive', bg: 'bg-destructive/10' };
  };

  const health = getHealthStatus();

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold">UNIT CONSTRUCTOR</h2>
        <div className="flex gap-1">
          {(['$', '€', '₽', '¢'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={cn(
                'w-8 h-8 rounded-lg text-sm font-semibold transition-all',
                currency === c ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              )}
            >
              {c}
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
            <span className="text-xl font-bold">{currency}{cac}</span>
          </div>
          <Slider
            value={[cac]}
            onValueChange={([v]) => setCac(v)}
            max={500}
            step={5}
            className="w-full"
          />
        </div>

        {/* ARPU Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              СРЕДНИЙ ARPU
            </div>
            <span className="text-xl font-bold">{currency}{arpu}</span>
          </div>
          <Slider
            value={[arpu]}
            onValueChange={([v]) => setArpu(v)}
            max={200}
            step={1}
            className="w-full"
          />
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
            <div className="text-2xl font-bold text-foreground">{currency}{ltv.toFixed(0)}</div>
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

  const handleSubmit = () => {
    if (!input.trim()) return;
    setIsLoading(true);
    // Simulate AI response
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="card-elevated p-6">
      <h2 className="font-display text-xl font-bold mb-2">AI AUDIT</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Опиши свой проект, и AI разберет его юнит-экономику
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Например: SaaS для управления проектами, подписка $29/мес, команда 3 человека..."
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

      <p className="text-xs text-muted-foreground text-center mt-4">
        Требуется подключение Lovable Cloud для AI функций
      </p>
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
