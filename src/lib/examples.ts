import { sha256 } from 'js-sha256';

export interface Example {
  label: string;
  rules: string;
  input: string;
}

/**
 * Canonical JSON stringification (sorts keys alphabetically)
 */
function canonicalStringify(obj: unknown): string | undefined {
  if (obj === undefined) return undefined;
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return '[' + obj.map((o) => canonicalStringify(o) ?? 'null').join(',') + ']';
  }
  const record = obj as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return (
    '{' +
    keys
      .map((k) => {
        const val = canonicalStringify(record[k]);
        if (val === undefined) return null;
        return `"${k}":${val}`;
      })
      .filter((v): v is string => v !== null)
      .join(',') +
    '}'
  );
}

/**
 * Computes a checksum matching @run-iq/core's computeRuleChecksum.
 * Hashes the entire rule object except the checksum field itself.
 */
function computeRuleChecksum(rule: Record<string, unknown>): string {
  const entries = Object.entries(rule).filter(([key]) => key !== 'checksum');
  return sha256(canonicalStringify(Object.fromEntries(entries)) ?? 'null');
}

function withChecksum<T extends Record<string, unknown>>(rule: T): T & { checksum: string } {
  return { ...rule, checksum: computeRuleChecksum(rule) };
}

export const examples: Record<string, Example> = {
  irpp: {
    label: 'Progressive Income Tax (IRPP)',
    rules: JSON.stringify(
      [
        withChecksum({
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
          effectiveFrom: '2025-01-01',
          effectiveUntil: null,
          jurisdiction: 'NATIONAL',
          scope: 'GLOBAL',
          country: 'TG',
          category: 'IRPP',
        }),
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
        withChecksum({
          id: 'rule-vat-001',
          model: 'FLAT_RATE',
          version: 1,
          priority: 3000,
          tags: ['tva', 'vat'],
          params: {
            base: 'taxable_amount',
            rate: 0.18,
          },
          effectiveFrom: '2025-01-01',
          effectiveUntil: null,
          jurisdiction: 'NATIONAL',
          scope: 'GLOBAL',
          country: 'TG',
          category: 'TVA',
        }),
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
        withChecksum({
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
          effectiveFrom: '2025-01-01',
          effectiveUntil: null,
          jurisdiction: 'NATIONAL',
          scope: 'GLOBAL',
          country: 'TG',
          category: 'IMF',
        }),
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
        withChecksum({
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
          effectiveFrom: '2025-01-01',
          effectiveUntil: null,
          jurisdiction: 'NATIONAL',
          scope: 'GLOBAL',
          country: 'TG',
          category: 'CNSS',
        }),
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
        withChecksum({
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
          effectiveFrom: '2025-01-01',
          effectiveUntil: null,
          jurisdiction: 'NATIONAL',
          scope: 'GLOBAL',
          country: 'TG',
          category: 'IRPP',
        }),
        withChecksum({
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
          effectiveFrom: '2025-01-01',
          effectiveUntil: null,
          jurisdiction: 'NATIONAL',
          scope: 'GLOBAL',
          country: 'TG',
          category: 'CNSS',
        }),
        withChecksum({
          id: 'rule-tva-001',
          model: 'FLAT_RATE',
          version: 1,
          priority: 3000,
          tags: ['tva', 'vat', 'payroll'],
          params: {
            base: 'taxable_amount',
            rate: 0.18,
          },
          effectiveFrom: '2025-01-01',
          effectiveUntil: null,
          jurisdiction: 'NATIONAL',
          scope: 'GLOBAL',
          country: 'TG',
          category: 'TVA',
        }),
        withChecksum({
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
          effectiveFrom: '2025-01-01',
          effectiveUntil: null,
          jurisdiction: 'NATIONAL',
          scope: 'GLOBAL',
          country: 'TG',
          category: 'IMF',
        }),
        withChecksum({
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
          effectiveFrom: '2025-01-01',
          effectiveUntil: null,
          jurisdiction: 'NATIONAL',
          scope: 'GLOBAL',
          country: 'TG',
          category: 'TAXE_PRO',
        }),
        withChecksum({
          id: 'rule-timbre-001',
          model: 'FIXED_AMOUNT',
          version: 1,
          priority: 1000,
          tags: ['timbre', 'stamp-duty', 'payroll'],
          params: {
            amount: 5000,
            currency: 'XOF',
          },
          effectiveFrom: '2025-01-01',
          effectiveUntil: null,
          jurisdiction: 'NATIONAL',
          scope: 'GLOBAL',
          country: 'TG',
          category: 'TIMBRE',
        }),
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
        withChecksum({
          id: 'rule-tva-standard',
          model: 'FLAT_RATE',
          version: 1,
          priority: 3000,
          tags: ['tva', 'vat'],
          params: {
            base: 'revenue',
            rate: 0.18,
          },
          effectiveFrom: '2025-01-01',
          effectiveUntil: null,
          jurisdiction: 'NATIONAL',
          scope: 'GLOBAL',
          country: 'TG',
          category: 'TVA',
        }),
        withChecksum({
          id: 'rule-is-standard',
          model: 'FLAT_RATE',
          version: 1,
          priority: 3000,
          tags: ['is', 'corporate-tax'],
          params: {
            base: 'taxable_profit',
            rate: 0.27,
          },
          effectiveFrom: '2025-01-01',
          effectiveUntil: null,
          jurisdiction: 'NATIONAL',
          scope: 'GLOBAL',
          country: 'TG',
          category: 'IS',
        }),
        withChecksum({
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
          effectiveFrom: '2025-01-01',
          effectiveUntil: null,
          jurisdiction: 'NATIONAL',
          scope: 'GLOBAL',
          country: 'TG',
          category: 'META',
        }),
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
        withChecksum({
          id: 'rule-tva-general',
          model: 'FLAT_RATE',
          version: 1,
          priority: 3000,
          tags: ['tva'],
          params: {
            base: 'revenue',
            rate: 0.18,
          },
          effectiveFrom: '2025-01-01',
          effectiveUntil: null,
          jurisdiction: 'NATIONAL',
          scope: 'GLOBAL',
          country: 'TG',
          category: 'TVA',
        }),
        withChecksum({
          id: 'rule-is-general',
          model: 'FLAT_RATE',
          version: 1,
          priority: 3000,
          tags: ['is'],
          params: {
            base: 'taxable_profit',
            rate: 0.27,
          },
          effectiveFrom: '2025-01-01',
          effectiveUntil: null,
          jurisdiction: 'NATIONAL',
          scope: 'GLOBAL',
          country: 'TG',
          category: 'IS',
        }),
        withChecksum({
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
          effectiveFrom: '2025-01-01',
          effectiveUntil: null,
          jurisdiction: 'NATIONAL',
          scope: 'GLOBAL',
          country: 'TG',
          category: 'IRPP',
        }),
        withChecksum({
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
          effectiveFrom: '2025-01-01',
          effectiveUntil: null,
          jurisdiction: 'NATIONAL',
          scope: 'GLOBAL',
          country: 'TG',
          category: 'META',
        }),
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
        withChecksum({
          id: 'meta-zf-inhibit',
          model: 'META_INHIBITION',
          version: 1,
          priority: 9000,
          params: { targetCategories: ['TVA', 'IS_STD'] },
          condition: { dsl: 'jsonlogic', value: { '===': [{ var: 'zone' }, 'zone_franche'] } },
          effectiveFrom: '2025-01-01',
          effectiveUntil: null, jurisdiction: 'NATIONAL', scope: 'GLOBAL', country: 'TG', category: 'META',
        }),
        withChecksum({
          id: 'tva-standard',
          model: 'FLAT_RATE',
          version: 1,
          priority: 3000,
          params: { base: 'revenue', rate: 0.18 },
          effectiveFrom: '2025-01-01',
          effectiveUntil: null, jurisdiction: 'NATIONAL', scope: 'GLOBAL', country: 'TG', category: 'TVA',
        }),
        withChecksum({
          id: 'is-standard',
          model: 'FLAT_RATE',
          version: 1,
          priority: 3000,
          params: { base: 'profit', rate: 0.27 },
          effectiveFrom: '2025-01-01',
          effectiveUntil: null, jurisdiction: 'NATIONAL', scope: 'GLOBAL', country: 'TG', category: 'IS_STD',
        }),
        withChecksum({
          id: 'is-special-zf',
          model: 'FLAT_RATE',
          version: 1,
          priority: 3000,
          params: { base: 'profit', rate: 0.05 },
          effectiveFrom: '2025-01-01',
          effectiveUntil: null, jurisdiction: 'NATIONAL', scope: 'GLOBAL', country: 'TG', category: 'IS_SPECIAL',
        }),
        withChecksum({
          id: 'irpp-exec',
          model: 'PROGRESSIVE_BRACKET',
          version: 1,
          priority: 3000,
          params: {
            base: 'taxable_salary',
            brackets: [
              { from: 0, to: 1000000, rate: 0.10 },
              { from: 1000000, to: null, rate: 0.30 },
            ],
          },
          effectiveFrom: '2025-01-01',
          effectiveUntil: null, jurisdiction: 'NATIONAL', scope: 'GLOBAL', country: 'TG', category: 'IRPP',
        }),
        withChecksum({
          id: 'cnss-total',
          model: 'COMPOSITE',
          version: 1,
          priority: 3000,
          params: {
            aggregation: 'SUM',
            steps: [
              { model: 'FLAT_RATE', params: { base: 'gross_salary', rate: 0.04 } },
              { model: 'FLAT_RATE', params: { base: 'gross_salary', rate: 0.18 } },
            ],
          },
          effectiveFrom: '2025-01-01',
          effectiveUntil: null, jurisdiction: 'NATIONAL', scope: 'GLOBAL', country: 'TG', category: 'CNSS',
        })
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
