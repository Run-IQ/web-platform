import { Tag } from '@/components/ui/Tag';

const PACKAGES = [
  '@run-iq/core',
  '@run-iq/plugin-sdk',
  '@run-iq/dsl-jsonlogic',
  '@run-iq/plugin-fiscal',
];

const RESOURCES = [
  { label: 'Documentation', href: '#' },
  { label: 'Architecture spec', href: '#' },
  { label: 'GitHub', href: 'https://github.com/Run-IQ' },
  { label: 'Changelog', href: '#' },
];

const LEGAL = [
  { label: 'MIT License', href: '#' },
  { label: 'Source-Available terms', href: '#' },
  { label: 'Security policy', href: '#' },
  { label: 'Pricing', href: '#' },
];

export function Footer() {
  return (
    <footer className="bg-[#f4f4f1] text-ink border-t border-rule pt-[72px] pb-10 px-8">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-16">
          {/* Brand */}
          <div>
            <div className="font-serif text-2xl font-bold mb-4 tracking-tight">
              RUN-IQ
            </div>
            <p className="font-serif text-[17px] text-muted leading-relaxed mb-6 max-w-[260px]">
              The parametric rule engine for regulated domains. Deterministic,
              auditable, extensible.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Tag color="#6b7280">@run-iq/core &middot; MIT</Tag>
              <Tag color="#6b7280">TypeScript &middot; strict</Tag>
            </div>
          </div>

          {/* Packages */}
          <div>
            <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted mb-5">
              Packages
            </div>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              {PACKAGES.map((pkg) => (
                <li key={pkg}>
                  <a
                    href="#"
                    className="font-mono text-[11px] text-ink no-underline hover:opacity-60 transition-opacity"
                  >
                    {pkg}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted mb-5">
              Resources
            </div>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              {RESOURCES.map((r) => (
                <li key={r.label}>
                  <a
                    href={r.href}
                    className="font-serif text-sm text-ink no-underline hover:opacity-60 transition-opacity"
                  >
                    {r.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted mb-5">
              Legal
            </div>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              {LEGAL.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="font-serif text-sm text-ink no-underline hover:opacity-60 transition-opacity"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-rule pt-7 flex justify-between items-center">
          <p className="font-mono text-[10px] text-[#9ca3af] tracking-wide">
            &copy; 2025 ABDOU-RAOUF ATARMLA &middot; RUN-IQ &middot;
            run-iq.org
          </p>
          <p className="font-mono text-[9px] tracking-wider uppercase text-[#9ca3af]">
            Run-IQ implements the PPE specification.
          </p>
        </div>
      </div>
    </footer>
  );
}
