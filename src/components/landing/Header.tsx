'use client';

import Link from 'next/link';
import { Tag } from '@/components/ui/Tag';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper/97 backdrop-blur-sm px-8 py-5">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="font-serif text-[22px] font-bold tracking-tight">
            RUN-IQ
          </span>
          <Tag color="#6b7280">v0.1.0-alpha</Tag>
        </div>
        <nav className="flex gap-9 items-center">
          <a className="nav-link" href="#how-it-works">
            How it works
          </a>
          <a className="nav-link" href="#plugins">
            Plugins
          </a>
          <Link className="nav-link" href="/playground">
            Playground
          </Link>
          <a
            className="nav-link"
            href="https://github.com/Run-IQ"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </nav>
        <div>
          <a href="#docs" className="nav-doc-btn">
            Documentation
          </a>
        </div>
      </div>
    </header>
  );
}
