'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Tag } from '@/components/ui/Tag';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper/97 backdrop-blur-sm px-4 md:px-8 py-4 md:py-5">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="font-serif text-[22px] font-bold tracking-tight">
            RUN-IQ
          </span>
          <Tag color="#6b7280">v0.3.1-stable</Tag>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden font-mono text-xs text-muted p-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? 'CLOSE' : 'MENU'}
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-9 items-center">
          <a className="nav-link" href="#how-it-works">How it works</a>
          <a className="nav-link" href="#plugins">Plugins</a>
          <Link className="nav-link" href="/playground">Playground</Link>
          <a className="nav-link" href="https://github.com/Run-IQ" target="_blank" rel="noopener noreferrer">GitHub</a>
        </nav>
        <div className="hidden md:block">
          <a href="/docs" className="nav-doc-btn">Documentation</a>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {menuOpen && (
        <nav className="md:hidden flex flex-col gap-4 pt-4 pb-2 border-t border-rule mt-4">
          <a className="nav-link" href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
          <a className="nav-link" href="#plugins" onClick={() => setMenuOpen(false)}>Plugins</a>
          <Link className="nav-link" href="/playground" onClick={() => setMenuOpen(false)}>Playground</Link>
          <a className="nav-link" href="https://github.com/Run-IQ" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="/docs" className="nav-doc-btn self-start mt-2">Documentation</a>
        </nav>
      )}
    </header>
  );
}
