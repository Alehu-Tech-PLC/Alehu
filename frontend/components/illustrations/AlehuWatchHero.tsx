/**
 * AlehuWatchHero — bold hero illustration of the Alehu safety wristband.
 * Phase 1 product: smartwatch form factor with safety pulse indicator.
 */
export function AlehuWatchHero({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alehu safety wristband watch"
      role="img"
    >
      {/* ── Watch strap — top ── */}
      <rect x="155" y="20" width="110" height="80" rx="18" fill="var(--accent)" opacity="0.9"/>
      <rect x="170" y="32" width="80" height="10" rx="5" fill="rgba(255,255,255,0.25)"/>
      <rect x="170" y="50" width="60" height="10" rx="5" fill="rgba(255,255,255,0.18)"/>
      <rect x="170" y="68" width="70" height="10" rx="5" fill="rgba(255,255,255,0.12)"/>

      {/* Strap holes */}
      {[35,50,65,80].map((y) => (
        <circle key={y} cx="148" cy={y} r="4" fill="var(--surface-2)" stroke="var(--border)" strokeWidth="1.5"/>
      ))}

      {/* ── Watch body shadow ── */}
      <ellipse cx="210" cy="408" rx="80" ry="14" fill="var(--accent)" opacity="0.10"/>

      {/* ── Watch body ── */}
      <rect x="100" y="90" width="220" height="240" rx="50" fill="var(--surface)"/>
      {/* Outer bezel */}
      <rect x="100" y="90" width="220" height="240" rx="50" fill="none" stroke="var(--accent)" strokeWidth="3"/>
      {/* Inner bezel ring */}
      <rect x="112" y="102" width="196" height="216" rx="42" fill="none" stroke="var(--border)" strokeWidth="1.5"/>

      {/* ── Screen ── */}
      <rect x="124" y="114" width="172" height="192" rx="36" fill="var(--canvas)"/>

      {/* ── Status bar ── */}
      <rect x="140" y="126" width="140" height="18" rx="9" fill="var(--surface-2)"/>
      <circle cx="152" cy="135" r="4" fill="var(--accent)"/>
      <rect x="162" y="131" width="50" height="8" rx="4" fill="var(--border)"/>
      <rect x="254" y="131" width="18" height="8" rx="4" fill="var(--border)"/>

      {/* ── Child name ── */}
      <text x="210" y="172" textAnchor="middle" fontFamily="Georgia, serif" fontSize="13" fontWeight="700" fill="var(--ink)" opacity="0.85">
        Maya · Safe
      </text>

      {/* ── Pulse / heart rate chart ── */}
      <polyline
        points="136,220 150,220 158,200 166,238 174,210 182,220 190,220 198,205 206,230 214,215 222,220 236,220 244,208 252,228 260,220 274,220"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Pulse dot */}
      <circle cx="214" cy="215" r="4" fill="var(--accent)"/>
      <circle cx="214" cy="215" r="8" fill="var(--accent)" opacity="0.2"/>

      {/* ── Battery & GPS row ── */}
      <rect x="136" y="250" width="64" height="28" rx="10" fill="var(--accent-bg)"/>
      <text x="168" y="269" textAnchor="middle" fontFamily="system-ui" fontSize="10" fontWeight="600" fill="var(--accent-txt)">
        86% ⚡
      </text>

      <rect x="212" y="250" width="64" height="28" rx="10" fill="var(--accent-bg)"/>
      <text x="244" y="269" textAnchor="middle" fontFamily="system-ui" fontSize="10" fontWeight="600" fill="var(--accent-txt)">
        GPS ●
      </text>

      {/* ── SOS button ── */}
      <rect x="155" y="288" width="100" height="30" rx="15" fill="var(--accent)"/>
      <text x="205" y="308" textAnchor="middle" fontFamily="system-ui" fontSize="11" fontWeight="700" fill="white" letterSpacing="1">
        SOS
      </text>

      {/* ── Watch strap — bottom ── */}
      <rect x="155" y="330" width="110" height="90" rx="18" fill="var(--accent)" opacity="0.9"/>
      <rect x="170" y="342" width="80" height="10" rx="5" fill="rgba(255,255,255,0.25)"/>
      <rect x="170" y="360" width="60" height="10" rx="5" fill="rgba(255,255,255,0.18)"/>
      <rect x="170" y="378" width="70" height="10" rx="5" fill="rgba(255,255,255,0.12)"/>

      {/* Buckle */}
      <rect x="188" y="400" width="44" height="14" rx="5" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2"/>
      <line x1="210" y1="400" x2="210" y2="414" stroke="var(--accent)" strokeWidth="2"/>

      {/* ── Crown button ── */}
      <rect x="320" y="168" width="12" height="36" rx="6" fill="var(--surface)" stroke="var(--border)" strokeWidth="2"/>

      {/* ── Alehu brand mark on bezel ── */}
      <circle cx="210" cy="210" r="95" fill="none" stroke="var(--accent)" strokeWidth="0.5" strokeDasharray="4 6" opacity="0.4"/>
    </svg>
  );
}
