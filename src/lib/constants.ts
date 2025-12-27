export interface Module {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: 'strategy' | 'acquisition' | 'revenue' | 'retention' | 'referral';
  level: 1 | 2 | 3;
  formula?: string;
  example?: {
    description: string;
    calculation: string;
    answer: number;
  };
  task?: {
    question: string;
    correctAnswer: number;
    hint: string;
  };
  theory?: string;
}

export const LEVELS = {
  1: { name: 'НОВИЧОК', label: 'BASE' },
  2: { name: 'МЕНЕДЖЕР', label: 'MEDIUM' },
  3: { name: 'СТРАТЕГ', label: 'ADVANCED' },
} as const;

export const CATEGORIES = {
  strategy: { label: 'STRATEGY', color: 'primary' },
  acquisition: { label: 'ACQUISITION', color: 'primary' },
  revenue: { label: 'REVENUE', color: 'primary' },
  retention: { label: 'RETENTION', color: 'primary' },
  referral: { label: 'REFERRAL', color: 'primary' },
} as const;

export const MODULES: Module[] = [
  {
    id: 1,
    slug: 'unit-margin',
    title: 'ЮНИТ И МАРЖА',
    description: 'Определяем кто приносит деньги и сколько чистого дохода остается.',
    category: 'strategy',
    level: 1,
    formula: 'Unit Margin = Price - COGS',
    example: {
      description: 'Продаем кофе за 150₽, себестоимость 50₽',
      calculation: '150 - 50 = 100₽',
      answer: 100,
    },
    task: {
      question: 'Цена продукта 2000₽, COGS = 800₽. Какая маржа с юнита?',
      correctAnswer: 1200,
      hint: 'Маржа = Цена - Себестоимость',
    },
    theory: `Юнит (Unit) — это базовая единица, которая приносит деньги в бизнес. Для SaaS это подписчик, для e-commerce — заказ, для кофейни — чашка кофе.

**Unit Margin** показывает, сколько денег остается с одной продажи после вычета прямых расходов (COGS).

Формула: **Price - COGS = Unit Margin**

Если маржа отрицательная — каждая продажа убыточна.`,
  },
  {
    id: 2,
    slug: 'cac',
    title: 'CAC: СТОИМОСТЬ ВХОДА',
    description: 'Считаем затраты на привлечение одного платящего клиента.',
    category: 'acquisition',
    level: 1,
    formula: 'CAC = Marketing Spend / New Customers',
    example: {
      description: 'Потратили 100 000₽ на рекламу, получили 50 клиентов',
      calculation: '100 000 / 50 = 2 000₽',
      answer: 2000,
    },
    task: {
      question: 'Рекламный бюджет 500 000₽, привлечено 200 клиентов. CAC = ?',
      correctAnswer: 2500,
      hint: 'CAC = Затраты / Количество клиентов',
    },
    theory: `**Customer Acquisition Cost (CAC)** — стоимость привлечения одного платящего клиента.

Формула: **CAC = Marketing Spend / New Paying Customers**

Важно учитывать ВСЕ затраты на привлечение: реклама, зарплаты маркетологов, инструменты, комиссии.

Правило: CAC должен окупаться быстрее, чем клиент уходит.`,
  },
  {
    id: 3,
    slug: 'ltv',
    title: 'LTV: ПОЖИЗНЕННАЯ ЦЕННОСТЬ',
    description: 'Сколько денег принесет клиент до того, как уйдет от нас.',
    category: 'revenue',
    level: 2,
    formula: 'LTV = ARPU × Avg. Lifetime',
    example: {
      description: 'ARPU = $50/мес, клиент остается 24 месяца',
      calculation: '50 × 24 = $1200',
      answer: 1200,
    },
    task: {
      question: 'ARPU = 3000₽/мес, средний срок жизни клиента 18 месяцев. LTV = ?',
      correctAnswer: 54000,
      hint: 'LTV = Средний чек × Количество периодов',
    },
    theory: `**Lifetime Value (LTV)** — сколько денег принесет один клиент за всё время работы с вами.

Простая формула: **LTV = ARPU × Average Customer Lifetime**

Продвинутая: **LTV = ARPU / Churn Rate**

LTV — главный показатель ценности клиента. Если LTV > CAC, бизнес может расти.`,
  },
  {
    id: 4,
    slug: 'ltv-cac-ratio',
    title: 'RATIO: ГЛАВНОЕ ПРАВИЛО',
    description: 'Сравнение LTV и CAC для оценки устойчивости модели.',
    category: 'strategy',
    level: 2,
    formula: 'LTV/CAC ≥ 3',
    example: {
      description: 'LTV = $900, CAC = $200',
      calculation: '900 / 200 = 4.5',
      answer: 4.5,
    },
    task: {
      question: 'LTV = 45 000₽, CAC = 12 000₽. Какой Ratio?',
      correctAnswer: 3.75,
      hint: 'Просто разделите LTV на CAC',
    },
    theory: `**LTV/CAC Ratio** — золотой стандарт оценки юнит-экономики.

Правила:
- **< 1** — убыточно, каждый клиент приносит минус
- **1-3** — риск, слишком дорогое привлечение
- **≥ 3** — здоровая экономика
- **> 5** — возможно, недоинвестируете в рост

Оптимум: **LTV/CAC = 3-5**`,
  },
  {
    id: 5,
    slug: 'churn',
    title: 'CHURN: УБИЙЦА РОСТА',
    description: 'Анализируем отток пользователей и его влияние на прибыль.',
    category: 'retention',
    level: 2,
    formula: 'Churn Rate = Lost Customers / Total Customers × 100%',
    example: {
      description: 'Было 1000 клиентов, ушло 50',
      calculation: '50 / 1000 × 100 = 5%',
      answer: 5,
    },
    task: {
      question: 'Из 2000 клиентов за месяц ушло 140. Churn = ?%',
      correctAnswer: 7,
      hint: 'Churn = (Ушедшие / Всего) × 100',
    },
    theory: `**Churn Rate** — процент клиентов, которые уходят за период.

Формула: **(Lost Customers / Start Customers) × 100%**

Связь с LTV: **Average Lifetime = 1 / Churn Rate**

При Churn 5% → средний срок жизни = 20 месяцев
При Churn 10% → средний срок жизни = 10 месяцев

Снижение Churn на 1% может увеличить LTV на 10-30%.`,
  },
  {
    id: 6,
    slug: 'payback-period',
    title: 'PAYBACK: СРОК ОКУПАЕМОСТИ',
    description: 'За сколько месяцев вернутся затраты на привлечение.',
    category: 'strategy',
    level: 2,
    formula: 'Payback = CAC / (ARPU × Margin)',
    example: {
      description: 'CAC = $300, ARPU = $50, Margin = 80%',
      calculation: '300 / (50 × 0.8) = 7.5 мес',
      answer: 7.5,
    },
    task: {
      question: 'CAC = 15 000₽, ARPU = 2 500₽, Margin = 60%. Payback = ? мес',
      correctAnswer: 10,
      hint: 'Payback = CAC / (ARPU × Margin)',
    },
    theory: `**CAC Payback Period** — время, за которое клиент "окупает" затраты на своё привлечение.

Формула: **CAC / (ARPU × Gross Margin)**

Ориентиры:
- **< 6 мес** — отлично
- **6-12 мес** — хорошо для B2B
- **> 18 мес** — опасно, нужен большой капитал`,
  },
  {
    id: 7,
    slug: 'arpu',
    title: 'ARPU: СРЕДНИЙ ЧЕК',
    description: 'Average Revenue Per User. Базовая метрика доходности.',
    category: 'revenue',
    level: 1,
    formula: 'ARPU = Total Revenue / Active Users',
    example: {
      description: 'Выручка 1 000 000₽, активных пользователей 500',
      calculation: '1 000 000 / 500 = 2 000₽',
      answer: 2000,
    },
    task: {
      question: 'Месячная выручка 3 600 000₽, MAU = 1200. ARPU = ?',
      correctAnswer: 3000,
      hint: 'ARPU = Выручка / Пользователи',
    },
    theory: `**ARPU (Average Revenue Per User)** — средний доход с одного пользователя за период.

Формула: **Total Revenue / Number of Users**

Вариации:
- **ARPU** — по всем пользователям
- **ARPPU** — только по платящим
- **ARPA** — по аккаунтам (B2B)

ARPU × Users = Revenue — базовое уравнение роста.`,
  },
  {
    id: 8,
    slug: 'cohorts',
    title: 'КОГОРТЫ: ГЛУБОКИЙ АНАЛИЗ',
    description: 'Анализ поведения групп пользователей, пришедших в разное время.',
    category: 'retention',
    level: 3,
    formula: 'Retention(n) = Active in Month N / Cohort Size × 100%',
    example: {
      description: 'Когорта января: 100 юзеров, в марте активны 45',
      calculation: '45 / 100 = 45% retention',
      answer: 45,
    },
    task: {
      question: 'Когорта 500 человек. Через 3 месяца активны 175. Retention = ?%',
      correctAnswer: 35,
      hint: 'Retention = (Активные / Начальные) × 100',
    },
    theory: `**Когортный анализ** — отслеживание поведения группы пользователей, привлечённых в один период.

Позволяет:
- Видеть реальный Retention по месяцам
- Сравнивать качество каналов привлечения
- Замечать изменения в продукте

Типичная таблица когорт показывает % активных пользователей через 1, 2, 3... месяца после регистрации.`,
  },
  {
    id: 9,
    slug: 'k-factor',
    title: 'ВИРАЛЬНОСТЬ: K-FACTOR',
    description: 'Сколько новых бесплатных клиентов приводит один текущий.',
    category: 'referral',
    level: 3,
    formula: 'K = Invites × Conversion Rate',
    example: {
      description: 'Каждый шлет 5 приглашений, конверсия 20%',
      calculation: '5 × 0.2 = 1.0',
      answer: 1,
    },
    task: {
      question: 'Пользователь шлет 8 инвайтов, конверсия 15%. K-factor = ?',
      correctAnswer: 1.2,
      hint: 'K = Инвайты × Конверсия',
    },
    theory: `**K-Factor** — коэффициент виральности, показывает органический рост.

Формула: **K = i × c**
- i = среднее количество приглашений
- c = конверсия приглашений

Значения:
- **K < 1** — затухающий рост, нужна реклама
- **K = 1** — самоподдерживающийся рост
- **K > 1** — вирусный рост (редкость!)

При K > 1 можно расти без маркетингового бюджета.`,
  },
  {
    id: 10,
    slug: 'mrr-growth',
    title: 'MRR: ДВИГАТЕЛЬ SAAS',
    description: 'Ежемесячная повторяющаяся выручка и её компоненты.',
    category: 'revenue',
    level: 3,
    formula: 'Net MRR = New + Expansion - Churned - Contraction',
    example: {
      description: 'New $10k, Expansion $3k, Churn $2k, Contraction $1k',
      calculation: '10 + 3 - 2 - 1 = $10k net growth',
      answer: 10,
    },
    task: {
      question: 'New MRR 800k₽, Expansion 200k₽, Churned 350k₽. Net Growth = ?k₽',
      correctAnswer: 650,
      hint: 'Net = New + Expansion - Churned',
    },
    theory: `**MRR (Monthly Recurring Revenue)** — ежемесячная повторяющаяся выручка.

Компоненты роста:
- **New MRR** — от новых клиентов
- **Expansion MRR** — апгрейды существующих
- **Churned MRR** — потери от ушедших
- **Contraction MRR** — даунгрейды

**Net New MRR = New + Expansion - Churned - Contraction**

ARR = MRR × 12`,
  },
  {
    id: 11,
    slug: 'burn-rate',
    title: 'BURN RATE: СКОРОСТЬ СЖИГАНИЯ',
    description: 'Сколько денег компания теряет ежемесячно.',
    category: 'strategy',
    level: 3,
    formula: 'Runway = Cash / Monthly Burn',
    example: {
      description: 'На счету $500k, тратим $50k/мес',
      calculation: '500 / 50 = 10 месяцев runway',
      answer: 10,
    },
    task: {
      question: 'Кэш 12 000 000₽, Burn Rate 1 500 000₽/мес. Runway = ? мес',
      correctAnswer: 8,
      hint: 'Runway = Деньги / Burn Rate',
    },
    theory: `**Burn Rate** — скорость расходования денег.

**Gross Burn** = все расходы
**Net Burn** = расходы - доходы

**Runway** = Cash / Net Burn — сколько месяцев проживёт компания

Правила:
- Runway < 6 мес — срочно фандрейз
- Runway 12-18 мес — комфортно
- Следить за динамикой burn rate`,
  },
  {
    id: 12,
    slug: 'freemium',
    title: 'FREEMIUM МОНЕТИЗАЦИЯ',
    description: 'Экономика бесплатных и платных пользователей.',
    category: 'revenue',
    level: 3,
    formula: 'Blended ARPU = (Free × 0 + Paid × ARPPU) / Total',
    example: {
      description: '90% free, 10% платят по $20',
      calculation: '(0.9×0 + 0.1×20) = $2 blended',
      answer: 2,
    },
    task: {
      question: '80% бесплатных, 20% платят 1500₽. Blended ARPU = ?',
      correctAnswer: 300,
      hint: 'ARPU = (% платящих × их чек)',
    },
    theory: `**Freemium** — модель с бесплатным продуктом и платными апгрейдами.

Ключевые метрики:
- **Free-to-Paid Conversion** — % перехода на платную версию (обычно 2-5%)
- **Blended ARPU** — средний чек по всем пользователям
- **ARPPU** — средний чек только платящих

Free пользователи не бесплатны: серверы, поддержка, виральность.

Цель: максимизировать конверсию в платящих.`,
  },
  {
    id: 13,
    slug: 'b2b-sales-cycle',
    title: 'B2B: ЦИКЛ СДЕЛКИ',
    description: 'Особенности юнит-экономики в корпоративных продажах.',
    category: 'strategy',
    level: 3,
    formula: 'Effective CAC = (Sales + Marketing) / Closed Deals',
    example: {
      description: 'Sales $200k/год, Marketing $100k, закрыли 30 сделок',
      calculation: '(200+100) / 30 = $10k CAC',
      answer: 10000,
    },
    task: {
      question: 'Sales costs 6 000 000₽, Marketing 2 000 000₽, 40 сделок. CAC = ?',
      correctAnswer: 200000,
      hint: 'CAC = (Sales + Marketing) / Сделки',
    },
    theory: `**B2B Unit Economics** учитывает длинный цикл сделки.

Особенности:
- Высокий CAC (включая sales-команду)
- Длинный Payback (6-24 месяца)
- Высокий LTV (контракты на годы)
- Expansion Revenue важнее New Revenue

CAC должен включать:
- Зарплаты продавцов
- Маркетинг
- Presale и демо
- Время до закрытия`,
  },
  {
    id: 14,
    slug: 'unit-economics-canvas',
    title: 'КАНВАС ЭКОНОМИКИ',
    description: 'Сводим все метрики в единую картину бизнес-модели.',
    category: 'strategy',
    level: 3,
    formula: 'Profit = (LTV - CAC) × New Customers - Fixed Costs',
    example: {
      description: 'LTV $500, CAC $100, 1000 новых, Fixed $200k',
      calculation: '(500-100)×1000 - 200000 = $200k profit',
      answer: 200000,
    },
    task: {
      question: 'LTV 30 000₽, CAC 8 000₽, 500 клиентов, Fixed 5 000 000₽. Profit = ?',
      correctAnswer: 6000000,
      hint: 'Profit = (LTV-CAC) × Клиенты - Fixed',
    },
    theory: `**Unit Economics Canvas** — визуализация всей бизнес-модели.

Уровни анализа:
1. **Unit Level**: Price, COGS, Margin
2. **Customer Level**: CAC, LTV, Ratio
3. **Company Level**: Revenue, Costs, Profit

Канвас помогает:
- Найти узкие места модели
- Моделировать сценарии роста
- Принимать решения об инвестициях`,
  },
  {
    id: 15,
    slug: 'final-case',
    title: 'ЭКЗАМЕН: ФИНАЛЬНЫЙ КЕЙС',
    description: 'Полный расчет экономики проекта от А до Я.',
    category: 'strategy',
    level: 3,
    formula: 'All Metrics Combined',
    example: {
      description: 'Комплексный расчет стартапа',
      calculation: 'See full case study',
      answer: 0,
    },
    task: {
      question: 'SaaS: Price $99, COGS $10, Marketing $50k/мес, 100 новых клиентов, Churn 5%. LTV/CAC = ?',
      correctAnswer: 3.56,
      hint: 'CAC = $500, LTV = ARPU/Churn = $1780',
    },
    theory: `**Финальный кейс** объединяет все знания курса.

Алгоритм полного расчета:
1. Определить юнит и его маржу
2. Посчитать CAC (все каналы)
3. Рассчитать ARPU и Churn
4. Вычислить LTV
5. Проверить LTV/CAC Ratio
6. Оценить Payback Period
7. Построить прогноз MRR
8. Рассчитать Runway

Здоровая модель: LTV/CAC ≥ 3, Payback < 12 мес, Net Churn ≤ 0.`,
  },
];

