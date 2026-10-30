# Run-IQ web platform

The Run-IQ website: landing page, documentation, and a playground that runs the rule engine in the browser.

## What's on the site

| Route | |
|---|---|
| `/` | Landing page |
| `/docs` | Documentation: concepts, API, plugins, DSLs, CLI / server / MCP integrations, guides |
| `/playground` | Edit rules and input as JSON (or through a form), evaluate them, and inspect the breakdown, trace and checksums |
| `/playground/compare` | Evaluate two inputs against the same rules side by side |

The playground loads `@run-iq/core` with `@run-iq/plugin-fiscal` and `@run-iq/dsl-jsonlogic`, in dry-run, non-strict mode. Its built-in examples are fiscal ones (income tax brackets, VAT, payroll contributions, meta-rules). Rules with a wrong checksum are skipped, so editing a rule's content in the playground makes it show up as `CHECKSUM_MISMATCH` unless you update its `checksum` too.

There is no backend. The site is a static export, and `node:crypto` is aliased to a small browser shim (`src/lib/crypto-shim.ts`, using `js-sha256`) so the engine can run client-side.

## Run locally

The `@run-iq/*` packages come from GitHub Packages. Point the scope at it in your `~/.npmrc` (GitHub requires a token with `read:packages`):

```
@run-iq:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_TOKEN
```

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in out/
```

Requires Node.js 20 or later.

## Layout

- `src/app/`: routes. Documentation pages are MDX files under `src/app/docs/`, and the sidebar is defined in `src/lib/docs-nav.ts`.
- `src/components/`: landing, docs and playground components.
- `src/lib/examples.ts`: playground examples.
- `src/lib/engine.ts`: engine configuration used by the playground.

## Deployment

Every push to `master` builds the site and publishes `out/` to GitHub Pages (`.github/workflows/deploy.yml`).

## License

No license file yet.
