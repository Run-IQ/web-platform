'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { docsNav } from '@/lib/docs-nav';

export function DocsSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <nav className="space-y-6">
      {docsNav.map((group) => (
        <div key={group.label}>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9ca3af] mb-2 px-3">
            {group.label}
          </div>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-1.5 text-sm no-underline rounded transition-colors ${
                      active
                        ? 'bg-ink text-paper font-semibold'
                        : 'text-ink/70 hover:text-ink hover:bg-[#f5f5f2]'
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-3
          bg-ink text-paper font-mono text-[10px] uppercase tracking-wider
          shadow-lg hover:bg-[#1f1f1f] transition-colors rounded"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {mobileOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
        Docs
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/20"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — desktop: static, mobile: slide-in */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-paper border-r border-rule
          overflow-y-auto py-6 px-3 transition-transform duration-200
          lg:sticky lg:translate-x-0 lg:shrink-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="mb-6 px-3">
          <Link
            href="/"
            className="font-serif text-lg font-bold tracking-tight text-ink no-underline"
          >
            RUN-IQ
          </Link>
          <span className="ml-2 font-mono text-[9px] uppercase tracking-wider text-[#9ca3af] border border-[#e5e5e0] px-1.5 py-0.5">
            Docs
          </span>
        </div>
        {sidebar}
      </aside>
    </>
  );
}
