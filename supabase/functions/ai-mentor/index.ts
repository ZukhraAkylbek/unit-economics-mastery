import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Ты AI-ментор по юнит-экономике для стартапов. Анализируй данные проекта и давай конкретные рекомендации.

Твоя задача:
1. Рассчитать ключевые метрики (Unit Margin, CAC, LTV, LTV/CAC Ratio, Payback Period)
2. Найти слабые места в экономике
3. Дать 3-5 конкретных рекомендаций по улучшению
4. Указать на несоответствия в данных

Отвечай на русском языке. Будь конкретным и практичным. Используй числа из данных.`;

    const userMessage = `Проанализируй мой проект:

Название: ${projectData.projectName || 'Не указано'}
Описание: ${projectData.description || 'Не указано'}
Цена продукта: ${projectData.price || 'Не указано'}₽
Себестоимость (COGS): ${projectData.cogs || 'Не указано'}₽
Стоимость привлечения клиента (CAC): ${projectData.cac || 'Не указано'}₽
Маркетинговые расходы: ${projectData.marketingCost || 'Не указано'}₽
Количество клиентов: ${projectData.customers || 'Не указано'}
Churn Rate: ${projectData.churnRate || 'Не указано'}%
ARPU: ${projectData.arpu || 'Не указано'}₽

Дай полный анализ с расчетами и рекомендациями.`;

    console.log('Calling Lovable AI for mentor analysis...');

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Слишком много запросов. Попробуйте позже." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Превышен лимит использования AI." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const feedback = data.choices?.[0]?.message?.content || "Не удалось получить анализ";

    console.log('AI mentor analysis complete');

    return new Response(JSON.stringify({ feedback }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("ai-mentor error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Ошибка анализа" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
