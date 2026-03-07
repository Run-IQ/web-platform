'use client';

import { useEffect, useRef } from 'react';
import { SectionLabel } from '@/components/ui/SectionLabel';

const GUARANTEES = [
  {
    tag: 'Determinism',
    title: 'Same input. Same result. Always.',
    text: 'A computation from 2021 is mathematically identical when replayed today. Same inputs, same engine version, same result \u2014 guaranteed by construction.',
  },
  {
    tag: 'Immutability',
    title: 'Rules cannot mutate in transit.',
    text: 'Rules are strictly read-only throughout the entire pipeline. A SHA-256 checksum is verified at every reception \u2014 any tampering is detected immediately.',
  },
  {
    tag: 'Idempotence',
    title: 'A requestId runs once. Period.',
    text: 'Network retries and worker re-queues never produce double calculations. The engine checks for an existing snapshot before executing anything.',
  },
  {
    tag: 'Legal Reproducibility',
    title: 'Replay any calculation, years later.',
    text: 'Snapshots store full rule objects \u2014 not IDs. Engine version, plugin versions, DSL evaluators. Everything needed to reproduce the exact result is permanently archived.',
  },
  {
    tag: 'Decimal Precision',
    title: 'No floating-point surprises.',
    text: 'Arithmetic precision is enforced in every financial calculation. Native float representations are strictly prohibited to ensure totals are perfectly predictable.',
  },
  {
    tag: 'Snapshot Integrity',
    title: 'No snapshot. No result.',
    text: 'In strict mode, a snapshot save failure throws before the result is returned. A calculation without an archived legal trace simply does not exist.',
  },
];

export function Guarantees() {
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
    <section ref={sectionRef} className="py-20 px-8 bg-warm border-b border-rule">
      <div className="max-w-[1100px] mx-auto">
        <div className="mb-12">
          <SectionLabel>4 &mdash; Guarantees</SectionLabel>
          <h2 className="font-serif text-4xl font-bold mt-3">
            What the engine commits to.
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {GUARANTEES.map((g) => (
            <div key={g.tag} className="guarantee-card reveal">
              <div className="font-mono text-[10px] text-[#9ca3af] mb-3 tracking-wider uppercase">
                {g.tag}
              </div>
              <h3 className="font-bold text-base mb-2.5">{g.title}</h3>
              <p className="font-serif text-[15px] text-[#4b5563] leading-relaxed">
                {g.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
