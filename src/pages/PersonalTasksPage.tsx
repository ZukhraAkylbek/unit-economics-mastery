import { useState, useEffect } from 'react';
import { Briefcase, Sparkles, Save, Trash2, Plus, ChevronRight, Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProjectData {
  name: string;
  description: string;
  price: string;
  cogs: string;
  cac: string;
  marketingBudget: string;
  customersPerMonth: string;
  churnRate: string;
  arpu: string;
}

interface SavedExample {
  id: string;
  projectName: string;
  metric: string;
  value: string;
  explanation: string;
  createdAt: Date;
}

const METRIC_TEMPLATES = [
  { id: 'unit-margin', name: 'Unit Margin', formula: 'Price - COGS' },
  { id: 'cac', name: 'CAC', formula: 'Marketing / Customers' },
  { id: 'ltv', name: 'LTV', formula: 'ARPU / Churn' },
  { id: 'ratio', name: 'LTV/CAC', formula: 'LTV ÷ CAC' },
  { id: 'payback', name: 'Payback Period', formula: 'CAC / ARPU' },
];

export function PersonalTasksPage() {
  const [project, setProject] = useState<ProjectData>(() => {
    const saved = localStorage.getItem('mvp-studio-project');
    return saved ? JSON.parse(saved) : {
      name: '',
      description: '',
      price: '',
      cogs: '',
      cac: '',
      marketingBudget: '',
      customersPerMonth: '',
      churnRate: '',
      arpu: ''
    };
  });

  const [savedExamples, setSavedExamples] = useState<SavedExample[]>(() => {
    const saved = localStorage.getItem('mvp-studio-examples');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('mvp-studio-project', JSON.stringify(project));
  }, [project]);

  useEffect(() => {
    localStorage.setItem('mvp-studio-examples', JSON.stringify(savedExamples));
  }, [savedExamples]);

  const calculateMetric = (metricId: string): { value: string; explanation: string } | null => {
    const price = parseFloat(project.price) || 0;
    const cogs = parseFloat(project.cogs) || 0;
    const marketing = parseFloat(project.marketingBudget) || 0;
    const customers = parseFloat(project.customersPerMonth) || 1;
    const churn = parseFloat(project.churnRate) || 5;
    const arpu = parseFloat(project.arpu) || price;

    switch (metricId) {
      case 'unit-margin':
        return {
          value: `${(price - cogs).toLocaleString()}₽`,
          explanation: `Маржа с одного юнита ${project.name}: ${price}₽ - ${cogs}₽ = ${price - cogs}₽`
        };
      case 'cac':
        const cac = marketing / customers;
        return {
          value: `${Math.round(cac).toLocaleString()}₽`,
          explanation: `Стоимость привлечения клиента: ${marketing.toLocaleString()}₽ / ${customers} = ${Math.round(cac).toLocaleString()}₽`
        };
      case 'ltv':
        const ltv = arpu / (churn / 100);
        return {
          value: `${Math.round(ltv).toLocaleString()}₽`,
          explanation: `LTV при ARPU ${arpu}₽ и Churn ${churn}%: ${arpu}₽ / ${churn/100} = ${Math.round(ltv).toLocaleString()}₽`
        };
      case 'ratio':
        const cacVal = marketing / customers;
        const ltvVal = arpu / (churn / 100);
        const ratio = ltvVal / cacVal;
        return {
          value: `${ratio.toFixed(2)}x`,
          explanation: `LTV/CAC = ${Math.round(ltvVal).toLocaleString()}₽ / ${Math.round(cacVal).toLocaleString()}₽ = ${ratio.toFixed(2)}. ${ratio >= 3 ? '✅ Здоровая экономика!' : '⚠️ Нужно оптимизировать'}`
        };
      case 'payback':
        const cacP = marketing / customers;
        const payback = cacP / arpu;
        return {
          value: `${payback.toFixed(1)} мес`,
          explanation: `Payback = ${Math.round(cacP).toLocaleString()}₽ / ${arpu}₽ = ${payback.toFixed(1)} месяцев`
        };
      default:
        return null;
    }
  };

  const handleSaveExample = (metricId: string) => {
    const result = calculateMetric(metricId);
    if (!result) return;

    const template = METRIC_TEMPLATES.find(t => t.id === metricId);
    
    setSavedExamples(prev => [...prev, {
      id: `${Date.now()}`,
      projectName: project.name,
      metric: template?.name || metricId,
      value: result.value,
      explanation: result.explanation,
      createdAt: new Date()
    }]);
    
    toast({ title: 'Пример сохранён' });
  };

  const handleDeleteExample = (id: string) => {
    setSavedExamples(prev => prev.filter(e => e.id !== id));
  };

  const handleGetAIFeedback = async () => {
    if (!project.name) {
      toast({ title: 'Заполните данные проекта', variant: 'destructive' });
      return;
    }

    setIsLoadingAI(true);
    setAiFeedback(null);

    try {
      const { data, error } = await supabase.functions.invoke('ai-mentor', {
        body: {
          projectData: {
            projectName: project.name,
            description: project.description,
            price: project.price,
            cogs: project.cogs,
            cac: project.cac,
            marketingCost: project.marketingBudget,
            customers: project.customersPerMonth,
            churnRate: project.churnRate,
            arpu: project.arpu
          }
        }
      });

      if (error) throw error;

      setAiFeedback(data.feedback);
    } catch (error: any) {
      console.error('AI feedback error:', error);
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось получить анализ',
        variant: 'destructive'
      });
    } finally {
      setIsLoadingAI(false);
    }
  };

  const hasProjectData = project.name && project.price;

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="opacity-0 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-semibold text-primary mb-4">
          <Briefcase className="h-3 w-3" />
          МОЙ ПРОЕКТ
        </div>
        <h1 className="heading-lg text-foreground">Персональные задания</h1>
        <p className="text-muted-foreground">Введи данные проекта — получай персональные примеры и AI-рекомендации</p>
      </div>

      {/* Project Form */}
      <div className="card-elevated p-6 opacity-0 animate-fade-in stagger-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-foreground">Данные проекта</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Готово' : 'Редактировать'}
          </Button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Название проекта</label>
              <Input
                placeholder="Мой SaaS"
                value={project.name}
                onChange={(e) => setProject(p => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Описание</label>
              <Textarea
                placeholder="Что делает продукт..."
                value={project.description}
                onChange={(e) => setProject(p => ({ ...p, description: e.target.value }))}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Цена продукта, ₽</label>
                <Input
                  type="number"
                  placeholder="2000"
                  value={project.price}
                  onChange={(e) => setProject(p => ({ ...p, price: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Себестоимость (COGS), ₽</label>
                <Input
                  type="number"
                  placeholder="400"
                  value={project.cogs}
                  onChange={(e) => setProject(p => ({ ...p, cogs: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">CAC (стоимость привлечения), ₽</label>
                <Input
                  type="number"
                  placeholder="1500"
                  value={project.cac}
                  onChange={(e) => setProject(p => ({ ...p, cac: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">ARPU (средний чек), ₽</label>
                <Input
                  type="number"
                  placeholder="2000"
                  value={project.arpu}
                  onChange={(e) => setProject(p => ({ ...p, arpu: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Маркетинг бюджет/мес, ₽</label>
                <Input
                  type="number"
                  placeholder="100000"
                  value={project.marketingBudget}
                  onChange={(e) => setProject(p => ({ ...p, marketingBudget: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Новых клиентов/мес</label>
                <Input
                  type="number"
                  placeholder="50"
                  value={project.customersPerMonth}
                  onChange={(e) => setProject(p => ({ ...p, customersPerMonth: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Churn Rate, %</label>
              <Input
                type="number"
                placeholder="5"
                value={project.churnRate}
                onChange={(e) => setProject(p => ({ ...p, churnRate: e.target.value }))}
              />
            </div>
          </div>
        ) : hasProjectData ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{project.name}</p>
                <p className="text-sm text-muted-foreground">{project.description || 'Нет описания'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border">
              <div className="text-center">
                <p className="text-lg font-bold text-primary">{parseInt(project.price || '0').toLocaleString()}₽</p>
                <p className="text-xs text-muted-foreground">Цена</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{parseInt(project.cogs || '0').toLocaleString()}₽</p>
                <p className="text-xs text-muted-foreground">COGS</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{parseInt(project.marketingBudget || '0').toLocaleString()}₽</p>
                <p className="text-xs text-muted-foreground">Маркетинг</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{project.churnRate || '0'}%</p>
                <p className="text-xs text-muted-foreground">Churn</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">Добавь данные о своём проекте</p>
            <Button onClick={() => setIsEditing(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить проект
            </Button>
          </div>
        )}
      </div>

      {/* AI Mentor */}
      {hasProjectData && (
        <div className="card-elevated p-6 opacity-0 animate-fade-in stagger-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-foreground flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              AI Ментор
            </h3>
            <Button onClick={handleGetAIFeedback} disabled={isLoadingAI}>
              {isLoadingAI ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Анализирую...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Получить рекомендации
                </>
              )}
            </Button>
          </div>

          {aiFeedback ? (
            <div className="p-4 rounded-xl bg-muted/50 border border-border">
              <div className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                {aiFeedback.replace(/\*\*/g, '').replace(/\*/g, '')}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              AI-ментор проанализирует данные вашего проекта и даст рекомендации по улучшению юнит-экономики
            </p>
          )}
        </div>
      )}

      {/* Calculate Metrics */}
      {hasProjectData && (
        <div className="space-y-4 opacity-0 animate-fade-in stagger-3">
          <h3 className="font-display font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Расчёты для {project.name}
          </h3>
          
          <div className="grid gap-3">
            {METRIC_TEMPLATES.map((template) => {
              const result = calculateMetric(template.id);
              const isSelected = selectedMetric === template.id;

              return (
                <div 
                  key={template.id}
                  className={cn(
                    'card-glass p-4 cursor-pointer transition-all',
                    isSelected && 'ring-2 ring-primary'
                  )}
                  onClick={() => setSelectedMetric(isSelected ? null : template.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="font-mono text-sm font-bold text-primary">{template.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{template.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{template.formula}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <p className="text-lg font-bold text-primary">{result?.value}</p>
                      <ChevronRight className={cn(
                        'h-5 w-5 text-muted-foreground transition-transform',
                        isSelected && 'rotate-90'
                      )} />
                    </div>
                  </div>

                  {isSelected && result && (
                    <div className="mt-4 pt-4 border-t border-border animate-fade-in">
                      <p className="text-sm text-muted-foreground mb-3">{result.explanation}</p>
                      <Button size="sm" onClick={(e) => {
                        e.stopPropagation();
                        handleSaveExample(template.id);
                      }}>
                        <Save className="h-4 w-4 mr-2" />
                        Сохранить пример
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Saved Examples */}
      {savedExamples.length > 0 && (
        <div className="space-y-4 opacity-0 animate-fade-in stagger-4">
          <h3 className="font-display font-bold text-foreground">Сохранённые примеры</h3>
          
          <div className="space-y-3">
            {savedExamples.map((example) => (
              <div key={example.id} className="card-glass p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                        {example.metric}
                      </span>
                      <span className="text-xs text-muted-foreground">{example.projectName}</span>
                    </div>
                    <p className="text-lg font-bold text-foreground">{example.value}</p>
                    <p className="text-sm text-muted-foreground">{example.explanation}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteExample(example.id)}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
