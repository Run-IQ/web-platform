import { SectionLabel } from '@/components/ui/SectionLabel';
import { Tag } from '@/components/ui/Tag';

export function Plugins() {
  return (
    <section id="plugins" className="py-20 px-8 border-b border-rule">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div className="flex flex-col justify-between h-full">
            <div>
              <SectionLabel>5 &mdash; Plugin Ecosystem</SectionLabel>
              <h2 className="font-serif text-4xl font-bold mt-3 mb-5">
                Domain knowledge,
                <br />
                cleanly packaged.
              </h2>
              <p className="font-serif text-[17px] text-[#4b5563] leading-relaxed mb-7">
                The engine is MIT and free. Domain plugins carry the regulated
                knowledge &mdash; fiscal brackets, payroll rules, social
                contributions. They are Source-Available: readable, auditable,
                commercially licensed.
              </p>
              <p className="font-serif text-[17px] text-[#4b5563] leading-relaxed mb-8">
                Build your own with{' '}
                <code className="font-mono text-[13px] bg-warm px-1.5">
                  @run-iq/plugin-sdk
                </code>
                . Extend{' '}
                <code className="font-mono text-[13px] bg-warm px-1.5">
                  BasePlugin
                </code>
                , declare your models, run{' '}
                <code className="font-mono text-[13px] bg-warm px-1.5">
                  PluginTester
                </code>{' '}
                to verify PPE conformance.
              </p>
            </div>

            <div className="grow flex flex-col justify-end">
              <div className="p-8 bg-[#fdfdfc] border border-dashed border-rule mb-8 grow flex flex-col justify-center items-center text-center">
                {/* Ecosystem SVG */}
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  fill="none"
                  className="mb-5"
                >
                  <rect
                    x="24"
                    y="24"
                    width="16"
                    height="16"
                    rx="2"
                    stroke="#0d0d0d"
                    strokeWidth="1.5"
                    fill="#0d0d0d"
                  />
                  <path
                    d="M40 32H48 M16 32H24 M32 16V24 M32 40V48"
                    stroke="#d1d5db"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                  <rect
                    x="48"
                    y="26"
                    width="10"
                    height="12"
                    rx="2"
                    stroke="#6b7280"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="6"
                    y="26"
                    width="10"
                    height="12"
                    rx="2"
                    stroke="#6b7280"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="26"
                    y="6"
                    width="12"
                    height="10"
                    rx="2"
                    stroke="#e5e5e0"
                    strokeWidth="1.5"
                    fill="#fdfdfc"
                  />
                  <rect
                    x="26"
                    y="48"
                    width="12"
                    height="10"
                    rx="2"
                    stroke="#e5e5e0"
                    strokeWidth="1.5"
                    fill="#fdfdfc"
                  />
                </svg>

                <div className="font-mono text-[11px] text-muted uppercase tracking-wider mb-2">
                  Ecosystem Directory
                </div>
                <p className="font-serif text-[15px] text-muted max-w-[260px] leading-normal">
                  Browse community plugins or submit your own domain logic.
                </p>
              </div>

              <a href="#" className="btn-outline self-start mt-auto">
                View Plugin Directory
              </a>
            </div>
          </div>

          {/* Right: plugin cards */}
          <div className="flex flex-col gap-3">
            {/* Fiscal */}
            <div className="plugin-card">
              <div className="flex justify-between items-start mb-2.5">
                <div>
                  <span className="font-mono text-xs font-medium">
                    @run-iq/plugin-fiscal
                  </span>
                  <Tag color="#b45309" className="ml-2">
                    Source-Available
                  </Tag>
                </div>
                <Tag color="#16a34a">In progress</Tag>
              </div>
              <p className="font-serif text-sm text-muted leading-normal mb-2.5">
                TVA, IRPP, IS, cotisations sociales. Multi-country West Africa.
                Jurisdiction resolver with national/regional/municipal priority.
              </p>
              <div className="font-mono text-[10px] text-[#9ca3af]">
                FLAT_RATE &middot; PROGRESSIVE_BRACKET &middot; MINIMUM_TAX
                &middot; COMPOSITE &middot; META_INHIBITION
              </div>
            </div>

            {/* Payroll */}
            <div className="plugin-card">
              <div className="flex justify-between items-start mb-2.5">
                <div>
                  <span className="font-mono text-xs font-medium">
                    @run-iq/plugin-payroll
                  </span>
                  <Tag color="#b45309" className="ml-2">
                    Source-Available
                  </Tag>
                </div>
                <Tag color="#9ca3af">Roadmap</Tag>
              </div>
              <p className="font-serif text-sm text-muted leading-normal mb-2.5">
                Gross-to-net salary assembly. Social contributions (CNSS/AMO).
                Performance bonuses. Commission brackets.
              </p>
              <div className="font-mono text-[10px] text-[#9ca3af]">
                SOCIAL_CONTRIBUTION &middot; COMMISSION &middot;
                PERFORMANCE_BONUS &middot; NET_SALARY_ASSEMBLY
              </div>
            </div>

            {/* Custom */}
            <div className="plugin-card" style={{ borderStyle: 'dashed' }}>
              <div className="flex justify-between items-start mb-2.5">
                <span className="font-mono text-xs font-medium text-[#9ca3af]">
                  @your-org/plugin-custom
                </span>
                <Tag color="#9ca3af">Yours to build</Tag>
              </div>
              <p className="font-serif text-sm text-[#9ca3af] leading-normal">
                Banking fees, insurance premiums, energy tariffs, government
                subsidies &mdash; any domain with versioned rules and a need for
                audit.
              </p>
              <div className="mt-3">
                <a
                  href="#"
                  className="font-mono text-[10px] text-ink tracking-wide no-underline border-b border-ink pb-px"
                >
                  Build a plugin &rarr;
                </a>
              </div>
            </div>

            {/* DSL packages */}
            <div className="border border-rule p-4 px-5">
              <div className="mb-2.5">
                <SectionLabel>DSL Evaluators (MIT)</SectionLabel>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[11px]">
                    @run-iq/dsl-jsonlogic
                  </span>
                  <Tag color="#16a34a">Available</Tag>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[11px]">
                    @run-iq/dsl-cel
                  </span>
                  <Tag color="#9ca3af">Roadmap</Tag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
