import Link from 'next/link';

export function DocsHeader() {
  return (
    <header className="sticky top-0 z-30 bg-paper/95 backdrop-blur border-b border-rule px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link
          href="/docs"
          className="font-mono text-[10px] uppercase tracking-wider text-[#9ca3af] hover:text-ink transition-colors no-underline"
        >
          Documentation
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="/playground"
          className="font-mono text-[10px] uppercase tracking-wider text-[#9ca3af] hover:text-ink transition-colors no-underline"
        >
          Playground
        </Link>
        <a
          href="https://github.com/Run-IQ"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[10px] uppercase tracking-wider text-[#9ca3af] hover:text-ink transition-colors no-underline"
        >
          GitHub
        </a>
      </div>
    </header>
  );
}
