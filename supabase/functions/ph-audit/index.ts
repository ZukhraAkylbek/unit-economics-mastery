import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Product Hunt top products data (refreshed manually or via scraping)
const TOP_PRODUCTS = [
  {
    name: "Notion",
    tagline: "All-in-one workspace for notes, docs, and collaboration",
    category: "Productivity / SaaS",
    upvotes: 12500,
    website: "https://notion.so"
  },
  {
    name: "Figma",
    tagline: "Collaborative design tool for teams",
    category: "Design / SaaS",
    upvotes: 15200,
    website: "https://figma.com"
  },
  {
    name: "Linear",
    tagline: "Issue tracking for modern software teams",
    category: "Developer Tools / SaaS",
    upvotes: 8900,
    website: "https://linear.app"
  },
  {
    name: "Loom",
    tagline: "Video messaging for async work",
    category: "Video / SaaS",
    upvotes: 11300,
    website: "https://loom.com"
  },
  {
    name: "Superhuman",
    tagline: "The fastest email experience ever made",
    category: "Email / SaaS",
    upvotes: 9800,
    website: "https://superhuman.com"
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, url } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (action === 'get-top-products') {
      // Return top products with AI-generated insights
      const productsWithInsights = [];
      
      for (const product of TOP_PRODUCTS.slice(0, 3)) {
        const systemPrompt = `Ты эксперт по юнит-экономике стартапов. Анализируй продукты и объясняй их бизнес-модель.`;
        
        const userMessage = `Проанализируй стартап "${product.name}" (${product.tagline}).
Категория: ${product.category}

Объясни кратко (3-4 предложения):
1. Какие ключевые метрики важны для этого типа продукта
2. Как они скорее всего считают CAC и LTV
3. Что важно для инвесторов в таких продуктах`;

        console.log(`Analyzing ${product.name}...`);

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
          console.error(`Error analyzing ${product.name}`);
          productsWithInsights.push({
            ...product,
            analysis: "Анализ недоступен"
          });
          continue;
        }

        const data = await response.json();
        const analysis = data.choices?.[0]?.message?.content || "Анализ недоступен";

        productsWithInsights.push({
          ...product,
          analysis
        });
      }

      return new Response(JSON.stringify({ products: productsWithInsights }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === 'analyze-url') {
      // Analyze specific URL
      const systemPrompt = `Ты эксперт по юнит-экономике стартапов. Проводишь глубокий аудит на основе публичной информации.`;

      const userMessage = `Проанализируй стартап по ссылке: ${url}

Дай оценку по следующим параметрам (используй типичные значения для индустрии):
1. Предполагаемый CAC (стоимость привлечения)
2. Предполагаемый ARPU (средний чек)
3. Предполагаемый Churn Rate
4. Рассчитай LTV и LTV/CAC Ratio
5. Дай вердикт по экономике (здоровая/рисковая)
6. 3 ключевые рекомендации

Формат ответа - JSON:
{
  "name": "название продукта",
  "category": "категория",
  "estimatedCAC": число,
  "estimatedARPU": число,
  "estimatedChurn": число (в процентах),
  "ltv": число,
  "ratio": число,
  "verdict": "текст вердикта",
  "recommendations": ["рекомендация 1", "рекомендация 2", "рекомендация 3"]
}`;

      console.log('Analyzing URL:', url);

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
        const text = await response.text();
        console.error("AI gateway error:", response.status, text);
        throw new Error(`AI gateway error: ${response.status}`);
      }

      const data = await response.json();
      let content = data.choices?.[0]?.message?.content || "";
      
      // Try to parse JSON from response
      try {
        // Extract JSON from markdown code blocks if present
        const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                         content.match(/```\s*([\s\S]*?)\s*```/) ||
                         [null, content];
        const jsonStr = jsonMatch[1] || content;
        const analysis = JSON.parse(jsonStr);
        
        return new Response(JSON.stringify({ analysis }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch {
        // If JSON parsing fails, return structured fallback
        return new Response(JSON.stringify({ 
          analysis: {
            name: "Анализируемый продукт",
            category: "SaaS",
            estimatedCAC: 100,
            estimatedARPU: 50,
            estimatedChurn: 5,
            ltv: 1000,
            ratio: 10,
            verdict: content,
            recommendations: []
          }
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("ph-audit error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Ошибка аудита" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
