'use client';

import { useState, useRef, useCallback } from 'react';
import type { EvaluationResult } from '@run-iq/core';
import { hydrateRules } from '@run-iq/core';

interface EngineState {
  result: EvaluationResult | null;
  error: string | null;
  loading: boolean;
}

export function useEngine() {
  const [state, setState] = useState<EngineState>({
    result: null,
    error: null,
    loading: false,
  });
  const engineRef = useRef<import('@run-iq/core').PPEEngine | null>(null);

  const getEngine = useCallback(async () => {
    if (!engineRef.current) {
      const { createBrowserEngine } = await import('@/lib/engine');
      engineRef.current = createBrowserEngine();
    }
    return engineRef.current;
  }, []);

  const evaluate = useCallback(
    async (rulesJson: string, inputJson: string) => {
      setState({ result: null, error: null, loading: true });
      try {
        const rawRules = JSON.parse(rulesJson);
        const input = JSON.parse(inputJson);
        // Stamp a unique requestId per evaluation to avoid idempotence conflicts
        input.requestId = `${input.requestId}-${Date.now()}`;
        const rules = hydrateRules(rawRules);
        const engine = await getEngine();
        const result = await engine.evaluate(rules, input);
        setState({ result, error: null, loading: false });
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setState({ result: null, error: message, loading: false });
        return null;
      }
    },
    [getEngine]
  );

  const validate = useCallback(
    async (rulesJson: string) => {
      setState((prev) => ({ ...prev, error: null, loading: true }));
      try {
        const rules = JSON.parse(rulesJson);
        // Validation runs through evaluate with empty input to test rule parsing
        const engine = await getEngine();
        // Simple validation: parse and check structure
        if (!Array.isArray(rules)) {
          setState({
            result: null,
            error: 'Rules must be an array',
            loading: false,
          });
          return false;
        }
        for (const rule of rules) {
          if (!rule.id || !rule.model || !rule.params) {
            setState({
              result: null,
              error: `Rule ${rule.id || '(no id)'} missing required fields: id, model, params`,
              loading: false,
            });
            return false;
          }
        }
        void engine; // engine loaded for side-effect (plugin registration)
        setState((prev) => ({ ...prev, loading: false }));
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setState({ result: null, error: message, loading: false });
        return false;
      }
    },
    [getEngine]
  );

  return { ...state, evaluate, validate };
}
