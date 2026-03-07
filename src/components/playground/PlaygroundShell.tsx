'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { RulesEditor } from './RulesEditor';
import { InputEditor } from './InputEditor';
import { FormView } from './FormView';
import { ResultPanel } from './ResultPanel';
import { ExplainView } from './ExplainView';
import { AuditCertificate } from './AuditCertificate';
import { useEngine } from '@/hooks/useEngine';
import { examples, exampleKeys } from '@/lib/examples';
import { Tag } from '@/components/ui/Tag';

type InputMode = 'json' | 'form';
type ResultMode = 'raw' | 'explain';

export function PlaygroundShell() {
  const [selectedExample, setSelectedExample] = useState(exampleKeys[0]);
  const [rulesText, setRulesText] = useState(examples[exampleKeys[0]].rules);
  const [inputText, setInputText] = useState(examples[exampleKeys[0]].input);
  const [validationStatus, setValidationStatus] = useState<
    'idle' | 'valid' | 'invalid'
  >('idle');
  const [inputMode, setInputMode] = useState<InputMode>('json');
  const [resultMode, setResultMode] = useState<ResultMode>('raw');
  const [showCertificate, setShowCertificate] = useState(false);

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
          {/* Loaded plugin indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f5f5f2] border border-[#e5e5e0] rounded text-[#9ca3af] cursor-default select-none">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span className="font-mono text-[10px] uppercase tracking-wider">
              Fiscal Plugin
            </span>
          </div>

          <div className="w-px h-6 bg-[#e5e5e0]" />

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

        {/* Input panel — JSON or Form */}
        <div className="flex flex-col bg-paper min-h-0">
          <div className="px-5 py-3 border-b border-rule flex items-center justify-between">
            <span className="section-label">Input</span>
            <div className="flex items-center bg-[#f5f5f2] border border-[#e5e5e0] rounded overflow-hidden">
              <button
                onClick={() => setInputMode('json')}
                className={`px-3 py-1 font-mono text-[9px] uppercase tracking-wider transition-colors ${
                  inputMode === 'json'
                    ? 'bg-ink text-paper'
                    : 'text-[#9ca3af] hover:text-ink'
                }`}
              >
                JSON
              </button>
              <button
                onClick={() => setInputMode('form')}
                className={`px-3 py-1 font-mono text-[9px] uppercase tracking-wider transition-colors ${
                  inputMode === 'form'
                    ? 'bg-ink text-paper'
                    : 'text-[#9ca3af] hover:text-ink'
                }`}
              >
                Form
              </button>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            {inputMode === 'json' ? (
              <InputEditor value={inputText} onChange={setInputText} />
            ) : (
              <FormView inputText={inputText} onChange={setInputText} />
            )}
          </div>
        </div>

        {/* Result panel */}
        <div className="flex flex-col bg-paper min-h-0">
          <div className="px-5 py-3 border-b border-rule flex items-center justify-between">
            <span className="section-label">Result</span>
            <div className="flex items-center gap-2">
              {result && (
                <>
                  <div className="flex items-center bg-[#f5f5f2] border border-[#e5e5e0] rounded overflow-hidden">
                    <button
                      onClick={() => setResultMode('raw')}
                      className={`px-3 py-1 font-mono text-[9px] uppercase tracking-wider transition-colors ${
                        resultMode === 'raw'
                          ? 'bg-ink text-paper'
                          : 'text-[#9ca3af] hover:text-ink'
                      }`}
                    >
                      Data
                    </button>
                    <button
                      onClick={() => setResultMode('explain')}
                      className={`px-3 py-1 font-mono text-[9px] uppercase tracking-wider transition-colors ${
                        resultMode === 'explain'
                          ? 'bg-ink text-paper'
                          : 'text-[#9ca3af] hover:text-ink'
                      }`}
                    >
                      Explain
                    </button>
                  </div>
                  <button
                    onClick={() => setShowCertificate(true)}
                    className="flex items-center gap-1 px-2 py-1 font-mono text-[9px] text-[#9ca3af] uppercase tracking-wider
                      border border-[#e5e5e0] rounded hover:border-ink hover:text-ink transition-colors"
                    title="View audit proof"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    Proof
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            {result && resultMode === 'explain' ? (
              <ExplainView result={result} />
            ) : (
              <ResultPanel
                result={result}
                error={error}
                loading={loading}
                validationStatus={validationStatus}
              />
            )}
          </div>
        </div>
      </div>

      {/* Audit Certificate Modal */}
      {showCertificate && result && (
        <AuditCertificate
          result={result}
          rulesText={rulesText}
          inputText={inputText}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
}
