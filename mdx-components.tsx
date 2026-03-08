import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="font-serif text-3xl font-bold tracking-tight text-ink mb-6 mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-serif text-2xl font-bold tracking-tight text-ink mt-10 mb-4 pb-2 border-b border-rule">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-serif text-xl font-semibold text-ink mt-8 mb-3">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-sans text-sm font-bold uppercase tracking-wider text-[#6b7280] mt-6 mb-2">
        {children}
      </h4>
    ),
    p: ({ children }) => (
      <p className="font-serif text-base leading-relaxed text-ink/90 mb-4">
        {children}
      </p>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-ink font-semibold underline decoration-[#e5e5e0] underline-offset-2 hover:decoration-ink transition-colors"
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="font-serif text-base leading-relaxed text-ink/90 mb-4 pl-6 list-disc space-y-1">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="font-serif text-base leading-relaxed text-ink/90 mb-4 pl-6 list-decimal space-y-1">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="pl-1">{children}</li>,
    code: ({ children, className }) => {
      // Inline code (no className) vs code blocks (has className from mdx)
      if (!className) {
        return (
          <code className="font-mono text-[0.85em] bg-[#f5f5f2] border border-[#e5e5e0] rounded px-1.5 py-0.5 text-ink">
            {children}
          </code>
        );
      }
      return <code className={className}>{children}</code>;
    },
    pre: ({ children }) => (
      <pre className="bg-ink text-[#e5e5e0] font-mono text-[13px] leading-relaxed p-5 mb-4 overflow-x-auto rounded">
        {children}
      </pre>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto mb-4">
        <table className="w-full font-sans text-sm border-collapse">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="border-b-2 border-rule">{children}</thead>
    ),
    th: ({ children }) => (
      <th className="text-left font-mono text-[10px] uppercase tracking-wider text-[#9ca3af] py-2 px-3">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="py-2 px-3 border-b border-[#f0f0ec] font-serif text-sm text-ink/90">
        {children}
      </td>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-ink pl-4 my-4 text-ink/70 italic">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="border-rule my-8" />,
    ...components,
  };
}
