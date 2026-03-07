export function Hero() {
  return (
    <section className="py-24 px-8 pb-20 border-b border-rule text-center">
      <div className="max-w-[860px] mx-auto">
        <h1 className="font-serif text-[clamp(52px,7.5vw,76px)] leading-[1.08] font-normal mb-7 tracking-tight text-ink">
          The Parametric Engine for
          <br />
          <em>Regulated Domains.</em>
        </h1>

        <p className="font-serif text-[clamp(18px,2.2vw,22px)] text-[#475569] leading-relaxed max-w-[580px] mx-auto mb-12">
          A deterministic, stateless, and auditable rule engine designed for law,
          tax, and compliance. Open-source core, domain-expert plugins.
        </p>

        <div className="flex flex-col items-center gap-3.5">
          <button className="btn-primary">Get Started (npm)</button>
          <button className="btn-secondary">View Specification</button>
        </div>

        {/* Stats strip */}
        <div className="flex mt-16 border border-rule bg-white">
          <div className="flex-1 py-6 px-5 text-center border-r border-rule">
            <div className="font-serif text-[28px] font-bold">SHA-256</div>
            <div className="font-mono text-[9px] tracking-wider uppercase text-muted mt-1.5">
              Every snapshot signed
            </div>
          </div>
          <div className="flex-1 py-6 px-5 text-center border-r border-rule">
            <div className="font-serif text-[28px] font-bold">100%</div>
            <div className="font-mono text-[9px] tracking-wider uppercase text-muted mt-1.5">
              Deterministic &middot; always
            </div>
          </div>
          <div className="flex-1 py-6 px-5 text-center border-r border-rule">
            <div className="font-serif text-[28px] font-bold">MIT</div>
            <div className="font-mono text-[9px] tracking-wider uppercase text-muted mt-1.5">
              Core &amp; SDK license
            </div>
          </div>
          <div className="flex-1 py-6 px-5 text-center">
            <div className="font-serif text-[28px] font-bold">&infin;</div>
            <div className="font-mono text-[9px] tracking-wider uppercase text-muted mt-1.5">
              Replay any past result
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