export const THEORY_STEPS = [
  {
    id: 1,
    title: 'КТО ВАШ ЮНИТ?',
    icon: 'target',
    content: `Юнит — минимальная единица, генерирующая выручку. Это может быть:
    
• **Транзакция** — для e-commerce и маркетплейсов
• **Подписчик** — для SaaS и подписочных сервисов  
• **Заказ** — для сервисов доставки
• **Клик** — для рекламных моделей

Вопрос: "За что нам платят?"`,
  },
  {
    id: 2,
    title: 'РАСЧЕТ МАРЖИ',
    icon: 'dollar',
    content: `Contribution Margin показывает, зарабатываем ли мы на продаже продукта.

**Формула**: Price - COGS = Unit Margin

COGS (Cost of Goods Sold) — только прямые расходы на единицу:
• Себестоимость товара
• Переменные затраты на доставку
• Комиссии платежных систем

Не включаем: маркетинг, аренду, зарплаты.`,
  },
  {
    id: 3,
    title: 'СТОИМОСТЬ ВХОДА (CAC)',
    icon: 'zap',
    content: `Customer Acquisition Cost — сколько тратим на привлечение одного клиента.

**Формула**: Total Marketing Spend / New Customers

Учитываем ВСЕ расходы:
• Реклама (онлайн + оффлайн)
• Зарплаты маркетологов
• Инструменты и сервисы
• Партнерские комиссии

CAC нужно считать по каналам!`,
  },
  {
    id: 4,
    title: 'ЦЕННОСТЬ ЖИЗНИ (LTV)',
    icon: 'refresh',
    content: `Lifetime Value — сколько денег принесет клиент за всё время.

**Простая формула**: ARPU × Average Lifetime

**Через Churn**: ARPU / Monthly Churn Rate

Пример:
• ARPU = $50/мес
• Churn = 5%/мес
• LTV = $50 / 0.05 = $1000

Главное правило: LTV должен быть минимум в 3 раза больше CAC.`,
  },
  {
    id: 5,
    title: 'СХОДИМОСТЬ МОДЕЛИ',
    icon: 'check',
    content: `Когда экономика "сходится":

**LTV/CAC ≥ 3** — каждый клиент приносит 3x от затрат на привлечение

**Payback ≤ 12 мес** — вложения возвращаются в течение года

**Net Churn ≤ 0** — expansion покрывает отток

Если метрики не сходятся — нужно:
• Увеличить цену
• Снизить CAC  
• Улучшить retention
• Добавить upsell`,
  },
];

export const STUDENTS = [
  { id: 1, name: 'Zuhra', telegram: '@Zuhra_akylbek', status: 'online', xp: 0, rank: 'Growth PM' },
  { id: 2, name: 'Артем', telegram: '@artem_pm', status: 'offline', xp: 150, rank: 'Junior PM' },
  { id: 3, name: 'Мария', telegram: '@maria_k', status: 'online', xp: 320, rank: 'Middle PM' },
  { id: 4, name: 'Данил', telegram: '@danil_dev', status: 'offline', xp: 80, rank: 'Intern' },
];
