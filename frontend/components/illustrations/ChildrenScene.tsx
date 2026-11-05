/**
 * ChildrenScene — two girls (young child + teen) wearing Alehu bands,
 * with a floating shield / safe-zone indicator above them.
 */
export function ChildrenScene({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Two girls protected by Alehu safety system"
      role="img"
    >
      {/* ── Sky gradient background ── */}
      <rect width="480" height="360" rx="24" fill="var(--accent-bg)"/>
      <ellipse cx="240" cy="380" rx="260" ry="80" fill="var(--surface-2)" opacity="0.6"/>

      {/* ── Safe-zone shield (floating) ── */}
      <g transform="translate(190,18)">
        {/* Glow ring */}
        <circle cx="50" cy="50" r="46" fill="var(--accent)" opacity="0.08"/>
        <circle cx="50" cy="50" r="38" fill="var(--accent)" opacity="0.10"/>
        {/* Shield body */}
        <path d="M50 10 L80 24 L80 54 Q80 76 50 90 Q20 76 20 54 L20 24 Z"
          fill="var(--accent)" opacity="0.18" stroke="var(--accent)" strokeWidth="2"/>
        {/* Checkmark */}
        <polyline points="36,52 46,62 66,40" stroke="var(--accent)" strokeWidth="3"
          strokeLinecap="round" strokeLinejoin="round"/>
      </g>

      {/* ══════════════════════════════
          GIRL 1 — younger child (left)
      ══════════════════════════════ */}
      <g transform="translate(80, 60)">
        {/* Body */}
        <rect x="30" y="120" width="60" height="110" rx="18" fill="#FBBF9A"/>
        {/* Dress / top */}
        <rect x="24" y="130" width="72" height="90" rx="16" fill="var(--accent)" opacity="0.85"/>
        {/* Collar */}
        <path d="M50 130 Q60 140 70 130" stroke="white" strokeWidth="2" fill="none"/>

        {/* Head */}
        <circle cx="60" cy="95" r="38" fill="#F5CBA8"/>
        {/* Hair — braids */}
        <path d="M24 78 Q18 95 22 115 Q30 120 36 108 Q34 90 38 78" fill="#3D1F10"/>
        <path d="M96 78 Q102 95 98 115 Q90 120 84 108 Q86 90 82 78" fill="#3D1F10"/>
        <path d="M26 75 Q60 55 94 75 Q88 50 60 44 Q32 50 26 75Z" fill="#3D1F10"/>
        {/* Face */}
        <circle cx="50" cy="96" r="4" fill="#3D1F10" opacity="0.6"/>
        <circle cx="70" cy="96" r="4" fill="#3D1F10" opacity="0.6"/>
        {/* Smile */}
        <path d="M50 108 Q60 116 70 108" stroke="#C47A5A" strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* Cheeks */}
        <circle cx="44" cy="106" r="6" fill="var(--accent)" opacity="0.25"/>
        <circle cx="76" cy="106" r="6" fill="var(--accent)" opacity="0.25"/>

        {/* Left arm */}
        <rect x="4" y="132" width="22" height="68" rx="11" fill="#F5CBA8"/>
        {/* Right arm */}
        <rect x="94" y="132" width="22" height="68" rx="11" fill="#F5CBA8"/>

        {/* ── Alehu Watch on left wrist ── */}
        <rect x="2" y="188" width="26" height="20" rx="7" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2"/>
        <rect x="6" y="192" width="18" height="12" rx="4" fill="var(--canvas)"/>
        <circle cx="15" cy="198" r="3" fill="var(--accent)"/>
        <circle cx="15" cy="198" r="5" fill="var(--accent)" opacity="0.2"/>
        {/* Strap */}
        <rect x="4" y="182" width="22" height="8" rx="4" fill="var(--accent)" opacity="0.7"/>
        <rect x="4" y="208" width="22" height="8" rx="4" fill="var(--accent)" opacity="0.7"/>

        {/* Legs */}
        <rect x="30" y="228" width="28" height="80" rx="14" fill="#F5CBA8"/>
        <rect x="62" y="228" width="28" height="80" rx="14" fill="#F5CBA8"/>
        {/* Shoes */}
        <ellipse cx="44" cy="308" rx="18" ry="9" fill="#3D1F10"/>
        <ellipse cx="76" cy="308" rx="18" ry="9" fill="#3D1F10"/>
      </g>

      {/* ══════════════════════════════
          GIRL 2 — teen (right)
      ══════════════════════════════ */}
      <g transform="translate(270, 30)">
        {/* Body */}
        <rect x="30" y="150" width="70" height="140" rx="20" fill="#E8B48A"/>
        {/* Outfit */}
        <rect x="22" y="158" width="86" height="125" rx="18" fill="#1A1A1A"/>
        {/* White collar detail */}
        <path d="M52 158 Q65 172 78 158" stroke="white" strokeWidth="2.5" fill="none"/>

        {/* Head */}
        <circle cx="65" cy="112" r="44" fill="#D4956A"/>
        {/* Hair — natural curly */}
        <path d="M22 95 Q18 70 40 55 Q65 42 90 55 Q112 70 108 95 Q100 60 65 52 Q30 60 22 95Z" fill="#1A1A1A"/>
        <path d="M20 95 Q14 110 18 128 Q26 134 32 120" fill="#1A1A1A"/>
        <path d="M110 95 Q116 110 112 128 Q104 134 98 120" fill="#1A1A1A"/>
        {/* Hair curls detail */}
        <path d="M22 100 Q28 88 24 80" stroke="#2D1A0A" strokeWidth="2" fill="none" opacity="0.6"/>
        <path d="M108 100 Q102 88 106 80" stroke="#2D1A0A" strokeWidth="2" fill="none" opacity="0.6"/>

        {/* Face */}
        <circle cx="53" cy="112" r="5" fill="#1A1A1A" opacity="0.7"/>
        <circle cx="77" cy="112" r="5" fill="#1A1A1A" opacity="0.7"/>
        {/* Smile */}
        <path d="M53 126 Q65 136 77 126" stroke="#B5703A" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* Cheeks */}
        <circle cx="44" cy="122" r="8" fill="var(--accent)" opacity="0.2"/>
        <circle cx="86" cy="122" r="8" fill="var(--accent)" opacity="0.2"/>

        {/* Arms */}
        <rect x="2" y="162" width="22" height="80" rx="11" fill="#D4956A"/>
        <rect x="106" y="162" width="22" height="80" rx="11" fill="#D4956A"/>

        {/* ── Alehu Watch on right wrist ── */}
        <rect x="104" y="226" width="26" height="22" rx="7" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2"/>
        <rect x="108" y="230" width="18" height="14" rx="4" fill="var(--canvas)"/>
        {/* Mini pulse line */}
        <polyline points="110,237 113,237 115,233 117,241 119,236 121,237 124,237"
          stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        {/* Strap */}
        <rect x="106" y="218" width="22" height="10" rx="5" fill="var(--accent)" opacity="0.7"/>
        <rect x="106" y="248" width="22" height="10" rx="5" fill="var(--accent)" opacity="0.7"/>

        {/* Legs */}
        <rect x="28" y="288" width="30" height="90" rx="15" fill="#D4956A"/>
        <rect x="72" y="288" width="30" height="90" rx="15" fill="#D4956A"/>
        {/* Shoes */}
        <ellipse cx="43" cy="376" rx="20" ry="10" fill="#1A1A1A"/>
        <ellipse cx="87" cy="376" rx="20" ry="10" fill="#1A1A1A"/>
      </g>

      {/* ── Floating alert badge ── */}
      <g transform="translate(200, 40)">
        <rect x="0" y="0" width="80" height="28" rx="14" fill="var(--surface)" stroke="var(--accent)" strokeWidth="1.5"/>
        <circle cx="16" cy="14" r="5" fill="var(--accent)"/>
        <text x="26" y="18" fontFamily="system-ui" fontSize="10" fontWeight="600" fill="var(--accent-txt)">All safe</text>
      </g>

      {/* ── Ground line ── */}
      <rect x="60" y="336" width="360" height="4" rx="2" fill="var(--border)"/>
    </svg>
  );
}
