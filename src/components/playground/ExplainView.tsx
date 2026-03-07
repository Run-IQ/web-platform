'use client';

import type { EvaluationResult } from '@run-iq/core';

interface BracketDetail {
  from: number;
  to: number | null;
  rate: number;
  taxable: number;
  contribution: number;
}

function fmt(n: number): string {
  return n.toLocaleString('fr-FR');
}

function pct(rate: number): string {
  return `${(rate * 100).toFixed(rate % 0.01 === 0 ? 0 : 1)}%`;
}

function ExplainBreakdownItem({ ruleId, modelUsed, contribution, detail }: {
  ruleId: string;
  modelUsed: string;
  contribution: number;
  detail: unknown;
}) {
  // Progressive brackets
  if (Array.isArray(detail) && detail.length > 0 && 'rate' in (detail[0] as object)) {
    const brackets = detail as BracketDetail[];
    return (
      <div className="mb-5">
        <div className="font-sans text-sm font-semibold text-ink mb-2">
          {ruleId}
          <span className="ml-2 font-mono text-[10px] text-[#9ca3af] uppercase">{modelUsed}</span>
        </div>
        <div className="space-y-1">
          {brackets.map((br, i) => (
            <div key={i} className="flex items-center gap-2 font-mono text-xs">
              <span className="text-[#9ca3af] w-[200px]">
                {fmt(br.from)} {br.to != null ? `— ${fmt(br.to)}` : 'et plus'}
              </span>
              <span className="text-[#6b7280] w-[40px] text-right">{pct(br.rate)}</span>
              <span className="text-[#9ca3af] mx-1">de</span>
              <span className="text-[#6b7280] w-[100px] text-right">{fmt(br.taxable)}</span>
              <span className="text-[#9ca3af] mx-1">=</span>
              <span className={`font-semibold w-[100px] text-right ${br.contribution === 0 ? 'text-[#d1d5db]' : 'text-ink'}`}>
                {fmt(br.contribution)}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-2 font-mono text-xs pt-2 border-t border-[#e5e5e0] mt-2">
            <span className="text-[#9ca3af] w-[200px]">Total</span>
            <span className="w-[40px]" />
            <span className="w-[100px]" />
            <span className="mx-1" />
            <span className="mx-1" />
            <span className="font-bold text-ink w-[100px] text-right">{fmt(contribution)}</span>
          </div>
        </div>
      </div>
    );
  }

  const d = (detail && typeof detail === 'object') ? detail as Record<string, unknown> : null;

  // Composite steps
  if (d && Array.isArray(d['steps'])) {
    const steps = d['steps'] as Array<{ model: string; label?: string; value: number }>;
    return (
      <div className="mb-5">
        <div className="font-sans text-sm font-semibold text-ink mb-2">
          {ruleId}
          <span className="ml-2 font-mono text-[10px] text-[#9ca3af] uppercase">{modelUsed}</span>
          <span className="ml-2 font-mono text-[10px] text-[#d1d5db] uppercase">{String(d['aggregation'])}</span>
        </div>
        <div className="space-y-1">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2 font-mono text-xs">
              <span className="text-[#6b7280] flex-1">{s.label ?? s.model}</span>
              <span className="text-ink font-semibold w-[100px] text-right">{fmt(s.value)}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 font-mono text-xs pt-2 border-t border-[#e5e5e0] mt-2">
            <span className="text-[#9ca3af] flex-1">Total ({String(d['aggregation'])})</span>
            <span className="font-bold text-ink w-[100px] text-right">{fmt(contribution)}</span>
          </div>
        </div>
      </div>
    );
  }

  // Minimum tax
  if (d && typeof d['appliedMinimum'] === 'boolean') {
    const computed = Number(d['computed']);
    const minimum = Number(d['minimum']);
    return (
      <div className="mb-5">
        <div className="font-sans text-sm font-semibold text-ink mb-2">
          {ruleId}
          <span className="ml-2 font-mono text-[10px] text-[#9ca3af] uppercase">{modelUsed}</span>
        </div>
        <div className="font-mono text-xs space-y-1">
          <div className="flex gap-2">
            <span className="text-[#9ca3af] w-[120px]">Calculated</span>
            <span className="text-[#6b7280]">{fmt(computed)}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-[#9ca3af] w-[120px]">Minimum floor</span>
            <span className="text-[#6b7280]">{fmt(minimum)}</span>
          </div>
          <div className="flex gap-2 pt-2 border-t border-[#e5e5e0] mt-2">
            <span className="text-[#9ca3af] w-[120px]">Applied</span>
            <span className="font-bold text-ink">
              {fmt(contribution)}
              {d['appliedMinimum'] && (
                <span className="ml-2 text-amber-500 font-normal text-[10px]">(minimum applied)</span>
              )}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Threshold
  if (d && typeof d['belowThreshold'] === 'boolean') {
    const threshold = Number(d['threshold']);
    return (
      <div className="mb-5">
        <div className="font-sans text-sm font-semibold text-ink mb-2">
          {ruleId}
          <span className="ml-2 font-mono text-[10px] text-[#9ca3af] uppercase">{modelUsed}</span>
        </div>
        <div className="font-mono text-xs space-y-1">
          <div className="flex gap-2">
            <span className="text-[#9ca3af] w-[120px]">Threshold</span>
            <span className="text-[#6b7280]">{fmt(threshold)}</span>
          </div>
          {d['belowThreshold'] ? (
            <div className="text-[#9ca3af] text-[10px] italic mt-1">Below threshold — no tax applied</div>
          ) : (
            <>
              <div className="flex gap-2">
                <span className="text-[#9ca3af] w-[120px]">Taxable amount</span>
                <span className="text-[#6b7280]">{fmt(Number(d['taxableAmount']))}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-[#9ca3af] w-[120px]">Rate</span>
                <span className="text-[#6b7280]">{pct(Number(d['rate']))}</span>
              </div>
            </>
          )}
          <div className="flex gap-2 pt-2 border-t border-[#e5e5e0] mt-2">
            <span className="text-[#9ca3af] w-[120px]">Tax</span>
            <span className="font-bold text-ink">{fmt(contribution)}</span>
          </div>
        </div>
      </div>
    );
  }

  // Flat rate / fixed amount — simple line
  return (
    <div className="mb-5">
      <div className="font-sans text-sm font-semibold text-ink mb-2">
        {ruleId}
        <span className="ml-2 font-mono text-[10px] text-[#9ca3af] uppercase">{modelUsed}</span>
      </div>
      <div className="font-mono text-xs flex gap-2">
        <span className="text-[#9ca3af]">Result</span>
        <span className="font-bold text-ink">{fmt(contribution)}</span>
      </div>
    </div>
  );
}

interface ExplainViewProps {
  result: EvaluationResult;
}

export function ExplainView({ result }: ExplainViewProps) {
  const breakdown = result.breakdown ?? [];
  const trace = result.trace;

  if (breakdown.length === 0) {
    return (
      <div className="p-6 font-mono text-xs text-[#9ca3af]">
        No breakdown data to explain.
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="font-mono text-[9px] text-[#9ca3af] tracking-wider uppercase mb-4">
        Calculation Explanation
      </div>

      {breakdown.map((b, i) => {
        const traceStep = trace?.steps?.[i];
        return (
          <ExplainBreakdownItem
            key={i}
            ruleId={b.ruleId}
            modelUsed={traceStep?.modelUsed ?? b.modelUsed}
            contribution={typeof b.contribution === 'number' ? b.contribution : 0}
            detail={b.detail}
          />
        );
      })}

      {/* Grand total */}
      <div className="mt-6 pt-4 border-t-2 border-ink">
        <div className="flex items-center justify-between">
          <span className="font-sans text-sm text-[#9ca3af]">Grand Total</span>
          <span className="font-serif text-2xl font-bold text-ink">
            {fmt(Number(result.value))} <span className="text-sm font-mono text-[#9ca3af]">XOF</span>
          </span>
        </div>
        <div className="font-mono text-[10px] text-[#d1d5db] mt-1">
          {breakdown.length} rule{breakdown.length > 1 ? 's' : ''} evaluated
          {trace?.totalDurationMs != null && ` in ${trace.totalDurationMs}ms`}
        </div>
      </div>
    </div>
  );
}
