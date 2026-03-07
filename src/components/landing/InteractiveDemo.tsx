'use client';

import { useState, useRef, useCallback } from 'react';
import { SectionLabel } from '@/components/ui/SectionLabel';

const PIPELINE_STEPS = [
  { id: 1, label: 'Input Sanitizer', detail: 'Structure & types validated.' },
  { id: 2, label: 'Idempotence check', detail: 'requestId not seen. Proceeding.' },
  { id: 3, label: 'beforeEvaluate', detail: 'FiscalPlugin: jurisdiction resolved.' },
  { id: 4, label: 'Rule Filter', detail: '3 rules active. 1 skipped (date).' },
  { id: 5, label: 'Rule Validator', detail: 'Checksums verified. Params valid.' },
  { id: 6, label: 'Dominance Resolver', detail: 'Priority order established.' },
  { id: 7, label: 'Execution Pipeline', detail: 'PROGRESSIVE_BRACKET applied.' },
  { id: 8, label: 'Trace Builder', detail: 'Audit trail complete.' },
  { id: 9, label: 'afterEvaluate', detail: 'FiscalPlugin: breakdown enriched.' },
  { id: 10, label: 'Snapshot Manager', detail: 'SHA-256 sealed. Saved to DB.' },
];

const SAMPLES: Record<string, string> = {
  fiscal: `{
  "requestId": "req-001",
  "data": {
    "net_taxable_income": 2400000,
    "country": "TG",
    "regime": "reel"
  },
  "meta": {
    "tenantId": "tenant-xyz"
  }
}`,
  payroll: `{
  "requestId": "req-002",
  "data": {
    "gross_salary": 350000,
    "country": "TG",
    "kpi_score": 85
  },
  "meta": {
    "tenantId": "tenant-xyz"
  }
}`,
  banking: `{
  "requestId": "req-003",
  "data": {
    "transaction_amount": 5750000,
    "fee_type": "transfer"
  },
  "meta": {
    "tenantId": "tenant-bank"
  }
}`,
};

interface DemoResult {
  value: string;
  breakdown: { label: string; contribution: string }[];
  model: string;
  category: string;
}

const RESULTS: Record<string, DemoResult> = {
  fiscal: {
    value: '147000',
    breakdown: [
      { label: 'Tranche 0\u2013900k (0%)', contribution: '0.00' },
      { label: 'Tranche 900k\u20131.8M (10%)', contribution: '90000.00' },
      { label: 'Tranche 1.8M\u20132.4M (15%)', contribution: '90000.00' },
    ],
    model: 'PROGRESSIVE_BRACKET',
    category: 'IRPP',
  },
  payroll: {
    value: '12600',
    breakdown: [
      { label: 'CNSS part salari\u00e9 (3.6%)', contribution: '12600.00' },
    ],
    model: 'SOCIAL_CONTRIBUTION',
    category: 'CNSS',
  },
  banking: {
    value: '17250',
    breakdown: [
      { label: 'Frais transfert (0.3%)', contribution: '17250.00' },
    ],
    model: 'FLAT_RATE',
    category: 'TRANSFER_FEE',
  },
};

interface StepState {
  active: boolean;
  done: boolean;
  running: boolean;
  detail: string;
  time: string;
}

