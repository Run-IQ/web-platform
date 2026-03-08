import { sha256 } from 'js-sha256';

export interface Example {
  label: string;
  rules: string;
  input: string;
}

/**
 * Canonical JSON stringification (sorts keys alphabetically)
 */
function canonicalStringify(obj: any): string | undefined {
  if (obj === undefined) return undefined;
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return '[' + obj.map((o) => canonicalStringify(o) ?? 'null').join(',') + ']';
  }
  const keys = Object.keys(obj).sort();
  return '{' + keys.map((k) => {
    const val = canonicalStringify(obj[k]);
    if (val === undefined) return null;
    return `"${k}":${val}`;
  }).filter((v) => v !== null).join(',') + '}';
}

/**
 * Utility to generate checksum for examples
 */
function computeChecksum(params: any): string {
  return sha256(canonicalStringify(params) ?? 'null');
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
            '79b11726cd3ce89266119d3d60603c87bc7bba534bc923f846c8e24babcb4b8f',
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
          regime: 'reel',
        },
        meta: {
          tenantId: 'playground',
          context: { country: 'TG' }
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
        },
        meta: {
          tenantId: 'playground',
          context: { country: 'TG' }
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
            'f6f025406e18ab3e65932e98f57f8849adde7f7d82ca295ac711b7fa9bc604fd',
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
        },
        meta: {
          tenantId: 'playground',
          context: { country: 'TG' }
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
        },
        meta: {
          tenantId: 'playground',
          context: { country: 'TG' }
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
            '79b11726cd3ce89266119d3d60603c87bc7bba534bc923f846c8e24babcb4b8f',
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
            'f6f025406e18ab3e65932e98f57f8849adde7f7d82ca295ac711b7fa9bc604fd',
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
            '3bcd4f8878fa9e36e47a61bb14916107803259fda7d22603061fd9898bd696c7',
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
          regime: 'reel',
          fiscal_year: 2025,
        },
        meta: {
          tenantId: 'playground',
          scenario: 'full-payroll-simulation',
          context: { country: 'TG' }
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
          checksum: 'cd56af7b98e0de7f6a383c1bfbe64bd37666943b65f88b9ecf3045baf724328e',
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
          checksum: 'd27b552535046a629c10e0acf569076f9082bcb9c41c733d7d70a385b1763d9a',
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
          checksum: 'f4f072ef11f27c5fb72b0caeeedb1e769529683453e082e3e659212845d49643',
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
        },
        meta: {
          tenantId: 'playground',
          scenario: 'zone-franche-inhibition',
          context: { country: 'TG' }
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
          checksum: 'cd56af7b98e0de7f6a383c1bfbe64bd37666943b65f88b9ecf3045baf724328e',
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
          checksum: 'd27b552535046a629c10e0acf569076f9082bcb9c41c733d7d70a385b1763d9a',
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
              { from: 1800000, to: 2700000, rate: 0.15 },
              { from: 2700000, to: 3600000, rate: 0.25 },
              { from: 3600000, to: null, rate: 0.35 },
            ],
          },
          checksum: 'b083b9e6e874fc21912d2c4193428a35a2092be713697954ccf1216eeb38045e',
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
          checksum: 'd8fccacc7ab30e72642483dea158fb7238e1799ca301c18f42660a2d608fc1b2',
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
        },
        meta: {
          tenantId: 'playground',
          scenario: 'ngo-total-exemption',
          context: { country: 'TG' }
        },
      },
      null,
      2
    ),
  },
  gigafactory: {
    label: 'Boss: Gigafactory Multi-Exemption',
    rules: JSON.stringify(
      [
        {
          id: 'meta-zf-inhibit',
          model: 'META_INHIBITION',
          version: 1,
          priority: 9000,
          params: { targetCategories: ['TVA', 'IS_STD'] },
          condition: { dsl: 'jsonlogic', value: { "===": [{ var: "zone" }, "zone_franche"] } },
          checksum: computeChecksum({ targetCategories: ['TVA', 'IS_STD'] }),
          effectiveFrom: '2025-01-01',
          effectiveUntil: null, jurisdiction: 'NATIONAL', scope: 'GLOBAL', country: 'TG', category: 'META'
        },
        {
          id: 'tva-standard',
          model: 'FLAT_RATE',
          version: 1,
          priority: 3000,
          params: { base: 'revenue', rate: 0.18 },
          checksum: computeChecksum({ base: 'revenue', rate: 0.18 }),
          effectiveFrom: '2025-01-01',
          effectiveUntil: null, jurisdiction: 'NATIONAL', scope: 'GLOBAL', country: 'TG', category: 'TVA'
        },
        {
          id: 'is-standard',
          model: 'FLAT_RATE',
          version: 1,
          priority: 3000,
          params: { base: 'profit', rate: 0.27 },
          checksum: computeChecksum({ base: 'profit', rate: 0.27 }),
          effectiveFrom: '2025-01-01',
          effectiveUntil: null, jurisdiction: 'NATIONAL', scope: 'GLOBAL', country: 'TG', category: 'IS_STD'
        },
        {
          id: 'is-special-zf',
          model: 'FLAT_RATE',
          version: 1,
          priority: 3000,
          params: { base: 'profit', rate: 0.05 },
          checksum: computeChecksum({ base: 'profit', rate: 0.05 }),
          effectiveFrom: '2025-01-01',
          effectiveUntil: null, jurisdiction: 'NATIONAL', scope: 'GLOBAL', country: 'TG', category: 'IS_SPECIAL'
        },
        {
          id: 'irpp-exec',
          model: 'PROGRESSIVE_BRACKET',
          version: 1,
          priority: 3000,
          params: {
            base: 'taxable_salary',
            brackets: [
              { from: 0, to: 1000000, rate: 0.10 },
              { from: 1000000, to: null, rate: 0.30 }
            ]
          },
          checksum: computeChecksum({
            base: 'taxable_salary',
            brackets: [
              { from: 0, to: 1000000, rate: 0.10 },
              { from: 1000000, to: null, rate: 0.30 }
            ]
          }),
          effectiveFrom: '2025-01-01',
          effectiveUntil: null, jurisdiction: 'NATIONAL', scope: 'GLOBAL', country: 'TG', category: 'IRPP'
        },
        {
          id: 'cnss-total',
          model: 'COMPOSITE',
          version: 1,
          priority: 3000,
          params: {
            aggregation: 'SUM',
            steps: [
              { model: 'FLAT_RATE', params: { base: 'gross_salary', rate: 0.04 } },
              { model: 'FLAT_RATE', params: { base: 'gross_salary', rate: 0.18 } }
            ]
          },
          checksum: computeChecksum({
            aggregation: 'SUM',
            steps: [
              { model: 'FLAT_RATE', params: { base: 'gross_salary', rate: 0.04 } },
              { model: 'FLAT_RATE', params: { base: 'gross_salary', rate: 0.18 } }
            ]
          }),
          effectiveFrom: '2025-01-01',
          effectiveUntil: null, jurisdiction: 'NATIONAL', scope: 'GLOBAL', country: 'TG', category: 'CNSS'
        }
      ],
      null,
      2
    ),
    input: JSON.stringify(
      {
        requestId: 'boss-001',
        data: {
          revenue: 500000000,
          profit: 100000000,
          gross_salary: 20000000,
          taxable_salary: 18000000,
          zone: 'zone_franche'
        },
        meta: {
          tenantId: 'gigafactory',
          context: { country: 'TG' }
        },
      },
      null,
      2
    ),
  }
};

export const exampleKeys = Object.keys(examples) as (keyof typeof examples)[];
