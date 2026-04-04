export function LoadingSpinner({ size = 24 }: { size?: number }) {
  return (
    <div
      className="border-2 border-t-transparent rounded-full animate-spin"
      style={{ width: size, height: size, borderColor: 'var(--accent-blue)', borderTopColor: 'transparent' }}
    />
  );
}
