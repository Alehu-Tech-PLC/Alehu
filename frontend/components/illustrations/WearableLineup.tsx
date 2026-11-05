/**
 * WearableLineup — four wearable form factors for the product page.
 * Watch (Phase 1, bold), Bracelet, Necklace pendant, Ring.
 */
export function WearableLineup({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 560 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alehu wearable product lineup: watch, bracelet, necklace, ring"
      role="img"
    >
      {/* ══════════
          WATCH (Phase 1 — bold, featured)
      ══════════ */}
      <g transform="translate(20, 10)">
        {/* Phase 1 badge */}
        <rect x="14" y="0" width="82" height="18" rx="9" fill="var(--accent)"/>
        <text x="55" y="13" textAnchor="middle" fontFamily="system-ui" fontSize="9" fontWeight="700" fill="white" letterSpacing="0.5">
          PHASE 1
        </text>

        {/* Strap top */}
        <rect x="36" y="20" width="38" height="28" rx="8" fill="var(--accent)" opacity="0.9"/>
        {/* Body */}
        <rect x="14" y="44" width="82" height="96" rx="22" fill="var(--surface)"/>
        <rect x="14" y="44" width="82" height="96" rx="22" fill="none" stroke="var(--accent)" strokeWidth="2.5"/>
        {/* Screen */}
        <rect x="24" y="54" width="62" height="76" rx="16" fill="var(--canvas)"/>
        {/* Pulse line */}
        <polyline points="30,92 38,92 42,80 46,104 50,86 54,92 58,92 62,85 66,98 70,92 78,92"
          stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        {/* Pulse dot */}
        <circle cx="62" cy="85" r="3" fill="var(--accent)"/>
        <circle cx="62" cy="85" r="6" fill="var(--accent)" opacity="0.2"/>
        {/* Time text */}
        <text x="55" y="116" textAnchor="middle" fontFamily="Georgia,serif" fontSize="11" fontWeight="700" fill="var(--ink)" opacity="0.8">
          09:41
        </text>
        {/* Strap bottom */}
        <rect x="36" y="140" width="38" height="28" rx="8" fill="var(--accent)" opacity="0.9"/>
        {/* Crown */}
        <rect x="96" y="72" width="6" height="20" rx="3" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.5"/>
        {/* Label */}
        <text x="55" y="184" textAnchor="middle" fontFamily="system-ui" fontSize="11" fontWeight="600" fill="var(--ink)">Watch</text>
      </g>

      {/* ══════════
          BRACELET
      ══════════ */}
      <g transform="translate(160, 20)">
        {/* Bracelet band */}
        <ellipse cx="60" cy="88" rx="48" ry="22" fill="none" stroke="var(--accent)" strokeWidth="14" strokeLinecap="round" opacity="0.85"/>
        {/* Clasp / module */}
        <rect x="34" y="74" width="52" height="28" rx="10" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2"/>
        {/* Screen */}
        <rect x="40" y="80" width="40" height="16" rx="6" fill="var(--canvas)"/>
        {/* LED dot */}
        <circle cx="60" cy="88" r="4" fill="var(--accent)"/>
        <circle cx="60" cy="88" r="7" fill="var(--accent)" opacity="0.2"/>
        {/* Label */}
        <text x="60" y="136" textAnchor="middle" fontFamily="system-ui" fontSize="11" fontWeight="600" fill="var(--ink)">Bracelet</text>
        {/* Soon badge */}
        <rect x="26" y="148" width="68" height="16" rx="8" fill="var(--surface-2)"/>
        <text x="60" y="160" textAnchor="middle" fontFamily="system-ui" fontSize="9" fill="var(--ink-muted)">Coming soon</text>
      </g>

      {/* ══════════
          NECKLACE PENDANT
      ══════════ */}
      <g transform="translate(300, 4)">
        {/* Chain */}
        <path d="M60 8 Q20 30 20 60 Q20 90 60 100" stroke="var(--border)" strokeWidth="2" fill="none" strokeDasharray="4 3"/>
        <path d="M60 8 Q100 30 100 60 Q100 90 60 100" stroke="var(--border)" strokeWidth="2" fill="none" strokeDasharray="4 3"/>
        {/* Clasp at top */}
        <circle cx="60" cy="8" r="5" fill="var(--surface)" stroke="var(--border)" strokeWidth="2"/>
        {/* Pendant body */}
        <circle cx="60" cy="110" r="28" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2.5"/>
        <circle cx="60" cy="110" r="22" fill="var(--canvas)"/>
        {/* Alehu shield icon */}
        <path d="M60 94 L72 100 L72 112 Q72 122 60 128 Q48 122 48 112 L48 100 Z"
          fill="var(--accent)" opacity="0.2" stroke="var(--accent)" strokeWidth="1.5"/>
        <polyline points="54,111 58,116 68,104" stroke="var(--accent)" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"/>
        {/* Label */}
        <text x="60" y="158" textAnchor="middle" fontFamily="system-ui" fontSize="11" fontWeight="600" fill="var(--ink)">Necklace</text>
        {/* Soon badge */}
        <rect x="24" y="166" width="72" height="16" rx="8" fill="var(--surface-2)"/>
        <text x="60" y="178" textAnchor="middle" fontFamily="system-ui" fontSize="9" fill="var(--ink-muted)">Coming soon</text>
      </g>

      {/* ══════════
          RING
      ══════════ */}
      <g transform="translate(435, 30)">
        {/* Ring band */}
        <ellipse cx="50" cy="80" rx="38" ry="18" fill="none" stroke="var(--accent)" strokeWidth="12" opacity="0.85"/>
        {/* Setting / sensor top */}
        <rect x="30" y="58" width="40" height="22" rx="8" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2"/>
        {/* Gemstone */}
        <polygon points="50,62 58,68 54,76 46,76 42,68" fill="var(--accent)" opacity="0.7"/>
        <polygon points="50,62 58,68 54,76 46,76 42,68" fill="none" stroke="white" strokeWidth="1" opacity="0.5"/>
        <line x1="50" y1="62" x2="50" y2="76" stroke="white" strokeWidth="0.8" opacity="0.4"/>
        <line x1="42" y1="68" x2="58" y2="68" stroke="white" strokeWidth="0.8" opacity="0.4"/>
        {/* Label */}
        <text x="50" y="120" textAnchor="middle" fontFamily="system-ui" fontSize="11" fontWeight="600" fill="var(--ink)">Ring</text>
        {/* Soon badge */}
        <rect x="12" y="130" width="76" height="16" rx="8" fill="var(--surface-2)"/>
        <text x="50" y="142" textAnchor="middle" fontFamily="system-ui" fontSize="9" fill="var(--ink-muted)">Coming soon</text>
      </g>
    </svg>
  );
}
