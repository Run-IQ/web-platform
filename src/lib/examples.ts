export interface Example {
  label: string;
  rules: string;
  input: string;
}

export const examples: Record<string, Example> = {
  irpp: {
    label: 'Progressive Income Tax (IRPP)',
    rules: JSON.stringify(
      [
        {
          id: 'rule-irpp-001',
          model: 'PROGRESSIVE_BRACKET',
          version: 1,
          priority: 3000,
          tags: ['irpp', 'income-tax'],
          params: {
            base: 'net_taxable_income',
            brackets: [
              { from: 0, to: 900000, rate: 0 },
              { from: 900000, to: 1800000, rate: 0.1 },
              { from: 1800000, to: 2700000, rate: 0.15 },
              { from: 2700000, to: 3600000, rate: 0.25 },
              { from: 3600000, to: null, rate: 0.35 },
            ],
          },
          checksum:
            'b083b9e6e874fc21912d2c4193428a35a2092be713697954ccf1216eeb38045e',
          effectiveFrom: '2025-01-01',
          effectiveUntil: null,
          jurisdiction: 'NATIONAL',
          scope: 'GLOBAL',
          country: 'TG',
          category: 'IRPP',
        },
      ],
      null,
      2
    ),
    input: JSON.stringify(
      {
        requestId: 'playground-irpp-001',
        data: {
          net_taxable_income: 2400000,
          country: 'TG',
          regime: 'reel',
        },
        meta: {
          tenantId: 'playground',
        },
      },
      null,
      2
    ),
  },
  vat: {
    label: 'Flat Rate VAT (18%)',
    rules: JSON.stringify(
      [
        {
          id: 'rule-vat-001',
          model: 'FLAT_RATE',
          version: 1,
          priority: 3000,
          tags: ['tva', 'vat'],
          params: {
            base: 'taxable_amount',
            rate: 0.18,
          },
          checksum:
            '6d29a4417d923e9d7eef601a308550b792e3d44012729ec929366c0ee2606fed',
          effectiveFrom: '2025-01-01',
          effectiveUntil: null,
          jurisdiction: 'NATIONAL',
          scope: 'GLOBAL',
          country: 'TG',
          category: 'TVA',
        },
      ],
      null,
      2
    ),
    input: JSON.stringify(
      {
        requestId: 'playground-vat-001',
        data: {
          taxable_amount: 5000000,
          country: 'TG',
        },
        meta: {
          tenantId: 'playground',
        },
      },
      null,
      2
    ),
  },
  minimumTax: {
    label: 'Minimum Tax with Threshold',
    rules: JSON.stringify(
      [
        {
          id: 'rule-min-tax-001',
          model: 'MINIMUM_TAX',
          version: 1,
          priority: 3000,
          tags: ['minimum-tax'],
          params: {
            base: 'turnover',
            rate: 0.01,
            minimum: 500000,
          },
          checksum:
            '6726f41e2f9523701085e846481a0055161d4586657c8d0d5c137749bec2a267',
          effectiveFrom: '2025-01-01',
          effectiveUntil: null,
          jurisdiction: 'NATIONAL',
          scope: 'GLOBAL',
          country: 'TG',
          category: 'IMF',
        },
      ],
      null,
      2
    ),
    input: JSON.stringify(
      {
        requestId: 'playground-min-001',
        data: {
          turnover: 80000000,
          country: 'TG',
        },
        meta: {
          tenantId: 'playground',
        },
      },
      null,
      2
    ),
  },
  composite: {
    label: 'Composite — CNSS (Employee + Employer + Injury)',
    rules: JSON.stringify(
      [
        {
          id: 'rule-cnss-001',
          model: 'COMPOSITE',
          version: 1,
          priority: 3000,
          tags: ['cnss', 'social-security'],
          params: {
            aggregation: 'SUM',
            steps: [
              {
                label: 'Employee (3.6%)',
                model: 'FLAT_RATE',
                params: { base: 'gross_salary', rate: 0.036 },
              },
              {
                label: 'Employer (17.5%)',
                model: 'FLAT_RATE',
                params: { base: 'gross_salary', rate: 0.175 },
              },
              {
                label: 'Work Injury (2.5%)',
                model: 'FLAT_RATE',
                params: { base: 'gross_salary', rate: 0.025 },
              },
            ],
          },
          checksum:
            'd1accb8d5b230de914f59a16b11dd426395202a0f12ee4569a726a0ec6d5cd88',
          effectiveFrom: '2025-01-01',
          effectiveUntil: null,
          jurisdiction: 'NATIONAL',
          scope: 'GLOBAL',
          country: 'TG',
          category: 'CNSS',
        },
      ],
      null,
      2
    ),
    input: JSON.stringify(
      {
        requestId: 'playground-cnss-001',
        data: {
          gross_salary: 450000,
          country: 'TG',
        },
        meta: {
          tenantId: 'playground',
        },
      },
      null,
      2
    ),
  },
};

export const exampleKeys = Object.keys(examples) as (keyof typeof examples)[];
