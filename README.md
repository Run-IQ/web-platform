# @run-iq/web-platform

Public website and interactive playground for [Run-IQ](https://github.com/Run-IQ) — the parametric rule engine for regulated domains.

## Pages

| Route | Description |
|---|---|
| `/` | Landing page — architecture overview, guarantees, plugin ecosystem |
| `/playground` | Interactive rule editor with live engine evaluation |
| `/playground/compare` | Side-by-side scenario comparison |

## Playground Features

- **Monaco Editor** — JSON editors for rules and input with syntax highlighting
- **Guided Form Mode** — auto-generated form from input schema, no JSON knowledge required
- **Explain View** — human-readable calculation breakdown (bracket tables, sub-steps, flags)
- **Audit Certificate** — SHA-256 integrity proof with exportable JSON
- **Scenario Comparison** — evaluate two inputs against the same rules, see deltas
- **Plugin Selector** — shows loaded plugin (Fiscal), future plugins listed as coming soon
- **5 pre-loaded examples** — IRPP, VAT, Minimum Tax, CNSS Composite, Full Payroll (6 rules)
- **Responsive** — tabbed mobile layout, desktop 3-panel grid

## Stack

- **Next.js 15** App Router with `output: 'export'` (static site)
- **Tailwind CSS v4** with custom design tokens
- **Monaco Editor** via `@monaco-editor/react` (dynamic import, no SSR)
- **Run-IQ engine** running in-browser: `@run-iq/core` + `@run-iq/plugin-fiscal` + `@run-iq/dsl-jsonlogic`
- **Crypto shim** — `js-sha256` replaces `node:crypto` for browser compatibility

## Development

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # Static export → out/
```

Requires Node.js 20+.

## Architecture Notes

The engine runs entirely in the browser. A webpack alias maps `node:crypto` and `crypto` to a thin shim using `js-sha256` + Web Crypto API. The engine is configured in dry-run mode (no snapshot persistence).

```
src/
├── app/                    # Next.js routes
│   ├── page.tsx            # Landing page
│   ├── playground/
│   │   ├── page.tsx        # Playground
│   │   └── compare/
│   │       └── page.tsx    # Comparison mode
│   ├── layout.tsx          # Root layout (fonts, metadata)
│   └── globals.css         # Tailwind + design system
├── components/
│   ├── landing/            # 9 landing page sections
│   ├── playground/         # Playground components
│   │   ├── PlaygroundShell.tsx
│   │   ├── CompareShell.tsx
│   │   ├── FormView.tsx
│   │   ├── ExplainView.tsx
│   │   ├── ResultPanel.tsx
│   │   ├── AuditCertificate.tsx
│   │   └── ...
│   └── ui/                 # Reusable UI primitives
├── hooks/
│   └── useEngine.ts        # React hook wrapping PPEEngine
└── lib/
    ├── engine.ts           # Browser engine factory
    ├── crypto-shim.ts      # node:crypto → browser polyfill
    └── examples.ts         # Pre-loaded fiscal examples
```

## License

See [LICENSE](LICENSE).

---

*Run-IQ &middot; [run-iq.org](https://run-iq.org) &middot; [github.com/Run-IQ](https://github.com/Run-IQ)*
