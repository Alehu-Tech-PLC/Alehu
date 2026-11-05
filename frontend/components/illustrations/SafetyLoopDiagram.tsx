/**
 * SafetyLoopDiagram — four-step loop: Sense → Decide → Ping → Respond
 * Used on the How It Works page.
 */
export function SafetyLoopDiagram({ className = '' }: { className?: string }) {
  const steps = [
    { icon: '⌚', label: 'Sense', desc: 'Wearable captures motion, audio & GPS' },
    { icon: '🧠', label: 'Decide', desc: 'On-device AI classifies threats locally' },
    { icon: '📡', label: 'Ping',   desc: 'Encrypted alert reaches the cloud' },
    { icon: '🔔', label: 'Respond', desc: 'Guardians & officers act in seconds' },
  ];

  return (
    <svg
      viewBox="0 0 560 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alehu four-step safety loop diagram"
      role="img"
    >
      {steps.map((step, i) => {
        const cx = 60 + i * 130;
        return (
          <g key={step.label} transform={`translate(${cx - 50}, 20)`}>
            {/* Circle */}
            <circle cx="50" cy="50" r="38" fill="var(--accent-bg)" stroke="var(--accent)" strokeWidth="2"/>
            {/* Icon */}
            <text x="50" y="58" textAnchor="middle" fontSize="22">{step.icon}</text>
            {/* Step number */}
            <circle cx="78" cy="22" r="11" fill="var(--accent)"/>
            <text x="78" y="26" textAnchor="middle" fontFamily="system-ui" fontSize="10" fontWeight="700" fill="white">
              0{i + 1}
            </text>
            {/* Label */}
            <text x="50" y="110" textAnchor="middle" fontFamily="Georgia,serif" fontSize="13" fontWeight="700" fill="var(--ink)">
              {step.label}
            </text>
            {/* Description */}
            <text x="50" y="132" textAnchor="middle" fontFamily="system-ui" fontSize="9" fill="var(--ink-muted)">
              {step.desc.length > 28 ? step.desc.slice(0, 28) + '…' : step.desc}
            </text>

            {/* Arrow to next */}
            {i < 3 && (
              <g transform="translate(88, 42)">
                <line x1="0" y1="8" x2="30" y2="8" stroke="var(--accent)" strokeWidth="2" strokeDasharray="4 3"/>
                <polygon points="30,4 38,8 30,12" fill="var(--accent)"/>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
