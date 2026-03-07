'use client';

interface DiffIndicatorProps {
  valueA: number;
  valueB: number;
}

export function DiffIndicator({ valueA, valueB }: DiffIndicatorProps) {
  const diff = valueB - valueA;
  const pctDiff = valueA !== 0 ? ((diff / valueA) * 100) : 0;

  if (diff === 0) {
    return (
      <span className="font-mono text-[10px] text-[#9ca3af]">=</span>
    );
  }

  const isUp = diff > 0;
  const color = isUp ? '#dc2626' : '#16a34a';
  const arrow = isUp ? '\u25B2' : '\u25BC';

  return (
    <span className="font-mono text-[10px] font-semibold" style={{ color }}>
      {arrow} {isUp ? '+' : ''}{diff.toLocaleString('fr-FR')}
      {valueA !== 0 && (
        <span className="ml-1 font-normal">
          ({isUp ? '+' : ''}{pctDiff.toFixed(1)}%)
        </span>
      )}
    </span>
  );
}
