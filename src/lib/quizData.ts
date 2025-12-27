export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
  moduleSlug: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Module 1: Unit Margin
  {
    id: 1,
    question: 'Что такое "юнит" в юнит-экономике?',
    options: [
      'Единица измерения прибыли',
      'Базовая единица, приносящая деньги в бизнес',
      'Количество сотрудников',
      'Размер рекламного бюджета'
    ],
    correctIndex: 1,
    explanation: 'Юнит — это базовая единица, которая приносит деньги: подписчик для SaaS, заказ для e-commerce, чашка кофе для кофейни.',
    category: 'ЮНИТ И МАРЖА',
    moduleSlug: 'unit-margin'
  },
  {
    id: 2,
    question: 'Формула Unit Margin:',
    options: [
      'Revenue - Expenses',
      'Price - COGS',
      'LTV - CAC',
      'ARPU × Users'
    ],
    correctIndex: 1,
    explanation: 'Unit Margin = Price - COGS (себестоимость). Показывает чистую прибыль с одной продажи.',
    category: 'ЮНИТ И МАРЖА',
    moduleSlug: 'unit-margin'
  },
  {
    id: 3,
    question: 'Если Unit Margin отрицательная, это значит:',
    options: [
      'Бизнес растет',
      'Каждая продажа приносит убыток',
      'Нужно больше клиентов',
      'CAC слишком высокий'
    ],
    correctIndex: 1,
    explanation: 'Отрицательная маржа означает, что каждая продажа убыточна — вы теряете деньги на каждой единице товара.',
    category: 'ЮНИТ И МАРЖА',
    moduleSlug: 'unit-margin'
  },

  // Module 2: CAC
  {
    id: 4,
    question: 'CAC расшифровывается как:',
    options: [
      'Customer Annual Cost',
      'Customer Acquisition Cost',
      'Churn Acquisition Cost',
      'Customer Average Cost'
    ],
    correctIndex: 1,
    explanation: 'CAC = Customer Acquisition Cost — стоимость привлечения одного платящего клиента.',
    category: 'CAC',
    moduleSlug: 'cac'
  },
  {
    id: 5,
    question: 'Что входит в расчёт CAC?',
    options: [
      'Только рекламный бюджет',
      'Все затраты на привлечение: реклама, зарплаты маркетологов, инструменты',
      'Только зарплата продавцов',
      'Себестоимость продукта'
    ],
    correctIndex: 1,
    explanation: 'CAC включает ВСЕ затраты: рекламу, зарплаты маркетологов, инструменты автоматизации, комиссии агентств.',
    category: 'CAC',
    moduleSlug: 'cac'
  },
  {
    id: 6,
    question: 'Рекламный бюджет 300 000₽, привлечено 100 клиентов. CAC = ?',
    options: [
      '300₽',
      '3 000₽',
      '30 000₽',
      '300 000₽'
    ],
    correctIndex: 1,
    explanation: 'CAC = 300 000 / 100 = 3 000₽ на одного клиента.',
    category: 'CAC',
    moduleSlug: 'cac'
  },

  // Module 3: LTV
  {
    id: 7,
    question: 'Что показывает метрика LTV?',
    options: [
      'Стоимость привлечения клиента',
      'Пожизненную ценность клиента',
      'Процент оттока',
      'Средний чек'
    ],
    correctIndex: 1,
    explanation: 'LTV (Lifetime Value) — сколько денег принесёт клиент за всё время работы с вами.',
    category: 'LTV',
    moduleSlug: 'ltv'
  },
  {
    id: 8,
    question: 'Простая формула LTV:',
    options: [
      'LTV = CAC × Lifetime',
      'LTV = ARPU × Avg. Lifetime',
      'LTV = Price - COGS',
      'LTV = Revenue / Customers'
    ],
    correctIndex: 1,
    explanation: 'LTV = ARPU × Average Customer Lifetime. Также можно считать как ARPU / Churn Rate.',
    category: 'LTV',
    moduleSlug: 'ltv'
  },
  {
    id: 9,
    question: 'ARPU = 5000₽/мес, клиент остается 12 месяцев. LTV = ?',
    options: [
      '5 000₽',
      '12 000₽',
      '60 000₽',
      '600 000₽'
    ],
    correctIndex: 2,
    explanation: 'LTV = 5000 × 12 = 60 000₽',
    category: 'LTV',
    moduleSlug: 'ltv'
  },

  // Module 4: LTV/CAC Ratio
  {
    id: 10,
    question: 'Какое минимальное соотношение LTV/CAC считается здоровым?',
    options: [
      '1:1',
      '2:1',
      '3:1',
      '5:1'
    ],
    correctIndex: 2,
    explanation: 'LTV/CAC ≥ 3 — золотой стандарт. Меньше 3 — риск, больше 5 — возможно недоинвестируете в рост.',
    category: 'LTV/CAC RATIO',
    moduleSlug: 'ltv-cac-ratio'
  },
  {
    id: 11,
    question: 'LTV/CAC < 1 означает:',
    options: [
      'Отличная экономика',
      'Нужно больше клиентов',
      'Каждый клиент приносит убыток',
      'Быстрый рост'
    ],
    correctIndex: 2,
    explanation: 'При LTV/CAC < 1 вы тратите на привлечение клиента больше, чем он вам принесёт — это убыток.',
    category: 'LTV/CAC RATIO',
    moduleSlug: 'ltv-cac-ratio'
  },
  {
    id: 12,
    question: 'LTV = 90 000₽, CAC = 30 000₽. Ratio = ?',
    options: [
      '0.33',
      '3',
      '30',
      '60 000'
    ],
    correctIndex: 1,
    explanation: 'LTV/CAC = 90 000 / 30 000 = 3 — здоровый показатель.',
    category: 'LTV/CAC RATIO',
    moduleSlug: 'ltv-cac-ratio'
  },

  // Module 5: Churn
  {
    id: 13,
    question: 'Churn Rate показывает:',
    options: [
      'Процент новых пользователей',
      'Процент ушедших клиентов за период',
      'Скорость роста',
      'Средний чек'
    ],
    correctIndex: 1,
    explanation: 'Churn Rate — это процент клиентов, которые перестали пользоваться продуктом за период.',
    category: 'CHURN',
    moduleSlug: 'churn'
  },
  {
    id: 14,
    question: 'При Churn Rate 5% в месяц, какой средний срок жизни клиента?',
    options: [
      '5 месяцев',
      '10 месяцев',
      '20 месяцев',
      '50 месяцев'
    ],
    correctIndex: 2,
    explanation: 'Average Lifetime = 1 / Churn Rate. При 5% (0.05) это 1/0.05 = 20 месяцев.',
    category: 'CHURN',
    moduleSlug: 'churn'
  },
  {
    id: 15,
    question: 'Из 1000 клиентов за месяц ушло 80. Churn = ?%',
    options: [
      '0.8%',
      '8%',
      '80%',
      '12.5%'
    ],
    correctIndex: 1,
    explanation: 'Churn = 80 / 1000 × 100 = 8%',
    category: 'CHURN',
    moduleSlug: 'churn'
  },

  // Module 6: Payback Period
  {
    id: 16,
    question: 'Payback Period показывает:',
    options: [
      'Общую прибыль с клиента',
      'За сколько месяцев окупятся затраты на привлечение',
      'Стоимость привлечения',
      'Процент маржи'
    ],
    correctIndex: 1,
    explanation: 'CAC Payback Period — время, за которое клиент "окупает" затраты на своё привлечение.',
    category: 'PAYBACK',
    moduleSlug: 'payback-period'
  },
  {
    id: 17,
    question: 'Формула Payback Period:',
    options: [
      'LTV / CAC',
      'CAC / ARPU',
      'CAC / (ARPU × Margin)',
      'ARPU × Lifetime'
    ],
    correctIndex: 2,
    explanation: 'Payback = CAC / (ARPU × Gross Margin). Учитывает не только выручку, но и маржинальность.',
    category: 'PAYBACK',
    moduleSlug: 'payback-period'
  },
  {
    id: 18,
    question: 'Payback Period меньше 6 месяцев — это:',
    options: [
      'Плохо',
      'Отлично',
      'Опасно',
      'Невозможно'
    ],
    correctIndex: 1,
    explanation: 'Payback < 6 месяцев — отлично! Быстрая окупаемость позволяет реинвестировать в рост.',
    category: 'PAYBACK',
    moduleSlug: 'payback-period'
  },

  // Module 7: ARPU
  {
    id: 19,
    question: 'ARPU — это:',
    options: [
      'Average Revenue Per User',
      'Annual Recurring Payment Unit',
      'Acquisition Rate Per User',
      'Average Retention Per User'
    ],
    correctIndex: 0,
    explanation: 'ARPU = Average Revenue Per User — средний доход с одного пользователя за период.',
    category: 'ARPU',
    moduleSlug: 'arpu'
  },
  {
    id: 20,
    question: 'Чем ARPPU отличается от ARPU?',
    options: [
      'Ничем',
      'ARPPU считается только по платящим пользователям',
      'ARPPU — годовой показатель',
      'ARPPU включает затраты'
    ],
    correctIndex: 1,
    explanation: 'ARPPU = Average Revenue Per Paying User — средний чек только по платящим, без бесплатных.',
    category: 'ARPU',
    moduleSlug: 'arpu'
  },
  {
    id: 21,
    question: 'Выручка 2 000 000₽, MAU = 500. ARPU = ?',
    options: [
      '400₽',
      '4 000₽',
      '40 000₽',
      '250₽'
    ],
    correctIndex: 1,
    explanation: 'ARPU = 2 000 000 / 500 = 4 000₽',
    category: 'ARPU',
    moduleSlug: 'arpu'
  },

  // Module 8: Cohorts
  {
    id: 22,
    question: 'Что такое когортный анализ?',
    options: [
      'Анализ конкурентов',
      'Отслеживание групп пользователей, пришедших в один период',
      'Расчёт прибыли',
      'Анализ рекламных каналов'
    ],
    correctIndex: 1,
    explanation: 'Когортный анализ — отслеживание поведения группы пользователей, привлечённых в один период.',
    category: 'КОГОРТЫ',
    moduleSlug: 'cohorts'
  },
  {
    id: 23,
    question: 'Когорта 200 человек. Через 2 месяца активны 60. Retention = ?%',
    options: [
      '20%',
      '30%',
      '60%',
      '140%'
    ],
    correctIndex: 1,
    explanation: 'Retention = 60 / 200 × 100 = 30%',
    category: 'КОГОРТЫ',
    moduleSlug: 'cohorts'
  },
  {
    id: 24,
    question: 'Когортный анализ помогает:',
    options: [
      'Только считать выручку',
      'Сравнивать качество каналов привлечения и видеть реальный retention',
      'Увеличивать рекламный бюджет',
      'Нанимать сотрудников'
    ],
    correctIndex: 1,
    explanation: 'Когорты показывают реальный retention по месяцам и помогают сравнивать эффективность каналов.',
    category: 'КОГОРТЫ',
    moduleSlug: 'cohorts'
  },

  // Module 9: K-Factor (Virality)
  {
    id: 25,
    question: 'K-Factor измеряет:',
    options: [
      'Прибыльность',
      'Виральность продукта',
      'Стоимость клиента',
      'Скорость загрузки'
    ],
    correctIndex: 1,
    explanation: 'K-Factor — коэффициент виральности, показывает сколько новых пользователей приводит один текущий.',
    category: 'ВИРАЛЬНОСТЬ',
    moduleSlug: 'k-factor'
  },
  {
    id: 26,
    question: 'K-Factor > 1 означает:',
    options: [
      'Убыточный рост',
      'Стабильный рост',
      'Вирусный рост',
      'Замедление роста'
    ],
    correctIndex: 2,
    explanation: 'K-Factor > 1 означает вирусный рост — каждый пользователь приводит больше одного нового.',
    category: 'ВИРАЛЬНОСТЬ',
    moduleSlug: 'k-factor'
  },
  {
    id: 27,
    question: 'Пользователь шлёт 10 инвайтов, конверсия 8%. K-factor = ?',
    options: [
      '0.08',
      '0.8',
      '1.25',
      '80'
    ],
    correctIndex: 1,
    explanation: 'K = 10 × 0.08 = 0.8 — затухающий рост, нужна реклама.',
    category: 'ВИРАЛЬНОСТЬ',
    moduleSlug: 'k-factor'
  },

  // Module 10: MRR Growth
  {
    id: 28,
    question: 'MRR — это:',
    options: [
      'Marketing Revenue Rate',
      'Monthly Recurring Revenue',
      'Maximum Retention Rate',
      'Margin Revenue Ratio'
    ],
    correctIndex: 1,
    explanation: 'MRR = Monthly Recurring Revenue — ежемесячная повторяющаяся выручка.',
    category: 'MRR',
    moduleSlug: 'mrr-growth'
  },
  {
    id: 29,
    question: 'Что такое Expansion MRR?',
    options: [
      'Выручка от новых клиентов',
      'Дополнительная выручка от апгрейдов существующих клиентов',
      'Потери от оттока',
      'Фиксированные расходы'
    ],
    correctIndex: 1,
    explanation: 'Expansion MRR — дополнительная выручка от апгрейдов и допродаж текущим клиентам.',
    category: 'MRR',
    moduleSlug: 'mrr-growth'
  },
  {
    id: 30,
    question: 'New MRR 500k₽, Expansion 100k₽, Churned 150k₽. Net Growth = ?',
    options: [
      '350k₽',
      '450k₽',
      '550k₽',
      '750k₽'
    ],
    correctIndex: 1,
    explanation: 'Net MRR = New + Expansion - Churned = 500 + 100 - 150 = 450k₽',
    category: 'MRR',
    moduleSlug: 'mrr-growth'
  },

  // Module 11: Burn Rate
  {
    id: 31,
    question: 'Burn Rate показывает:',
    options: [
      'Скорость роста',
      'Скорость расходования денег',
      'Процент прибыли',
      'Количество клиентов'
    ],
    correctIndex: 1,
    explanation: 'Burn Rate — скорость, с которой компания расходует деньги (обычно в месяц).',
    category: 'BURN RATE',
    moduleSlug: 'burn-rate'
  },
  {
    id: 32,
    question: 'Runway — это:',
    options: [
      'Скорость роста',
      'Сколько месяцев проживёт компания на текущих деньгах',
      'Рекламный бюджет',
      'Количество сотрудников'
    ],
    correctIndex: 1,
    explanation: 'Runway = Cash / Net Burn — сколько месяцев проживёт компания при текущем темпе расходов.',
    category: 'BURN RATE',
    moduleSlug: 'burn-rate'
  },
  {
    id: 33,
    question: 'Кэш 6 000 000₽, Burn Rate 500 000₽/мес. Runway = ?',
    options: [
      '6 мес',
      '12 мес',
      '24 мес',
      '3 мес'
    ],
    correctIndex: 1,
    explanation: 'Runway = 6 000 000 / 500 000 = 12 месяцев',
    category: 'BURN RATE',
    moduleSlug: 'burn-rate'
  },

  // Module 12: Freemium
  {
    id: 34,
    question: 'Что такое Freemium модель?',
    options: [
      'Всё бесплатно',
      'Всё платно',
      'Бесплатный продукт с платными апгрейдами',
      'Пробный период'
    ],
    correctIndex: 2,
    explanation: 'Freemium — модель с бесплатной базовой версией и платными дополнительными функциями.',
    category: 'FREEMIUM',
    moduleSlug: 'freemium'
  },
  {
    id: 35,
    question: 'Типичная Free-to-Paid конверсия составляет:',
    options: [
      '50-70%',
      '20-30%',
      '2-5%',
      '0.1-0.5%'
    ],
    correctIndex: 2,
    explanation: 'Обычно 2-5% бесплатных пользователей переходят на платную версию.',
    category: 'FREEMIUM',
    moduleSlug: 'freemium'
  },
  {
    id: 36,
    question: '90% бесплатных, 10% платят 2000₽. Blended ARPU = ?',
    options: [
      '2000₽',
      '200₽',
      '1800₽',
      '180₽'
    ],
    correctIndex: 1,
    explanation: 'Blended ARPU = 0.10 × 2000 = 200₽ в среднем по всем пользователям.',
    category: 'FREEMIUM',
    moduleSlug: 'freemium'
  },

  // Module 13: B2B Sales Cycle
  {
    id: 37,
    question: 'Особенность B2B юнит-экономики:',
    options: [
      'Низкий CAC, низкий LTV',
      'Высокий CAC, высокий LTV, длинный цикл сделки',
      'Только бесплатные клиенты',
      'Мгновенные продажи'
    ],
    correctIndex: 1,
    explanation: 'B2B характеризуется высоким CAC (включая sales-команду), длинным Payback и высоким LTV.',
    category: 'B2B',
    moduleSlug: 'b2b-sales-cycle'
  },
  {
    id: 38,
    question: 'Что включает B2B CAC?',
    options: [
      'Только рекламу',
      'Зарплаты продавцов, маркетинг, presale, демо',
      'Только комиссии',
      'Себестоимость продукта'
    ],
    correctIndex: 1,
    explanation: 'B2B CAC включает все затраты: sales-команду, маркетинг, presale, демо, время до закрытия.',
    category: 'B2B',
    moduleSlug: 'b2b-sales-cycle'
  },
  {
    id: 39,
    question: 'Sales costs 3 000 000₽, Marketing 1 000 000₽, 20 сделок. CAC = ?',
    options: [
      '50 000₽',
      '100 000₽',
      '200 000₽',
      '400 000₽'
    ],
    correctIndex: 2,
    explanation: 'CAC = (3 000 000 + 1 000 000) / 20 = 200 000₽',
    category: 'B2B',
    moduleSlug: 'b2b-sales-cycle'
  },

  // Module 14: Unit Economics Canvas
  {
    id: 40,
    question: 'Unit Economics Canvas — это:',
    options: [
      'Рекламный инструмент',
      'Визуализация всей бизнес-модели',
      'Таблица Excel',
      'CRM система'
    ],
    correctIndex: 1,
    explanation: 'Canvas — это визуальное представление всех метрик бизнес-модели на одном экране.',
    category: 'КАНВАС',
    moduleSlug: 'unit-economics-canvas'
  },
  {
    id: 41,
    question: 'Три уровня анализа в Canvas:',
    options: [
      'Маркетинг, продажи, поддержка',
      'Unit Level, Customer Level, Company Level',
      'Доходы, расходы, прибыль',
      'Привлечение, удержание, монетизация'
    ],
    correctIndex: 1,
    explanation: 'Canvas анализирует: Unit Level (Price, COGS), Customer Level (CAC, LTV), Company Level (Revenue, Costs, Profit).',
    category: 'КАНВАС',
    moduleSlug: 'unit-economics-canvas'
  },
  {
    id: 42,
    question: 'LTV 50 000₽, CAC 10 000₽, 200 клиентов, Fixed 4 000 000₽. Profit = ?',
    options: [
      '4 000 000₽',
      '6 000 000₽',
      '8 000 000₽',
      '10 000 000₽'
    ],
    correctIndex: 0,
    explanation: 'Profit = (50000-10000) × 200 - 4000000 = 8 000 000 - 4 000 000 = 4 000 000₽',
    category: 'КАНВАС',
    moduleSlug: 'unit-economics-canvas'
  },

  // Module 15: Final Case
  {
    id: 43,
    question: 'Какой порядок расчёта юнит-экономики?',
    options: [
      'LTV → CAC → Churn → ARPU',
      'Unit Margin → ARPU → CAC → LTV → Ratio',
      'Profit → Revenue → Costs',
      'Любой порядок'
    ],
    correctIndex: 1,
    explanation: 'Начинаем с основ: Unit Margin, ARPU, потом CAC, LTV и их соотношение.',
    category: 'ФИНАЛЬНЫЙ КЕЙС',
    moduleSlug: 'final-case'
  },
  {
    id: 44,
    question: 'Что важнее всего при анализе юнит-экономики?',
    options: [
      'Только LTV',
      'Только CAC',
      'Соотношение LTV/CAC и Payback Period',
      'Количество клиентов'
    ],
    correctIndex: 2,
    explanation: 'Ключевые показатели — LTV/CAC Ratio (≥3) и Payback Period (чем короче, тем лучше).',
    category: 'ФИНАЛЬНЫЙ КЕЙС',
    moduleSlug: 'final-case'
  },
  {
    id: 45,
    question: 'Если LTV/CAC = 2, а Payback = 18 месяцев, что делать?',
    options: [
      'Всё отлично, ничего не менять',
      'Увеличить CAC',
      'Снизить CAC и/или увеличить LTV (retention, ARPU)',
      'Увеличить Fixed Costs'
    ],
    correctIndex: 2,
    explanation: 'При Ratio < 3 и длинном Payback нужно оптимизировать: снижать CAC или повышать LTV через retention/ARPU.',
    category: 'ФИНАЛЬНЫЙ КЕЙС',
    moduleSlug: 'final-case'
  },

  // Additional retention questions
  {
    id: 46,
    question: 'Что такое Retention Rate?',
    options: [
      'Процент новых пользователей',
      'Процент вернувшихся пользователей',
      'Стоимость удержания',
      'Коэффициент конверсии'
    ],
    correctIndex: 1,
    explanation: 'Retention Rate показывает, какой процент пользователей вернулся в продукт спустя N дней.',
    category: 'RETENTION',
    moduleSlug: 'cohorts'
  },
  {
    id: 47,
    question: 'Retention и Churn — это:',
    options: [
      'Одно и то же',
      'Противоположные метрики (Retention = 100% - Churn)',
      'Не связаны',
      'Обе про новых клиентов'
    ],
    correctIndex: 1,
    explanation: 'Retention + Churn = 100%. Если Churn 10%, то Retention 90%.',
    category: 'RETENTION',
    moduleSlug: 'churn'
  },

  // NPS and NSM
  {
    id: 48,
    question: 'NPS измеряет:',
    options: [
      'Прибыльность продукта',
      'Скорость роста',
      'Уровень лояльности клиентов',
      'Конверсию воронки'
    ],
    correctIndex: 2,
    explanation: 'NPS (Net Promoter Score) = % сторонников — % критиков. Показывает лояльность клиентов.',
    category: 'NPS',
    moduleSlug: 'cohorts'
  },
  {
    id: 49,
    question: 'Что такое North Star Metric (NSM)?',
    options: [
      'Главная метрика прибыли',
      'Ключевая метрика, измеряющая ценность для клиентов',
      'Метрика привлечения',
      'Показатель виральности'
    ],
    correctIndex: 1,
    explanation: 'NSM — главная метрика продукта, которая измеряет ключевую ценность для клиентов.',
    category: 'NSM',
    moduleSlug: 'unit-economics-canvas'
  },
  {
    id: 50,
    question: 'Пример NSM для Netflix:',
    options: [
      'Количество подписчиков',
      'Выручка',
      'Минуты просмотра',
      'CAC'
    ],
    correctIndex: 2,
    explanation: 'Для Netflix главная метрика — минуты просмотра, она показывает реальную ценность для пользователей.',
    category: 'NSM',
    moduleSlug: 'unit-economics-canvas'
  }
];

// Get questions by module
export function getQuestionsByModule(moduleSlug: string): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter(q => q.moduleSlug === moduleSlug);
}

// Get all unique categories
export function getQuizCategories(): string[] {
  return [...new Set(QUIZ_QUESTIONS.map(q => q.category))];
}
