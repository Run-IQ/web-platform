'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { FormView } from './FormView';
import { ExplainView } from './ExplainView';
import { RulesEditor } from './RulesEditor';
import { DiffIndicator } from './DiffIndicator';
import { useEngine } from '@/hooks/useEngine';
import { examples, exampleKeys } from '@/lib/examples';
import { Tag } from '@/components/ui/Tag';
import type { EvaluationResult } from '@run-iq/core';

function ScenarioPanel({
  label,
  inputText,
  onChange,
  result,
  error,
  loading,
}: {
  label: string;
  inputText: string;
  onChange: (v: string) => void;
  result: EvaluationResult | null;
  error: string | null;
  loading: boolean;
}) {
  return (
    <div className="flex flex-col border border-rule bg-paper min-h-0 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-rule bg-[#f5f5f2] flex items-center justify-between shrink-0">
        <span className="font-mono text-[10px] tracking-wider uppercase text-[#9ca3af]">
          {label}
        </span>
        {loading && (
          <span className="font-mono text-[9px] text-[#9ca3af] animate-pulse uppercase tracking-wider">
            Evaluating...
          </span>
        )}
      </div>

      {/* Form input */}
      <div className="border-b border-rule shrink-0 max-h-[300px] overflow-y-auto">
        <FormView inputText={inputText} onChange={onChange} />
      </div>

      {/* Result */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {error ? (
          <div className="p-5">
            <pre className="font-mono text-xs text-red-400 whitespace-pre-wrap">{error}</pre>
          </div>
        ) : result ? (
          <ExplainView result={result} />
        ) : (
          <div className="flex items-center justify-center h-full font-mono text-xs text-[#d1d5db]">
            <div className="text-center">
              <div className="text-2xl mb-2">&middot;</div>
              <div className="text-[10px] tracking-wider uppercase">Click Compare</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function CompareShell() {
  const [selectedExample, setSelectedExample] = useState(exampleKeys[0]);
  const [rulesText, setRulesText] = useState(examples[exampleKeys[0]].rules);
  const [inputA, setInputA] = useState(examples[exampleKeys[0]].input);
  const [inputB, setInputB] = useState(examples[exampleKeys[0]].input);
  const [showRules, setShowRules] = useState(false);

  const engineA = useEngine();
  const engineB = useEngine();

  const handleExampleChange = useCallback((key: string) => {
    const ex = examples[key];
    if (!ex) return;
    setSelectedExample(key);
    setRulesText(ex.rules);
    setInputA(ex.input);
    setInputB(ex.input);
  }, []);

  const handleCompare = useCallback(async () => {
    await Promise.all([
      engineA.evaluate(rulesText, inputA),
      engineB.evaluate(rulesText, inputB),
    ]);
  }, [rulesText, inputA, inputB, engineA, engineB]);

  const loading = engineA.loading || engineB.loading;
  const totalA = engineA.result ? Number(engineA.result.value) : null;
  const totalB = engineB.result ? Number(engineB.result.value) : null;

  return (
    <div className="h-screen flex flex-col bg-paper">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between px-4 lg:px-6 py-3 border-b border-rule bg-paper shrink-0 gap-3">
        <div className="flex items-center gap-4">
          <Link
            href="/playground"
            className="font-serif text-lg font-bold tracking-tight text-ink no-underline"
          >
            RUN-IQ
          </Link>
          <Tag color="#6b7280">Compare</Tag>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowRules(!showRules)}
            className={`btn-outline ${showRules ? 'bg-[#f5f5f2]' : ''}`}
            style={{ padding: '10px 16px' }}
          >
            {showRules ? 'Hide Rules' : 'Show Rules'}
          </button>

          <select
            className="styled"
            value={selectedExample}
            onChange={(e) => handleExampleChange(e.target.value)}
          >
            {exampleKeys.map((key) => (
              <option key={key} value={key}>
                {examples[key].label}
              </option>
            ))}
          </select>

          <button
            onClick={handleCompare}
            disabled={loading}
            className="btn-primary"
            style={{ width: 'auto', padding: '10px 24px' }}
          >
            {loading ? 'Comparing...' : 'Compare'}
          </button>

          <Link
            href="/playground"
            className="btn-outline no-underline"
            style={{ padding: '10px 20px' }}
          >
            Back
          </Link>
        </div>
      </div>

      {/* Diff summary bar */}
      {totalA !== null && totalB !== null && (
        <div className="px-6 py-3 border-b border-rule bg-[#f5f5f2] flex items-center justify-center gap-8 shrink-0">
          <div className="font-mono text-xs text-[#9ca3af]">
            A: <span className="text-ink font-semibold">{totalA.toLocaleString('fr-FR')}</span>
          </div>
          <DiffIndicator valueA={totalA} valueB={totalB} />
          <div className="font-mono text-xs text-[#9ca3af]">
            B: <span className="text-ink font-semibold">{totalB.toLocaleString('fr-FR')}</span>
          </div>
          {totalA !== 0 && (
            <div className="font-mono text-[10px] text-[#9ca3af]">
              Effective rate: A {((totalA / getBase(inputA)) * 100).toFixed(1)}%
              {' / '}B {((totalB / getBase(inputB)) * 100).toFixed(1)}%
            </div>
          )}
        </div>
      )}

      {/* Side-by-side panels */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 bg-rule">
        {showRules && (
          <div className="w-full md:w-1/3 border-r border-rule bg-paper flex flex-col min-h-0">
            <div className="px-5 py-3 border-b border-rule bg-[#f5f5f2] flex items-center justify-between shrink-0">
              <span className="font-mono text-[10px] tracking-wider uppercase text-[#9ca3af]">
                Rules
              </span>
            </div>
            <div className="flex-1 min-h-0">
              <RulesEditor value={rulesText} onChange={setRulesText} />
            </div>
          </div>
        )}
        <div className={`flex-1 grid grid-cols-1 ${showRules ? 'md:grid-cols-1 lg:grid-cols-2' : 'md:grid-cols-2'} gap-px bg-rule min-h-0`}>
          <ScenarioPanel
            label="Scenario A"
            inputText={inputA}
            onChange={setInputA}
            result={engineA.result}
            error={engineA.error}
            loading={engineA.loading}
          />
          <ScenarioPanel
            label="Scenario B"
            inputText={inputB}
            onChange={setInputB}
            result={engineB.result}
            error={engineB.error}
            loading={engineB.loading}
          />
        </div>
      </div>
    </div>
  );
}

/** Extract the first numeric data value as a rough "base" for effective rate */
function getBase(inputJson: string): number {
  try {
    const parsed = JSON.parse(inputJson);
    const data = parsed?.data;
    if (!data) return 1;
    for (const val of Object.values(data as Record<string, unknown>)) {
      if (typeof val === 'number' && val > 0) return val;
    }
    return 1;
  } catch {
    return 1;
  }
}
