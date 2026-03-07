export function Hero() {
  return (
    <section className="py-14 md:py-24 px-4 md:px-8 pb-14 md:pb-20 border-b border-rule text-center">
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
        <div className="grid grid-cols-2 md:grid-cols-4 mt-10 md:mt-16 border border-rule bg-white">
          <div className="py-5 md:py-6 px-4 md:px-5 text-center border-r border-b md:border-b-0 border-rule">
            <div className="font-serif text-xl md:text-[28px] font-bold">SHA-256</div>
            <div className="font-mono text-[8px] md:text-[9px] tracking-wider uppercase text-muted mt-1.5">
              Every snapshot signed
            </div>
          </div>
          <div className="py-5 md:py-6 px-4 md:px-5 text-center md:border-r border-b md:border-b-0 border-rule">
            <div className="font-serif text-xl md:text-[28px] font-bold">100%</div>
            <div className="font-mono text-[8px] md:text-[9px] tracking-wider uppercase text-muted mt-1.5">
              Deterministic &middot; always
            </div>
          </div>
          <div className="py-5 md:py-6 px-4 md:px-5 text-center border-r border-rule">
            <div className="font-serif text-xl md:text-[28px] font-bold">MIT</div>
            <div className="font-mono text-[8px] md:text-[9px] tracking-wider uppercase text-muted mt-1.5">
              Core &amp; SDK license
            </div>
          </div>
          <div className="py-5 md:py-6 px-4 md:px-5 text-center">
            <div className="font-serif text-xl md:text-[28px] font-bold">&infin;</div>
            <div className="font-mono text-[8px] md:text-[9px] tracking-wider uppercase text-muted mt-1.5">
              Replay any past result
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
