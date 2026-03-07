export function CodeBlock({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <pre className={`code-block ${className}`}>{children}</pre>;
}
