interface AvatarProps {
  src?: string | null;
  name: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = { sm: 28, md: 36, lg: 48 };

export function Avatar({ src, name, color = '#4f8ef7', size = 'md' }: AvatarProps) {
  const px = sizeMap[size];
  const initials = name.slice(0, 2).toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="rounded-full object-cover flex-shrink-0"
        style={{ width: px, height: px, border: `2px solid ${color}` }}
      />
    );
  }

  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{ width: px, height: px, background: color, fontSize: px * 0.35 }}
    >
      {initials}
    </div>
  );
}
