'use client';

import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@monaco-editor/react').then((m) => m.default), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center font-mono text-xs text-[#9ca3af]">
      Loading editor...
    </div>
  ),
});

interface RulesEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function RulesEditor({ value, onChange }: RulesEditorProps) {
  return (
    <Editor
      height="100%"
      language="json"
      theme="vs-dark"
      value={value}
      onChange={(v) => onChange(v ?? '')}
      options={{
        minimap: { enabled: false },
        fontSize: 12,
        fontFamily: "'DM Mono', monospace",
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        tabSize: 2,
        padding: { top: 12 },
      }}
    />
  );
}
