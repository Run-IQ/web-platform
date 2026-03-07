'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { RulesEditor } from './RulesEditor';
import { InputEditor } from './InputEditor';
import { ResultPanel } from './ResultPanel';
import { useEngine } from '@/hooks/useEngine';
import { examples, exampleKeys } from '@/lib/examples';
import { Tag } from '@/components/ui/Tag';

export function PlaygroundShell() {
  const [selectedExample, setSelectedExample] = useState(exampleKeys[0]);
  const [rulesText, setRulesText] = useState(examples[exampleKeys[0]].rules);
  const [inputText, setInputText] = useState(examples[exampleKeys[0]].input);
  const [validationStatus, setValidationStatus] = useState<
    'idle' | 'valid' | 'invalid'
  >('idle');

  const { result, error, loading, evaluate, validate } = useEngine();

  const handleExampleChange = useCallback(
    (key: string) => {
      const ex = examples[key];
      if (!ex) return;
      setSelectedExample(key);
      setRulesText(ex.rules);
      setInputText(ex.input);
      setValidationStatus('idle');
    },
    []
  );

  const handleReset = useCallback(() => {
    handleExampleChange(selectedExample);
  }, [selectedExample, handleExampleChange]);

  const handleEvaluate = useCallback(async () => {
    setValidationStatus('idle');
    await evaluate(rulesText, inputText);
  }, [rulesText, inputText, evaluate]);

  const handleValidate = useCallback(async () => {
    const valid = await validate(rulesText);
    setValidationStatus(valid ? 'valid' : 'invalid');
  }, [rulesText, validate]);

  return (
    <div className="h-screen flex flex-col bg-paper">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-rule bg-paper shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="font-serif text-lg font-bold tracking-tight text-ink no-underline"
          >
            RUN-IQ
          </Link>
          <Tag color="#6b7280">Playground</Tag>
        </div>

        <div className="flex items-center gap-3">
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
            onClick={handleEvaluate}
            disabled={loading}
            className="btn-primary"
            style={{ width: 'auto', padding: '10px 24px' }}
          >
            {loading ? 'Running...' : 'Evaluate'}
          </button>

          <button
            onClick={handleValidate}
            disabled={loading}
            className="btn-secondary"
            style={{ width: 'auto', padding: '10px 24px' }}
          >
            Validate
          </button>

          <button
            onClick={handleReset}
            className="btn-outline"
            style={{ padding: '10px 20px' }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* 3-panel layout */}
      <div className="flex-1 grid grid-cols-3 gap-px bg-rule min-h-0">
        {/* Rules editor */}
        <div className="flex flex-col bg-paper min-h-0">
          <div className="px-5 py-3 border-b border-rule">
            <span className="section-label">Rules (JSON)</span>
          </div>
          <div className="flex-1 min-h-0">
            <RulesEditor value={rulesText} onChange={setRulesText} />
          </div>
        </div>

        {/* Input editor */}
        <div className="flex flex-col bg-paper min-h-0">
          <div className="px-5 py-3 border-b border-rule">
            <span className="section-label">Input (JSON)</span>
          </div>
          <div className="flex-1 min-h-0">
            <InputEditor value={inputText} onChange={setInputText} />
          </div>
        </div>

        {/* Result panel */}
        <div className="flex flex-col bg-paper min-h-0">
          <div className="px-5 py-3 border-b border-rule">
            <span className="section-label">Result</span>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <ResultPanel
              result={result}
              error={error}
              loading={loading}
              validationStatus={validationStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
