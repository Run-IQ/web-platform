export interface NavItem {
  title: string;
  href: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const docsNav: NavGroup[] = [
  {
    label: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/docs' },
      { title: 'Installation', href: '/docs/getting-started/installation' },
      { title: 'Quick Start', href: '/docs/getting-started/quick-start' },
      { title: 'Configuration', href: '/docs/getting-started/configuration' },
    ],
  },
  {
    label: 'Core Concepts',
    items: [
      { title: 'Rules', href: '/docs/concepts/rules' },
      { title: 'Engine', href: '/docs/concepts/engine' },
      { title: 'Pipeline', href: '/docs/concepts/pipeline' },
      { title: 'Plugins', href: '/docs/concepts/plugins' },
      { title: 'Calculation Models', href: '/docs/concepts/models' },
      { title: 'Snapshots & Audit', href: '/docs/concepts/snapshots' },
    ],
  },
  {
    label: 'API Reference',
    items: [
      { title: 'PPEEngine', href: '/docs/api/engine' },
      { title: 'Types', href: '/docs/api/types' },
      { title: 'Errors', href: '/docs/api/errors' },
    ],
  },
  {
    label: 'Plugins',
    items: [
      { title: 'Plugin Guide', href: '/docs/plugins/guide' },
      { title: 'Fiscal Plugin', href: '/docs/plugins/fiscal' },
    ],
  },
  {
    label: 'DSL Evaluators',
    items: [
      { title: 'JSONLogic', href: '/docs/dsl/jsonlogic' },
    ],
  },
  {
    label: 'Integrations',
    items: [
      { title: 'REST Server', href: '/docs/integrations/server' },
      { title: 'CLI', href: '/docs/integrations/cli' },
      { title: 'MCP Server', href: '/docs/integrations/mcp' },
    ],
  },
  {
    label: 'MCP Reference',
    items: [
      { title: 'Tools', href: '/docs/mcp/tools' },
      { title: 'Resources & Prompts', href: '/docs/mcp/resources' },
      { title: 'Plugin Loading', href: '/docs/mcp/plugin-loading' },
    ],
  },
  {
    label: 'SDK Reference',
    items: [
      { title: 'SchemaValidator', href: '/docs/sdk/schema-validator' },
      { title: 'PluginTester', href: '/docs/sdk/plugin-tester' },
    ],
  },
  {
    label: 'Advanced',
    items: [
      { title: 'Security Model', href: '/docs/advanced/security' },
      { title: 'Decimal Arithmetic', href: '/docs/advanced/decimal' },
      { title: 'Determinism', href: '/docs/advanced/determinism' },
      { title: 'Jurisdiction Resolution', href: '/docs/advanced/jurisdiction' },
    ],
  },
  {
    label: 'Guides',
    items: [
      { title: 'Building a DSL', href: '/docs/guides/custom-dsl' },
      { title: 'Togo CGI 2025', href: '/docs/guides/togo-cgi' },
    ],
  },
];
