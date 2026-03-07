'use client';

import { useEffect, useRef } from 'react';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Tag } from '@/components/ui/Tag';

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-xs bg-warm px-1 py-0.5">{children}</code>
  );
}

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const reveals = sectionRef.current?.querySelectorAll('.reveal');
    reveals?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-14 md:py-20 px-4 md:px-8 border-b border-rule"
    >
      <div className="max-w-[1100px] mx-auto">
        <div className="mb-14">
          <SectionLabel>3 &mdash; Architecture</SectionLabel>
          <h2 className="font-serif text-4xl font-bold mt-3">How it works.</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left: architecture layers */}
          <div>
            <div className="border border-rule overflow-hidden mb-6">
              {/* Host layer */}
              <div className="bg-warm p-4 px-5 border-b border-rule">
                <SectionLabel>Your Application (Host)</SectionLabel>
                <div className="font-mono text-[11px] text-muted mt-1.5">
                  Rules DB &middot; Snapshot Adapter &middot; BullMQ Workers
                </div>
              </div>
              {/* Core layer */}
              <div className="bg-paper p-4 px-5 border-b border-rule">
                <span className="font-mono text-[11px] text-ink font-medium">
                  @run-iq/core
                </span>
                <Tag color="#6b7280" className="ml-2">
                  MIT
                </Tag>
                <div className="font-mono text-[10px] text-[#9ca3af] mt-2 leading-7">
                  InputSanitizer &rarr; Idempotence
                  <br />
                  beforeEvaluate &rarr; RuleFilter
                  <br />
                  DominanceResolver &rarr; ExecutionPipeline
                  <br />
                  TraceBuilder &rarr; afterEvaluate &rarr; Snapshot
                </div>
              </div>
              {/* DSL + SDK layer */}
              <div className="grid grid-cols-2 border-b border-rule">
                <div className="p-3.5 px-5 border-r border-rule">
                  <span className="font-mono text-[10px] text-ink">
                    @run-iq/dsl-*
                  </span>
                  <Tag color="#6b7280" className="ml-1.5">
                    MIT
                  </Tag>
                  <div className="font-mono text-[10px] text-[#9ca3af] mt-1.5">
                    jsonlogic &middot; cel
                  </div>
                </div>
                <div className="p-3.5 px-5">
                  <span className="font-mono text-[10px] text-ink">
                    @run-iq/plugin-sdk
                  </span>
                  <Tag color="#6b7280" className="ml-1.5">
                    MIT
                  </Tag>
                  <div className="font-mono text-[10px] text-[#9ca3af] mt-1.5">
                    BasePlugin &middot; PluginTester
                  </div>
                </div>
              </div>
              {/* Plugin layer */}
              <div className="grid grid-cols-2">
                <div className="p-3.5 px-5 border-r border-rule bg-paper">
                  <span className="font-mono text-[10px] text-ink">
                    @run-iq/plugin-fiscal
                  </span>
                  <Tag color="#b45309" className="ml-1.5">
                    Source-Available
                  </Tag>
                  <div className="font-mono text-[10px] text-[#9ca3af] mt-1.5">
                    FLAT_RATE &middot; BRACKET &middot; IS &middot; TVA
                  </div>
                </div>
                <div className="p-3.5 px-5 bg-paper">
                  <span className="font-mono text-[10px] text-ink">
                    @run-iq/plugin-payroll
                  </span>
                  <Tag color="#b45309" className="ml-1.5">
                    Source-Available
                  </Tag>
                  <div className="font-mono text-[10px] text-[#9ca3af] mt-1.5">
                    SOCIAL_CONTRIBUTION &middot; NET_SALARY
                  </div>
                </div>
              </div>
            </div>
            <p className="font-serif text-[15px] text-muted leading-relaxed">
              The core has zero knowledge of any domain. Rules are versioned data
              stored by the Host. Plugins register calculation models at startup.
            </p>
          </div>

          {/* Right: principles */}
          <div className="flex flex-col gap-8">
            <div className="reveal border-l-[3px] border-ink pl-5">
              <h3 className="font-bold text-[17px] mb-2">
                The engine knows no domain.
              </h3>
              <p className="font-serif text-base text-[#4b5563] leading-relaxed">
                <InlineCode>rule.model</InlineCode> is an opaque string.{' '}
                <InlineCode>rule.params</InlineCode> is{' '}
                <InlineCode>unknown</InlineCode>. The core resolves, dispatches,
                and traces &mdash; nothing more.
              </p>
            </div>
            <div className="reveal border-l-[3px] border-ink pl-5">
              <h3 className="font-bold text-[17px] mb-2">
                Every calculation leaves a sealed record.
              </h3>
              <p className="font-serif text-base text-[#4b5563] leading-relaxed">
                Full rule data &mdash; not IDs &mdash; are copied into the
                snapshot. A SHA-256 checksum seals it. Any calculation can be
                replayed exactly 5 years later.
              </p>
            </div>
            <div className="reveal border-l-[3px] border-ink pl-5">
              <h3 className="font-bold text-[17px] mb-2">
                Conditions are data, not code.
              </h3>
              <p className="font-serif text-base text-[#4b5563] leading-relaxed">
                Rules carry optional DSL conditions &mdash; JSONLogic or CEL
                &mdash; stored as JSONB in your database. No deployment required
                to activate or deactivate a rule.
              </p>
            </div>
            <div className="reveal border-l-[3px] border-ink pl-5">
              <h3 className="font-bold text-[17px] mb-2">
                Idempotence is architectural.
              </h3>
              <p className="font-serif text-base text-[#4b5563] leading-relaxed">
                Every call carries a{' '}
                <InlineCode>requestId</InlineCode>. If already processed, the
                existing snapshot is returned immediately. Network retries and
                BullMQ re-queues are safe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
