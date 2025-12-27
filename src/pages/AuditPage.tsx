import { useState, useEffect } from 'react';
import { Rocket, ExternalLink, TrendingUp, DollarSign, Users, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StartupAnalysis {
  name: string;
  category: string;
  estimatedCAC: number;
  estimatedARPU: number;
  estimatedChurn: number;
  ltv: number;
  ratio: number;
  verdict: string;
  recommendations?: string[];
}

interface TopProduct {
  name: string;
  tagline: string;
  category: string;
  upvotes: number;
  website: string;
  analysis: string;
}

export function AuditPage() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTop, setIsLoadingTop] = useState(true);
  const [analysis, setAnalysis] = useState<StartupAnalysis | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadTopProducts();
  }, []);

  const loadTopProducts = async () => {
    setIsLoadingTop(true);
    try {
      const { data, error } = await supabase.functions.invoke('ph-audit', {
        body: { action: 'get-top-products' }
      });

      if (error) throw error;
      setTopProducts(data.products || []);
    } catch (error) {
      console.error('Error loading top products:', error);
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить топ продукты',
        variant: 'destructive'
      });
    } finally {
      setIsLoadingTop(false);
    }
  };

  const handleAnalyze = async () => {
    if (!url) return;
    setIsLoading(true);
    setAnalysis(null);

    try {
      const { data, error } = await supabase.functions.invoke('ph-audit', {
        body: { action: 'analyze-url', url }
      });

      if (error) throw error;
      
      if (data.analysis) {
        setAnalysis(data.analysis);
      } else {
        throw new Error('No analysis data');
      }
    } catch (error: any) {
      console.error('Analysis error:', error);
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
          Анализируй юнит-экономику стартапов с Product Hunt. AI рассчитает метрики и даст рекомендации.
        </p>
      </div>

      {/* Top Products */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Топ-3 продукта с разбором
        </h2>
        
        {isLoadingTop ? (
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="card-elevated p-6 animate-pulse">
                <div className="h-6 bg-muted rounded w-1/3 mb-2" />
                <div className="h-4 bg-muted rounded w-2/3 mb-4" />
                <div className="h-20 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {topProducts.map((product, idx) => (
              <div key={idx} className="card-elevated p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">#{idx + 1}</span>
                      <h3 className="font-display text-xl font-bold text-foreground">{product.name}</h3>
                    </div>
                    <p className="text-muted-foreground">{product.tagline}</p>
                    <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {product.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">▲ {product.upvotes.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">upvotes</p>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <p className="text-sm font-medium text-foreground mb-2">🧠 AI Анализ:</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{product.analysis}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Analysis */}
      <div className="card-elevated p-6">
        <h2 className="font-display text-lg font-bold mb-4">Проанализировать свой стартап</h2>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="https://producthunt.com/posts/... или любая ссылка"
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
            <p className="text-muted-foreground whitespace-pre-line">{analysis.verdict}</p>
            
            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="font-semibold mb-2">Рекомендации:</p>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <p className="text-xs text-center text-muted-foreground">
            ⚠️ Расчеты приблизительные и основаны на типичных показателях индустрии
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
