import { SectionLabel } from '@/components/ui/SectionLabel';

export function OpenSource() {
  return (
    <section className="py-10 px-8 border-b border-rule bg-white">
      <div className="max-w-[1100px] mx-auto flex items-center justify-between gap-10 flex-wrap">
        <div>
          <SectionLabel className="block mb-2">
            Open Infrastructure
          </SectionLabel>
          <h2 className="font-serif text-[26px] font-bold leading-tight m-0">
            Run-IQ is built in public.{' '}
            <span className="text-muted font-normal">Help it grow.</span>
          </h2>
        </div>
        <div className="flex gap-2.5 shrink-0 flex-wrap">
          <a
            href="https://github.com/sponsors/Run-IQ"
            className="btn-primary"
            style={{
              width: 'auto',
              padding: '12px 28px',
              display: 'inline-block',
            }}
          >
            Become a Sponsor
          </a>
          <a
            href="https://github.com/Run-IQ"
            className="btn-secondary"
            style={{
              width: 'auto',
              padding: '12px 28px',
              display: 'inline-block',
            }}
          >
            Contribute on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
