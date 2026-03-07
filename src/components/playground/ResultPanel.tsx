'use client';

import { useState } from 'react';
import type { EvaluationResult } from '@run-iq/core';

interface BracketDetail {
  from: number;
  to: number | null;
  rate: number;
  taxable: number;
  contribution: number;
}

function DetailView({ detail }: { detail: unknown }) {
  if (!detail || typeof detail !== 'object') return null;
  const d = detail as Record<string, unknown>;

  // Progressive bracket breakdown
  if (Array.isArray(d['brackets'])) {
    const brackets = d['brackets'] as BracketDetail[];
    return (
      <div className="ml-3 mt-1 mb-1 pl-3 border-l border-[#e5e5e0]">
        {brackets.map((br, j) => (
          <div key={j} className="flex justify-between text-[9px] text-[#9ca3af] leading-5">
            <span>
              {br.from.toLocaleString()}
              {br.to != null ? ` — ${br.to.toLocaleString()}` : '+'}
              {' '}@ {(br.rate * 100).toFixed(1)}%
            </span>
            <span className="text-[#6b7280]">
              {br.contribution.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // Minimum tax detail
  if (typeof d['appliedMinimum'] === 'boolean') {
    return (
      <div className="ml-3 mt-1 text-[9px] text-[#9ca3af] leading-5">
        <span>computed: {Number(d['computed']).toLocaleString()}</span>
        {' · '}
        <span>minimum: {Number(d['minimum']).toLocaleString()}</span>
        {d['appliedMinimum'] && (
          <span className="ml-1 text-amber-500">(minimum applied)</span>
        )}
      </div>
    );
  }

  // Threshold detail
  if (typeof d['belowThreshold'] === 'boolean') {
    return (
      <div className="ml-3 mt-1 text-[9px] text-[#9ca3af] leading-5">
        <span>threshold: {Number(d['threshold']).toLocaleString()}</span>
        {d['belowThreshold'] ? (
          <span className="ml-1 text-[#9ca3af]">(below threshold)</span>
        ) : (
          <>
            {' · '}
            <span>taxable: {Number(d['taxableAmount']).toLocaleString()}</span>
          </>
        )}
      </div>
    );
  }

  // Composite steps
  if (Array.isArray(d['steps'])) {
    const steps = d['steps'] as Array<{ model: string; label?: string; value: number; detail?: unknown }>;
    return (
      <div className="ml-3 mt-1 pl-3 border-l border-[#e5e5e0]">
        {steps.map((s, j) => (
          <div key={j}>
            <div className="flex justify-between text-[9px] text-[#9ca3af] leading-5">
              <span>{s.label ?? s.model}</span>
              <span className="text-[#6b7280]">{s.value.toLocaleString()}</span>
            </div>
            {s.detail != null && <DetailView detail={s.detail} />}
          </div>
        ))}
        {d['aggregation'] != null && (
          <div className="text-[8px] text-[#d1d5db] uppercase tracking-wider mt-0.5">
            {String(d['aggregation'])}
          </div>
        )}
      </div>
    );
  }

  return null;
}

interface ResultPanelProps {
  result: EvaluationResult | null;
  error: string | null;
  loading: boolean;
  validationStatus: 'idle' | 'valid' | 'invalid';
}

export function ResultPanel({
  result,
  error,
  loading,
  validationStatus,
}: ResultPanelProps) {
  const [showDetail, setShowDetail] = useState(true);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center font-mono text-xs text-[#9ca3af]">
        <div className="text-center">
          <div className="text-2xl mb-2 animate-pulse">&middot;</div>
          <div className="text-[10px] tracking-wider uppercase">
            Evaluating...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full p-6">
        <div className="font-mono text-[10px] text-red-500 tracking-wider uppercase mb-3">
          Error
        </div>
        <pre className="font-mono text-xs text-red-400 whitespace-pre-wrap break-words leading-relaxed">
          {error}
        </pre>
      </div>
    );
  }

  if (validationStatus === 'valid') {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="stamp" style={{ color: '#16a34a', borderColor: '#16a34a' }}>
            Rules Valid
          </div>
          <p className="font-mono text-[10px] text-[#9ca3af] mt-4">
            All rules pass structural validation.
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="h-full flex items-center justify-center font-mono text-xs text-[#d1d5db]">
        <div className="text-center">
          <div className="text-3xl mb-2">&middot;</div>
          <div className="text-[10px] tracking-wider">AWAITING EVALUATION</div>
        </div>
      </div>
    );
  }

  const breakdown = result.breakdown ?? [];
  const total = result.value ?? 0;
  const trace = result.trace;
  const hasDetail = breakdown.some((b) => b.detail != null) ||
    (trace?.steps?.some((s) => s.detail != null) ?? false);

  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="font-mono text-[11px] leading-8">
        {/* Summary */}
        <div className="mb-4 pb-3 border-b border-rule">
          <div>
            <span className="text-[#9ca3af]">rules evaluated</span>{' '}
            <span className="text-ink font-semibold">
              {trace?.steps?.length ?? '?'}
            </span>
          </div>
          <div>
            <span className="text-[#9ca3af]">skipped</span>{' '}
            <span className="text-ink">
              {result.skippedRules?.length ?? 0}
            </span>
          </div>
        </div>

        {/* Detail toggle */}
        {hasDetail && (
          <div className="mb-3">
            <button
              onClick={() => setShowDetail((v) => !v)}
              className="font-mono text-[9px] text-[#9ca3af] tracking-wider uppercase hover:text-ink transition-colors"
            >
              {showDetail ? '▾ Hide detail' : '▸ Show detail'}
            </button>
          </div>
        )}

        {/* Breakdown */}
        {breakdown.length > 0 && (
          <div className="mb-4">
            <div className="font-mono text-[9px] text-[#9ca3af] tracking-wider uppercase mb-2">
              Breakdown
            </div>
            {breakdown.map((b, i) => (
              <div key={i} className="mb-2">
                <div className="flex justify-between mb-0.5">
                  <span className="text-[#9ca3af] text-[10px]">
                    {b.label ?? b.ruleId}
                  </span>
                  <span className="text-[#4b5563]">
                    {typeof b.contribution === 'number'
                      ? b.contribution.toLocaleString()
                      : String(b.contribution)}
                  </span>
                </div>
                {showDetail && b.detail != null ? <DetailView detail={b.detail} /> : null}
              </div>
            ))}
          </div>
        )}

        {/* Total */}
        <div className="border-t-2 border-ink pt-3 flex justify-between items-center">
          <span className="text-[#9ca3af]">total</span>
          <span className="text-lg font-bold font-serif">
            {typeof total === 'number' ? total.toLocaleString() : String(total)}
          </span>
        </div>

        {/* Trace steps */}
        {trace?.steps && trace.steps.length > 0 && (
          <div className="mt-4 pt-3 border-t border-rule">
            <div className="font-mono text-[9px] text-[#9ca3af] tracking-wider uppercase mb-2">
              Trace
            </div>
            {trace.steps.map((step, i) => (
              <div key={i} className="mb-1 text-[10px]">
                <span className="text-[#9ca3af]">{step.ruleId}</span>{' '}
                <span className="text-ink">{step.modelUsed}</span>{' '}
                <span className="text-[#6b7280]">
                  &rarr; {typeof step.contribution === 'number' ? step.contribution.toLocaleString() : String(step.contribution)}
                </span>
                {step.durationMs !== undefined && (
                  <span className="text-[#d1d5db] ml-2">
                    {step.durationMs}ms
                  </span>
                )}
                {showDetail && step.detail != null ? <DetailView detail={step.detail} /> : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
