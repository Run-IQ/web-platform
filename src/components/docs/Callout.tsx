interface CalloutProps {
  type?: 'info' | 'warning' | 'tip';
  title?: string;
  children: React.ReactNode;
}

const styles = {
  info: { border: '#3b82f6', bg: '#eff6ff', icon: 'i' },
  warning: { border: '#f59e0b', bg: '#fffbeb', icon: '!' },
  tip: { border: '#10b981', bg: '#ecfdf5', icon: '*' },
};

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const s = styles[type];
  return (
    <div
      className="my-4 rounded px-5 py-4 text-sm"
      style={{ borderLeft: `3px solid ${s.border}`, background: s.bg }}
    >
      {title && (
        <div className="font-mono text-[10px] uppercase tracking-wider font-bold mb-1" style={{ color: s.border }}>
          {title}
        </div>
      )}
      <div className="font-serif text-ink/90 leading-relaxed [&>p]:mb-0">{children}</div>
    </div>
  );
}
