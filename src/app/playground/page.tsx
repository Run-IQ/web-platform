import { PlaygroundShell } from '@/components/playground/PlaygroundShell';

export const metadata = {
  title: 'Playground | Run-IQ',
  description: 'Interactive rule editor running the real PPE engine in the browser.',
};

export default function PlaygroundPage() {
  return <PlaygroundShell />;
}
