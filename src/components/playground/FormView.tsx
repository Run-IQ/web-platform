'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface FormField {
  key: string;
  label: string;
  type: 'number' | 'text';
}

function deriveFields(inputJson: string): { dataFields: FormField[]; metaFields: FormField[] } {
  try {
    const parsed = JSON.parse(inputJson);
    const data = parsed?.data;
    const meta = parsed?.meta;
    const context = meta?.context;
    
    const dataFields: FormField[] = [];
    const metaFields: FormField[] = [];

    if (data && typeof data === 'object') {
      for (const [key, val] of Object.entries(data as Record<string, unknown>)) {
        if (val !== null && typeof val === 'object') continue;
        dataFields.push({
          key,
          label: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          type: typeof val === 'number' ? 'number' : 'text',
        });
      }
    }
    
    if (meta && typeof meta === 'object') {
      for (const [key, val] of Object.entries(meta as Record<string, unknown>)) {
        if (key === 'context') continue; // Handled separately below
        if (val !== null && typeof val === 'object') continue;
        metaFields.push({
          key,
          label: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          type: typeof val === 'number' ? 'number' : 'text',
        });
      }
    }

    // Flatten context fields into metaFields with a prefix
    if (context && typeof context === 'object') {
      for (const [key, val] of Object.entries(context as Record<string, unknown>)) {
        if (val !== null && typeof val === 'object') continue;
        metaFields.push({
          key: `context.${key}`,
          label: `Context: ${key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}`,
          type: typeof val === 'number' ? 'number' : 'text',
        });
      }
    }
    
    return { dataFields, metaFields };
  } catch {
    return { dataFields: [], metaFields: [] };
  }
}

interface FormViewProps {
  inputText: string;
  onChange: (json: string) => void;
}

export function FormView({ inputText, onChange }: FormViewProps) {
  const { dataFields, metaFields } = deriveFields(inputText);
  const [dataValues, setDataValues] = useState<Record<string, string>>({});
  const [metaValues, setMetaValues] = useState<Record<string, string>>({});
  // Track the source of the last inputText change to avoid feedback loops
  const selfUpdate = useRef(false);

  // Sync form values when inputText changes externally (example switch)
  useEffect(() => {
    if (selfUpdate.current) {
      selfUpdate.current = false;
      return;
    }
    try {
      const parsed = JSON.parse(inputText);
      const data = parsed?.data ?? {};
      const meta = parsed?.meta ?? {};
      const context = meta?.context ?? {};
      
      const dv: Record<string, string> = {};
      for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
        if (v !== null && typeof v === 'object') continue;
        dv[k] = v === null || v === undefined ? '' : String(v);
      }
      
      const mv: Record<string, string> = {};
      // Regular meta
      for (const [k, v] of Object.entries(meta as Record<string, unknown>)) {
        if (k === 'context') continue;
        if (v !== null && typeof v === 'object') continue;
        mv[k] = v === null || v === undefined ? '' : String(v);
      }
      // Context meta
      for (const [k, v] of Object.entries(context as Record<string, unknown>)) {
        if (v !== null && typeof v === 'object') continue;
        mv[`context.${k}`] = v === null || v === undefined ? '' : String(v);
      }
      
      setDataValues(dv);
      setMetaValues(mv);
    } catch {
      // ignore
    }
  }, [inputText]);

  const rebuildJson = useCallback(
    (nextData: Record<string, string>, nextMeta: Record<string, string>) => {
      try {
        const parsed = JSON.parse(inputText);
        if (!parsed.data) parsed.data = {};
        if (!parsed.meta) parsed.meta = {};
        if (!parsed.meta.context) parsed.meta.context = {};

        for (const field of dataFields) {
          const raw = nextData[field.key] ?? '';
          if (field.type === 'number') {
            if (raw === '') {
              parsed.data[field.key] = 0;
            } else {
              const num = Number(raw);
              parsed.data[field.key] = isNaN(num) ? raw : num;
            }
          } else {
            parsed.data[field.key] = raw;
          }
        }
        
        for (const [key, raw] of Object.entries(nextMeta)) {
          if (key.startsWith('context.')) {
            const contextKey = key.split('.')[1];
            parsed.meta.context[contextKey] = raw;
          } else {
            parsed.meta[key] = raw;
          }
        }
        
        selfUpdate.current = true;
        onChange(JSON.stringify(parsed, null, 2));
      } catch {
        // ignore
      }
    },
    [inputText, dataFields, onChange]
  );

  const handleDataChange = useCallback(
    (key: string, raw: string) => {
      const next = { ...dataValues, [key]: raw };
      setDataValues(next);
      rebuildJson(next, metaValues);
    },
    [dataValues, metaValues, rebuildJson]
  );

  const handleMetaChange = useCallback(
    (key: string, raw: string) => {
      const next = { ...metaValues, [key]: raw };
      setMetaValues(next);
      rebuildJson(dataValues, next);
    },
    [dataValues, metaValues, rebuildJson]
  );

  if (dataFields.length === 0 && metaFields.length === 0) {
    return (
      <div className="h-full flex items-center justify-center font-mono text-xs text-[#9ca3af] p-6">
        No input fields detected.
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Data fields */}
      <div className="space-y-4">
        {dataFields.map((field) => {
          const raw = dataValues[field.key] ?? '';
          const isNumber = field.type === 'number';
          const numVal = Number(raw);
          const showFormatted = isNumber && raw !== '' && !isNaN(numVal) && numVal > 999;

          return (
            <div key={field.key}>
              <label className="block font-mono text-[10px] text-[#9ca3af] tracking-wider uppercase mb-1.5">
                {field.label}
              </label>
              <input
                type="text"
                inputMode={isNumber ? 'numeric' : 'text'}
                value={raw}
                onChange={(e) => handleDataChange(field.key, e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#e5e5e0] rounded font-mono text-sm text-ink
                  focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink
                  placeholder:text-[#d1d5db] transition-colors"
              />
              {showFormatted && (
                <div className="mt-1 font-mono text-[10px] text-[#9ca3af]">
                  {numVal.toLocaleString('fr-FR')}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Meta fields */}
      {metaFields.length > 0 && (
        <>
          <div className="font-mono text-[9px] text-[#d1d5db] tracking-wider uppercase mt-6 mb-3 pt-4 border-t border-[#e5e5e0]">
            Metadata
          </div>
          <div className="space-y-3">
            {metaFields.map((field) => (
              <div key={field.key}>
                <label className="block font-mono text-[10px] text-[#d1d5db] tracking-wider uppercase mb-1">
                  {field.label}
                </label>
                <input
                  type="text"
                  value={metaValues[field.key] ?? ''}
                  onChange={(e) => handleMetaChange(field.key, e.target.value)}
                  className="w-full px-3 py-2 bg-[#f5f5f2] border border-[#e5e5e0] rounded font-mono text-xs text-[#6b7280]
                    focus:outline-none focus:border-[#9ca3af] transition-colors"
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
