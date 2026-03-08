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
  fullPayroll: {
    label: 'Full Payroll Simulation (6 rules)',
    rules: JSON.stringify(
      [
        {
          id: 'rule-irpp-001',
          model: 'PROGRESSIVE_BRACKET',
          version: 1,
          priority: 3500,
          tags: ['irpp', 'income-tax', 'payroll'],
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
        {
          id: 'rule-cnss-001',
          model: 'COMPOSITE',
          version: 1,
          priority: 3000,
          tags: ['cnss', 'social-security', 'payroll'],
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
        {
          id: 'rule-tva-001',
          model: 'FLAT_RATE',
          version: 1,
          priority: 3000,
          tags: ['tva', 'vat', 'payroll'],
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
        {
          id: 'rule-imf-001',
          model: 'MINIMUM_TAX',
          version: 1,
          priority: 2500,
          tags: ['imf', 'minimum-tax', 'payroll'],
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
        {
          id: 'rule-taxe-pro-001',
          model: 'THRESHOLD_BASED',
          version: 1,
          priority: 2000,
          tags: ['taxe-professionnelle', 'payroll'],
          params: {
            base: 'turnover',
            threshold: 30000000,
            rate: 0.0075,
            above_only: false,
          },
          checksum:
            'c21ddfdd9e86ae2dad6853da122bdf42c00bc0822940aa11e7f291adb2ebb849',
          effectiveFrom: '2025-01-01',
          effectiveUntil: null,
          jurisdiction: 'NATIONAL',
          scope: 'GLOBAL',
          country: 'TG',
          category: 'TAXE_PRO',
        },
        {
          id: 'rule-timbre-001',
          model: 'FIXED_AMOUNT',
          version: 1,
          priority: 1000,
          tags: ['timbre', 'stamp-duty', 'payroll'],
          params: {
            amount: 5000,
            currency: 'XOF',
          },
          checksum:
            '57339395da843742b4d6a27916774a853391f45d4a052069dad858e81e656b1a',
          effectiveFrom: '2025-01-01',
          effectiveUntil: null,
          jurisdiction: 'NATIONAL',
          scope: 'GLOBAL',
          country: 'TG',
          category: 'TIMBRE',
        },
      ],
      null,
      2
    ),
    input: JSON.stringify(
      {
        requestId: 'playground-full-001',
        data: {
          gross_salary: 4200000,
          net_taxable_income: 3750000,
          taxable_amount: 12500000,
          turnover: 85000000,
          country: 'TG',
          regime: 'reel',
          fiscal_year: 2025,
        },
        meta: {
          tenantId: 'playground',
          scenario: 'full-payroll-simulation',
        },
      },
      null,
      2
    ),
  },
  zonefranche: {
    label: 'Meta-Rule: Zone Franche Inhibition',
    rules: JSON.stringify(
      [
        {
          id: 'rule-tva-standard',
          model: 'FLAT_RATE',
          version: 1,
          priority: 3000,
          tags: ['tva', 'vat'],
          params: {
            base: 'revenue',
            rate: 0.18,
          },
          checksum:
            'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
          effectiveFrom: '2025-01-01',
          effectiveUntil: null,
          jurisdiction: 'NATIONAL',
          scope: 'GLOBAL',
          country: 'TG',
          category: 'TVA',
        },
        {
          id: 'rule-is-standard',
          model: 'FLAT_RATE',
          version: 1,
          priority: 3000,
          tags: ['is', 'corporate-tax'],
          params: {
            base: 'taxable_profit',
            rate: 0.27,
          },
          checksum:
            'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3',
          effectiveFrom: '2025-01-01',
          effectiveUntil: null,
          jurisdiction: 'NATIONAL',
          scope: 'GLOBAL',
          country: 'TG',
          category: 'IS',
        },
        {
          id: 'meta-zone-franche-inhibit-tva',
          model: 'META_INHIBITION',
          version: 1,
          priority: 9000,
          tags: ['meta', 'zone-franche'],
          params: {
            targetCategories: ['TVA'],
          },
          condition: {
            dsl: 'jsonlogic',
            value: { '===': [{ var: 'zone' }, 'zone_franche'] },
          },
          checksum:
            'c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4',
          effectiveFrom: '2025-01-01',
          effectiveUntil: null,
          jurisdiction: 'NATIONAL',
          scope: 'GLOBAL',
          country: 'TG',
          category: 'META',
        },
      ],
      null,
      2
    ),
    input: JSON.stringify(
      {
        requestId: 'playground-zf-001',
        data: {
          revenue: 10000000,
          taxable_profit: 3000000,
          zone: 'zone_franche',
          country: 'TG',
        },
        meta: {
          tenantId: 'playground',
          scenario: 'zone-franche-inhibition',
        },
      },
      null,
      2
    ),
  },
  ngoExempt: {
    label: 'Meta-Rule: NGO Total Exemption',
    rules: JSON.stringify(
      [
        {
          id: 'rule-tva-general',
          model: 'FLAT_RATE',
          version: 1,
          priority: 3000,
          tags: ['tva'],
          params: {
            base: 'revenue',
            rate: 0.18,
          },
          checksum:
            'd4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5',
          effectiveFrom: '2025-01-01',
          effectiveUntil: null,
          jurisdiction: 'NATIONAL',
          scope: 'GLOBAL',
          country: 'TG',
          category: 'TVA',
        },
        {
          id: 'rule-is-general',
          model: 'FLAT_RATE',
          version: 1,
          priority: 3000,
          tags: ['is'],
          params: {
            base: 'taxable_profit',
            rate: 0.27,
          },
          checksum:
            'e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6',
          effectiveFrom: '2025-01-01',
          effectiveUntil: null,
          jurisdiction: 'NATIONAL',
          scope: 'GLOBAL',
          country: 'TG',
          category: 'IS',
        },
        {
          id: 'rule-irpp-general',
          model: 'PROGRESSIVE_BRACKET',
          version: 1,
          priority: 3000,
          tags: ['irpp'],
          params: {
            base: 'net_taxable_income',
            brackets: [
              { from: 0, to: 900000, rate: 0 },
              { from: 900000, to: 1800000, rate: 0.1 },
              { from: 1800000, to: null, rate: 0.15 },
            ],
          },
          checksum:
            'f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1',
          effectiveFrom: '2025-01-01',
          effectiveUntil: null,
          jurisdiction: 'NATIONAL',
          scope: 'GLOBAL',
          country: 'TG',
          category: 'IRPP',
        },
        {
          id: 'meta-ngo-short-circuit',
          model: 'META_SHORT_CIRCUIT',
          version: 1,
          priority: 9999,
          tags: ['meta', 'ngo-exempt'],
          params: {
            value: 0,
            reason: 'NGO/non-profit entities are exempt from all taxes under Article 145 CGI',
          },
          condition: {
            dsl: 'jsonlogic',
            value: { '===': [{ var: 'entity_type' }, 'NGO'] },
          },
          checksum:
            'a1a1b2b2c3c3d4d4e5e5f6f6a1a1b2b2c3c3d4d4e5e5f6f6a1a1b2b2c3c3d4d4',
          effectiveFrom: '2025-01-01',
          effectiveUntil: null,
          jurisdiction: 'NATIONAL',
          scope: 'GLOBAL',
          country: 'TG',
          category: 'META',
        },
      ],
      null,
      2
    ),
    input: JSON.stringify(
      {
        requestId: 'playground-ngo-001',
        data: {
          revenue: 50000000,
          taxable_profit: 8000000,
          net_taxable_income: 5000000,
          entity_type: 'NGO',
          country: 'TG',
        },
        meta: {
          tenantId: 'playground',
          scenario: 'ngo-total-exemption',
        },
      },
      null,
      2
    ),
  },
};

export const exampleKeys = Object.keys(examples) as (keyof typeof examples)[];