export function InteractiveDemo() {
  const [domain, setDomain] = useState('fiscal');
  const [inputText, setInputText] = useState(SAMPLES.fiscal);
  const [steps, setSteps] = useState<StepState[]>([]);
  const [result, setResult] = useState<DemoResult | null>(null);
  const [showStamp, setShowStamp] = useState(false);
  const [running, setRunning] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const handleDomainChange = (value: string) => {
    setDomain(value);
    setInputText(SAMPLES[value] || SAMPLES.fiscal);
    clearTimers();
    setSteps([]);
    setResult(null);
    setShowStamp(false);
    setRunning(false);
  };

  const runDemo = () => {
    clearTimers();
    setResult(null);
    setShowStamp(false);
    setRunning(true);

    const initialSteps: StepState[] = PIPELINE_STEPS.map(() => ({
      active: false,
      done: false,
      running: false,
      detail: '',
      time: '',
    }));
    setSteps(initialSteps);

    let delay = 0;
    PIPELINE_STEPS.forEach((step, i) => {
      const stepTime = Math.floor(Math.random() * 3) + 1;

      const t1 = setTimeout(() => {
        setSteps((prev) => {
          const next = [...prev];
          next[i] = { ...next[i], active: true, running: true };
          return next;
        });
      }, delay);

      const t2 = setTimeout(() => {
        setSteps((prev) => {
          const next = [...prev];
          next[i] = {
            ...next[i],
            running: false,
            done: true,
            detail: step.detail,
            time: `${stepTime}ms`,
          };
          return next;
        });
      }, delay + 350);

      timersRef.current.push(t1, t2);
      delay += 200;
    });

    const totalDelay = delay + 400;
    const t3 = setTimeout(() => {
      setResult(RESULTS[domain] || RESULTS.fiscal);
      setShowStamp(true);
      setRunning(false);
    }, totalDelay);
    timersRef.current.push(t3);
  };

  return (
    <section className="py-14 md:py-20 px-4 md:px-8 bg-warm border-b border-rule">
      <div className="max-w-[1100px] mx-auto">
        <div className="mb-12">
          <SectionLabel>2 &mdash; Live Demonstration</SectionLabel>
          <h2 className="font-serif text-4xl font-bold mt-3">
            See the pipeline execute.
          </h2>
          <p className="font-serif text-lg text-muted mt-2">
            Edit the input, select a domain, run the evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-rule border border-rule">
          {/* Input panel */}
          <div className="bg-paper p-7">
            <div className="flex justify-between items-center mb-4">
              <SectionLabel>Input</SectionLabel>
              <select
                className="styled"
                value={domain}
                onChange={(e) => handleDomainChange(e.target.value)}
              >
                <option value="fiscal">Fiscal &middot; TG</option>
                <option value="payroll">Payroll &middot; TG</option>
                <option value="banking">Banking fees</option>
              </select>
            </div>
            <textarea
              className="editable-input"
              rows={14}
              spellCheck={false}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              className="btn-primary w-full mt-3"
              style={{ width: '100%' }}
              onClick={runDemo}
              disabled={running}
            >
              Execute Evaluation &rarr;
            </button>
          </div>

          {/* Pipeline panel */}
          <div className="bg-paper p-7">
            <div className="mb-5">
              <SectionLabel>Pipeline &middot; 10 steps</SectionLabel>
            </div>
            <div className="border-l-2 border-rule pl-5 relative">
              {steps.length === 0 ? (
                <div className="text-[#d1d5db] font-mono text-[10px] tracking-wider mt-15 text-center">
                  PRESS EXECUTE
                </div>
              ) : (
                PIPELINE_STEPS.map((step, i) => (
                  <div
                    key={step.id}
                    className={`pipeline-step ${steps[i]?.active ? 'active' : ''} ${steps[i]?.done ? 'done' : ''} ${steps[i]?.running ? 'running' : ''}`}
                    style={{ position: 'relative', marginBottom: 16 }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="step-dot w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                        style={{
                          background: steps[i]?.done
                            ? '#0d0d0d'
                            : steps[i]?.running
                              ? '#fbbf24'
                              : '#d1d5db',
                        }}
                      />
                      <div>
                        <div className="text-xs font-semibold font-sans">
                          {step.label}
                        </div>
                        <div
                          className="font-mono text-[10px] text-[#9ca3af] mt-0.5"
                          style={{
                            opacity: steps[i]?.done ? 1 : 0,
                            transition: 'opacity 0.3s',
                          }}
                        >
                          {steps[i]?.detail}
                        </div>
                      </div>
                      <div
                        className="ml-auto font-mono text-[9px]"
                        style={{
                          color: steps[i]?.done ? '#9ca3af' : '#d1d5db',
                        }}
                      >
                        {steps[i]?.time}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Result panel */}
          <div className="bg-paper p-7">
            <div className="mb-5">
              <SectionLabel>Evaluation Result</SectionLabel>
            </div>
            <div className="font-mono text-[11px] text-[#9ca3af] min-h-[300px]">
              {!result ? (
                <div className="flex items-center gap-2 text-[#d1d5db] mt-15 flex-col">
                  <span className="text-[32px]">&middot;</span>
                  <span className="text-[10px] tracking-wider">
                    AWAITING EXECUTION
                  </span>
                </div>
              ) : (
                <div className="font-mono text-[11px] leading-8">
                  <div className="mb-4 pb-3 border-b border-rule">
                    <span className="text-[#9ca3af]">model</span>
                    {'        '}
                    <span className="text-ink font-semibold">
                      {result.model}
                    </span>
                    <br />
                    <span className="text-[#9ca3af]">category</span>
                    {'    '}
                    <span className="text-ink">{result.category}</span>
                  </div>
                  <div className="mb-4">
                    {result.breakdown.map((b, i) => (
                      <div
                        key={i}
                        className="flex justify-between mb-1"
                      >
                        <span className="text-[#9ca3af] text-[10px]">
                          {b.label}
                        </span>
                        <span className="text-[#4b5563]">
                          {Number(b.contribution).toLocaleString()} XOF
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t-2 border-ink pt-3 flex justify-between items-center">
                    <span className="text-[#9ca3af]">total</span>
                    <span className="text-lg font-bold font-serif">
                      {Number(result.value).toLocaleString()} XOF
                    </span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-rule">
                    <div className="text-[#9ca3af] text-[9px] mb-1">
                      SNAPSHOT
                    </div>
                    <div className="text-[#6b7280] text-[9px] break-all">
                      snap_{Date.now()}
                    </div>
                    <div className="text-[#6b7280] text-[9px] break-all mt-0.5">
                      sha256:
                      {Math.random().toString(36).substring(2, 10)}...
                      {Math.random().toString(36).substring(2, 6)}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {showStamp && (
              <div className="mt-4 text-right">
                <span className="stamp" style={{ color: '#16a34a', borderColor: '#16a34a' }}>
                  Snapshot Saved
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
