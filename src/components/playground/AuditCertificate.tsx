'use client';

import { useState, useCallback, useEffect } from 'react';
import type { EvaluationResult } from '@run-iq/core';

async function computeSha256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

interface AuditCertificateProps {
  result: EvaluationResult;
  rulesText: string;
  inputText: string;
  onClose: () => void;
}

export function AuditCertificate({ result, rulesText, inputText, onClose }: AuditCertificateProps) {
  const [resultHash, setResultHash] = useState('...');
  const [inputHash, setInputHash] = useState('...');
  const [copied, setCopied] = useState(false);

  const timestamp = new Date().toISOString();
  const totalValue = Number(result.value);

  useEffect(() => {
    const serialized = JSON.stringify({
      requestId: result.requestId,
      value: result.value,
      breakdown: result.breakdown,
      appliedRules: result.appliedRules,
    });
    computeSha256(serialized).then(setResultHash);
    computeSha256(inputText).then(setInputHash);
  }, [result, inputText]);

  const ruleChecksums = (() => {
    try {
      const rules = JSON.parse(rulesText) as Array<{ id: string; checksum: string }>;
      return rules.map((r) => ({ id: r.id, checksum: r.checksum }));
    } catch {
      return [];
    }
  })();

  const proofJson = JSON.stringify(
    {
      certificate: 'RUN-IQ-AUDIT-PROOF',
      version: '1.0',
      timestamp,
      engine: {
        name: '@run-iq/core',
        mode: 'dryRun',
        plugin: '@run-iq/plugin-fiscal',
      },
      evaluation: {
        requestId: result.requestId,
        value: totalValue,
        rulesEvaluated: result.breakdown?.length ?? 0,
        rulesSkipped: result.skippedRules?.length ?? 0,
      },
      integrity: {
        resultHash: `sha256:${resultHash}`,
        inputHash: `sha256:${inputHash}`,
        ruleChecksums,
      },
    },
    null,
    2
  );

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(proofJson).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [proofJson]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-paper border-2 border-ink max-w-xl w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-4 text-center border-b-2 border-ink">
          <div className="font-mono text-[10px] text-[#9ca3af] tracking-[0.2em] uppercase mb-3">
            Run-IQ Evaluation Proof
          </div>
          <div className="font-serif text-2xl font-bold text-ink">
            Audit Certificate
          </div>
          <div className="stamp mt-4" style={{ display: 'inline-block', color: '#16a34a', borderColor: '#16a34a' }}>
            Verified
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-4">
          {/* Request */}
          <div className="flex justify-between font-mono text-xs">
            <span className="text-[#9ca3af]">Request ID</span>
            <span className="text-ink">{result.requestId}</span>
          </div>
          <div className="flex justify-between font-mono text-xs">
            <span className="text-[#9ca3af]">Timestamp</span>
            <span className="text-ink">{timestamp}</span>
          </div>
          <div className="flex justify-between font-mono text-xs">
            <span className="text-[#9ca3af]">Total Value</span>
            <span className="text-ink font-bold">{totalValue.toLocaleString('fr-FR')} XOF</span>
          </div>

          <div className="border-t border-[#e5e5e0] my-2" />

          {/* Integrity */}
          <div className="font-mono text-[9px] text-[#9ca3af] tracking-wider uppercase mb-2">
            Integrity Hashes
          </div>
          <div className="space-y-2">
            <div>
              <div className="font-mono text-[9px] text-[#9ca3af] uppercase">Result SHA-256</div>
              <div className="font-mono text-[10px] text-ink break-all bg-[#f5f5f2] px-3 py-2 border border-[#e5e5e0] rounded">
                {resultHash}
              </div>
            </div>
            <div>
              <div className="font-mono text-[9px] text-[#9ca3af] uppercase">Input SHA-256</div>
              <div className="font-mono text-[10px] text-ink break-all bg-[#f5f5f2] px-3 py-2 border border-[#e5e5e0] rounded">
                {inputHash}
              </div>
            </div>
          </div>

          {ruleChecksums.length > 0 && (
            <>
              <div className="font-mono text-[9px] text-[#9ca3af] tracking-wider uppercase mt-4 mb-2">
                Rule Checksums
              </div>
              <div className="space-y-1">
                {ruleChecksums.map((rc) => (
                  <div key={rc.id} className="flex gap-2 font-mono text-[10px]">
                    <span className="text-[#9ca3af] w-[140px] shrink-0 truncate">{rc.id}</span>
                    <span className="text-ink truncate">{rc.checksum}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-[#e5e5e0] flex items-center justify-between bg-[#f5f5f2]">
          <button
            onClick={handleCopy}
            className="btn-outline"
            style={{ padding: '8px 20px', width: 'auto' }}
          >
            {copied ? 'Copied' : 'Copy Proof JSON'}
          </button>
          <button
            onClick={onClose}
            className="font-mono text-[10px] text-[#9ca3af] tracking-wider uppercase hover:text-ink transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
