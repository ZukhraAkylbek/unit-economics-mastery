import { useState } from 'react';
import { Rocket, ExternalLink, TrendingUp, DollarSign, Users, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface StartupAnalysis {
  name: string;
  category: string;
  estimatedCAC: number;
  estimatedARPU: number;
  estimatedChurn: number;
  ltv: number;
  ratio: number;
  verdict: string;
}

export function AuditPage() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<StartupAnalysis | null>(null);

  const handleAnalyze = () => {
    if (!url) return;
    setIsLoading(true);

    // Simulate AI analysis
    setTimeout(() => {
      setAnalysis({
        name: 'Demo Startup',
        category: 'SaaS / Productivity',
        estimatedCAC: 150,
        estimatedARPU: 49,
        estimatedChurn: 5,
        ltv: 980,
        ratio: 6.53,
        verdict: 'Strong unit economics. LTV/CAC ratio of 6.5x indicates efficient customer acquisition. Consider increasing marketing spend to accelerate growth.',
      });
      setIsLoading(false);
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-semibold text-primary mb-4">
          <Rocket className="h-3 w-3" />
          PRODUCT HUNT AUDIT
        </div>
        <h1 className="heading-display text-foreground">
          AI <span className="text-primary italic">АУДИТ</span>
        </h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Вставь ссылку на Product Hunt или любой стартап — AI рассчитает гипотетическую юнит-экономику на основе публичных данных.
        </p>
      </div>

      {/* Input */}
      <div className="card-elevated p-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="https://producthunt.com/posts/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-14 pl-12 rounded-xl"
            />
          </div>
          <Button
            variant="hero"
            size="lg"
            onClick={handleAnalyze}
            disabled={isLoading || !url}
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              'АНАЛИЗИРОВАТЬ'
            )}
          </Button>
        </div>
      </div>

      {/* Results */}
      {analysis && (
        <div className="space-y-6 animate-slide-up">
          <div className="card-elevated p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">{analysis.name}</h2>
                <p className="text-muted-foreground">{analysis.category}</p>
              </div>
              <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                analysis.ratio >= 3 ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
              }`}>
                {analysis.ratio >= 3 ? 'HEALTHY' : 'RISK'}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <MetricCard
                icon={DollarSign}
                label="EST. CAC"
                value={`$${analysis.estimatedCAC}`}
              />
              <MetricCard
                icon={TrendingUp}
                label="EST. ARPU"
                value={`$${analysis.estimatedARPU}/mo`}
              />
              <MetricCard
                icon={RefreshCw}
                label="EST. CHURN"
                value={`${analysis.estimatedChurn}%`}
              />
              <MetricCard
                icon={Users}
                label="EST. LTV"
                value={`$${analysis.ltv}`}
              />
            </div>

            <div className="p-4 rounded-xl bg-muted">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">LTV/CAC RATIO</span>
                <span className="text-2xl font-bold text-primary">{analysis.ratio.toFixed(2)}x</span>
              </div>
              <div className="h-2 rounded-full bg-background overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(analysis.ratio / 5 * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="card-elevated p-6">
            <h3 className="font-display text-lg font-bold mb-3">AI ВЕРДИКТ</h3>
            <p className="text-muted-foreground">{analysis.verdict}</p>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            ⚠️ Расчеты приблизительные и основаны на типичных показателях индустрии
          </p>
        </div>
      )}

      {/* Empty State */}
      {!analysis && !isLoading && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-muted mb-4">
            <Rocket className="h-10 w-10 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            Вставь ссылку на стартап для анализа
          </p>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-muted">
      <Icon className="h-5 w-5 text-primary mb-2" />
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-bold text-foreground">{value}</div>
    </div>
  );
}
