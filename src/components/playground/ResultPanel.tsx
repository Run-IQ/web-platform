'use client';

import type { EvaluationResult } from '@run-iq/core';

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

        {/* Breakdown */}
        {breakdown.length > 0 && (
          <div className="mb-4">
            <div className="font-mono text-[9px] text-[#9ca3af] tracking-wider uppercase mb-2">
              Breakdown
            </div>
            {breakdown.map((b, i) => (
              <div key={i} className="flex justify-between mb-1">
                <span className="text-[#9ca3af] text-[10px]">
                  {b.label ?? b.ruleId}
                </span>
                <span className="text-[#4b5563]">
                  {typeof b.contribution === 'number'
                    ? b.contribution.toLocaleString()
                    : String(b.contribution)}
                </span>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
