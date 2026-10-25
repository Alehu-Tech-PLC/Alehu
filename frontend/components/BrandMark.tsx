export function BrandMark({
  className = '',
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  const badge = inverted ? 'bg-cream text-navy' : 'bg-navy text-teal-soft';

  return (
    <span className={`inline-flex items-center gap-2 font-display text-xl tracking-tight ${className}`}>
      <span className={`grid h-9 w-9 place-items-center rounded-xl ${badge}`}>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
          <path d="M12 3c4 3.2 7 5.4 7 9.4A7 7 0 1 1 5 12.4C5 8.4 8 6.2 12 3z" fill="currentColor" />
        </svg>
      </span>
      Alehu
    </span>
  );
}
