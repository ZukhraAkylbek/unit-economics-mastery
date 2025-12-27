export interface Flashcard {
  front: string;
  back: string;
  formula?: string;
}

export const MODULE_FLASHCARDS: Record<string, Flashcard[]> = {
  'unit-margin': [
    { front: 'Unit Margin', back: 'Прибыль с одной продажи после вычета прямых расходов', formula: 'Price - COGS' },
    { front: 'COGS', back: 'Cost of Goods Sold — себестоимость проданных товаров или услуг' },
    { front: 'Юнит', back: 'Базовая единица бизнеса: подписчик, заказ, чашка кофе' },
    { front: 'Gross Margin %', back: 'Процент маржи от цены продажи', formula: '(Price - COGS) / Price × 100%' }
  ],
  'cac': [
    { front: 'CAC', back: 'Customer Acquisition Cost — стоимость привлечения одного платящего клиента', formula: 'Marketing Spend / New Customers' },
    { front: 'CPA', back: 'Cost Per Acquisition — стоимость действия (регистрации, покупки)' },
    { front: 'Marketing Spend', back: 'Все затраты на маркетинг: реклама, зарплаты, инструменты, комиссии' },
    { front: 'Blended CAC', back: 'CAC по всем каналам вместе, включая органику' }
  ],
  'ltv': [
    { front: 'LTV', back: 'Lifetime Value — пожизненная ценность клиента за всё время работы', formula: 'ARPU × Avg. Lifetime' },
    { front: 'Avg. Lifetime', back: 'Средний срок жизни клиента в месяцах', formula: '1 / Churn Rate' },
    { front: 'LTV (альт.)', back: 'Альтернативная формула через Churn', formula: 'ARPU / Churn Rate' },
    { front: 'Gross LTV', back: 'LTV с учётом маржи', formula: 'LTV × Gross Margin' }
  ],
  'ltv-cac-ratio': [
    { front: 'LTV/CAC Ratio', back: 'Главная метрика здоровья юнит-экономики. Показывает окупаемость клиента', formula: 'LTV ÷ CAC' },
    { front: 'Здоровый Ratio', back: '≥ 3 — здоровая экономика. 3-5 — оптимально. < 3 — риск' },
    { front: 'Ratio > 5', back: 'Возможно недоинвестируете в рост. Можно увеличить CAC' },
    { front: 'Ratio < 1', back: 'Убыточная экономика — каждый клиент приносит минус' }
  ],
  'churn': [
    { front: 'Churn Rate', back: 'Процент клиентов, которые уходят за период', formula: 'Lost Customers / Total × 100%' },
    { front: 'Retention Rate', back: 'Процент оставшихся клиентов — обратная сторона Churn', formula: '100% - Churn Rate' },
    { front: 'Revenue Churn', back: 'Отток в деньгах, не в клиентах', formula: 'Lost MRR / Total MRR × 100%' },
    { front: 'Net Negative Churn', back: 'Когда Expansion превышает Churn — выручка растёт без новых клиентов' }
  ],
  'payback-period': [
    { front: 'Payback Period', back: 'Время окупаемости затрат на привлечение клиента', formula: 'CAC / (ARPU × Margin)' },
    { front: '< 6 месяцев', back: 'Отличный Payback — можно быстро реинвестировать в рост' },
    { front: '6-12 месяцев', back: 'Хороший Payback для B2B SaaS' },
    { front: '> 18 месяцев', back: 'Опасный Payback — нужен большой капитал для роста' }
  ],
  'arpu': [
    { front: 'ARPU', back: 'Average Revenue Per User — средний доход с пользователя за период', formula: 'Total Revenue / Active Users' },
    { front: 'ARPPU', back: 'Average Revenue Per Paying User — только по платящим', formula: 'Revenue / Paying Users' },
    { front: 'ARPA', back: 'Average Revenue Per Account — для B2B по аккаунтам' },
    { front: 'Способы роста ARPU', back: 'Повышение цен, апселлы, кросс-селлы, премиум-тарифы' }
  ],
  'cohorts': [
    { front: 'Когорта', back: 'Группа пользователей, привлечённых в один период времени' },
    { front: 'Когортный Retention', back: '% активных пользователей из когорты через N месяцев', formula: 'Active in Month N / Cohort Size × 100%' },
    { front: 'Retention Curve', back: 'График удержания когорты — показывает, как быстро уходят пользователи' },
    { front: 'Day 1 / Day 7 / Day 30', back: 'Ключевые точки retention: 40%/20%/10% — типичные значения для мобильных приложений' }
  ],
  'k-factor': [
    { front: 'K-Factor', back: 'Коэффициент виральности — сколько новых пользователей приводит один текущий', formula: 'Invites × Conversion Rate' },
    { front: 'K < 1', back: 'Затухающий рост — нужна реклама для поддержания' },
    { front: 'K = 1', back: 'Самоподдерживающийся рост — каждый приводит одного' },
    { front: 'K > 1', back: 'Вирусный рост — экспоненциальное увеличение базы без рекламы' }
  ],
  'mrr-growth': [
    { front: 'MRR', back: 'Monthly Recurring Revenue — ежемесячная повторяющаяся выручка' },
    { front: 'ARR', back: 'Annual Recurring Revenue — годовая выручка', formula: 'MRR × 12' },
    { front: 'New MRR', back: 'Выручка от новых клиентов за месяц' },
    { front: 'Expansion MRR', back: 'Дополнительная выручка от апгрейдов и апселлов' },
    { front: 'Churned MRR', back: 'Потерянная выручка от ушедших клиентов' },
    { front: 'Net New MRR', back: 'Чистый рост выручки', formula: 'New + Expansion - Churned - Contraction' }
  ],
  'burn-rate': [
    { front: 'Burn Rate', back: 'Скорость расходования денег компанией за месяц' },
    { front: 'Gross Burn', back: 'Все расходы компании за месяц' },
    { front: 'Net Burn', back: 'Расходы минус доходы — реальные потери', formula: 'Expenses - Revenue' },
    { front: 'Runway', back: 'Сколько месяцев проживёт компания на текущих деньгах', formula: 'Cash / Net Burn' },
    { front: 'Runway < 6 мес', back: 'Красная зона — срочно нужен фандрейзинг или прибыль' }
  ],
  'freemium': [
    { front: 'Freemium', back: 'Модель с бесплатным продуктом и платными апгрейдами' },
    { front: 'Free-to-Paid Conversion', back: 'Процент бесплатных пользователей, ставших платящими (обычно 2-5%)' },
    { front: 'Blended ARPU', back: 'Средний чек по всем пользователям (включая бесплатных)', formula: '(Free×0 + Paid×ARPPU) / Total' },
    { front: 'Стоимость Free', back: 'Бесплатные пользователи не бесплатны: серверы, поддержка, но дают виральность' }
  ],
  'b2b-sales-cycle': [
    { front: 'Sales Cycle', back: 'Время от первого контакта до закрытия сделки (B2B: 3-12 месяцев)' },
    { front: 'B2B CAC', back: 'Включает зарплаты сейлзов, маркетинг, presale', formula: '(Sales + Marketing) / Closed Deals' },
    { front: 'ACV', back: 'Annual Contract Value — годовая стоимость контракта' },
    { front: 'Enterprise Sales', back: 'Длинные циклы, высокий CAC, но высокий LTV и низкий Churn' },
    { front: 'Land & Expand', back: 'Стратегия: войти с малым контрактом, расти внутри компании' }
  ],
  'unit-economics-canvas': [
    { front: 'Unit Economics Canvas', back: 'Визуализация всей бизнес-модели на одной странице' },
    { front: 'Unit Level', back: 'Первый уровень: Price, COGS, Unit Margin' },
    { front: 'Customer Level', back: 'Второй уровень: CAC, LTV, LTV/CAC Ratio' },
    { front: 'Company Level', back: 'Третий уровень: Revenue, Costs, Profit' },
    { front: 'North Star Metric', back: 'Главная метрика продукта, отражающая ключевую ценность для клиентов' }
  ],
  'final-case': [
    { front: 'Unit Economics', back: 'Экономика одной единицы бизнеса — основа принятия решений' },
    { front: 'Главное правило', back: 'LTV > CAC — иначе бизнес не может расти прибыльно' },
    { front: 'Rule of 40', back: 'Для SaaS: Growth Rate + Profit Margin ≥ 40%' },
    { front: 'Magic Number', back: 'Эффективность роста SaaS', formula: 'Net New ARR / Sales & Marketing Spend' },
    { front: 'Путь к прибыли', back: 'Увеличивать LTV (ARPU, Retention) и снижать CAC (конверсия, виральность)' }
  ]
};

// Get flashcards by module slug
export function getFlashcardsByModule(moduleSlug: string): Flashcard[] {
  return MODULE_FLASHCARDS[moduleSlug] || [];
}
