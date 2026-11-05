export function BrandMark({
  className = '',
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 font-display text-xl tracking-tight ${className}`}
      style={{ color: inverted ? '#FAF7F4' : 'var(--ink)' }}
    >
      <span
        className="grid h-8 w-8 place-items-center rounded-xl"
        style={{ background: 'var(--accent)', color: '#fff' }}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
          <path
            d="M12 3c4 3.2 7 5.4 7 9.4A7 7 0 1 1 5 12.4C5 8.4 8 6.2 12 3z"
            fill="currentColor"
          />
        </svg>
      </span>
      Alehu
    </span>
  );
}
