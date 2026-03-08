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
];
