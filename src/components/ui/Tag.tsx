export function Tag({
  children,
  color,
  className = '',
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={`tag ${className}`}
      style={color ? { color } : undefined}
    >
      {children}
    </span>
  );
}
