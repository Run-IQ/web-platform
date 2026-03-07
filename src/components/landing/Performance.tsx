'use client';

import { useEffect, useRef } from 'react';
import { SectionLabel } from '@/components/ui/SectionLabel';

const BENCHMARKS = [
  {
    label: '100 rules',
    detail: 'simple FLAT_RATE \u00b7 no DSL conditions',
    time: '< 1ms',
    width: '4%',
  },
  {
    label: '1,000 rules',
    detail: 'mixed models \u00b7 JSONLogic conditions',
    time: '< 10ms',
    width: '20%',
  },
  {
    label: '10,000 rules',
    detail: 'complex domain \u00b7 multi-plugin \u00b7 full trace',
    time: '< 50ms',
    width: '100%',
  },
];

export function Performance() {
  const sectionRef = useRef<HTMLElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated.current) {
            animated.current = true;
            // Animate reveal elements
            const reveals = sectionRef.current?.querySelectorAll('.reveal');
            reveals?.forEach((el) => el.classList.add('visible'));
            // Animate perf bars
            setTimeout(() => {
              const bars = sectionRef.current?.querySelectorAll('.perf-bar');
              bars?.forEach((bar) => bar.classList.add('animate'));
            }, 200);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="performance"
      ref={sectionRef}
      className="py-14 md:py-20 px-4 md:px-8 bg-warm border-b border-rule"
    >
      <div className="max-w-[1100px] mx-auto">
        <div className="mb-12">
          <SectionLabel>6 &mdash; Benchmarks</SectionLabel>
          <h2 className="font-serif text-4xl font-bold mt-3">
            Performance targets.
          </h2>
          <p className="font-serif text-[17px] text-muted mt-2">
            Phase 2 target benchmarks &middot; Node.js 20 &middot; M2 Pro
          </p>
        </div>

        <div className="flex flex-col gap-6 max-w-[700px]">
          {BENCHMARKS.map((b, i) => (
            <div key={i} className="reveal perf-item">
              <div className="flex justify-between mb-2">
                <div>
                  <span className="font-semibold text-sm">{b.label}</span>
                  <span className="font-mono text-[11px] text-[#9ca3af] ml-3">
                    {b.detail}
                  </span>
                </div>
                <span className="font-mono text-[13px] font-semibold">
                  {b.time}
                </span>
              </div>
              <div className="bg-rule h-1">
                <div
                  className="perf-bar"
                  style={{ width: b.width, height: 4 }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 border border-rule bg-paper max-w-[700px]">
          <div className="flex gap-5 flex-wrap">
            <div>
              <SectionLabel className="mb-1.5">Checksum strategy</SectionLabel>
              <p className="font-serif text-sm text-[#4b5563]">
                Host computes SHA-256 once on write. Core compares strings only
                &mdash; zero CPU during pipeline.
              </p>
            </div>
            <div className="border-l border-rule pl-5">
              <SectionLabel className="mb-1.5">
                Phase 3 optimization
              </SectionLabel>
              <p className="font-serif text-sm text-[#4b5563]">
                AOT compilation of DSL conditions into native JS functions.
                Target: 10&ndash;50&times; faster condition evaluation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
