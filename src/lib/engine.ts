import { PPEEngine } from '@run-iq/core';
import { FiscalPlugin } from '@run-iq/plugin-fiscal';
import { JsonLogicEvaluator } from '@run-iq/dsl-jsonlogic';

export function createBrowserEngine(): PPEEngine {
  return new PPEEngine({
    plugins: [new FiscalPlugin()],
    dsls: [new JsonLogicEvaluator()],
    snapshot: undefined,
    strict: false,
    dryRun: true,
    onChecksumMismatch: 'skip',
  });
}
