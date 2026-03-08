import { DocsSidebar } from '@/components/docs/DocsSidebar';
import { DocsHeader } from '@/components/docs/DocsHeader';

export const metadata = {
  title: 'Documentation | Run-IQ',
  description: 'Run-IQ documentation — getting started, core concepts, API reference, and plugin guides.',
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-paper">
      <DocsSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <DocsHeader />
        <main className="flex-1 max-w-3xl mx-auto w-full px-6 md:px-10 py-10">
          <article className="docs-content">{children}</article>
        </main>
      </div>
    </div>
  );
}
