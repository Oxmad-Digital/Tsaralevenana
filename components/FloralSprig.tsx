type FloralSprigProps = {
  className?: string;
};

/**
 * Petit brin floral décoratif (SVG), utilisé dans les séparateurs de section
 * et dans les titres. Couleur héritée via `currentColor`.
 */
export default function FloralSprig({ className }: FloralSprigProps) {
  return (
    <svg viewBox="0 0 100 120" className={className} aria-hidden="true">
      <path
        d="M50,117 C49,96 42,74 37,50"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <path
        d="M50,117 C52,90 60,56 63,36"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <path
        d="M50,117 C50,102 50,86 50,76"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.3}
        strokeLinecap="round"
      />
      <path
        d="M44,88 C35,83 31,90 38,95 C43,93 44,90 44,88 Z"
        fill="currentColor"
        opacity={0.5}
      />
      <path
        d="M57,70 C66,65 70,72 63,77 C58,75 57,72 57,70 Z"
        fill="currentColor"
        opacity={0.5}
      />
      <path
        d="M50,64 C45,68 45,75 50,78 C55,75 55,68 50,64 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.3}
      />
      <g transform="translate(37,46)">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <ellipse
            key={angle}
            cx={0}
            cy={-7}
            rx={2}
            ry={6.5}
            transform={`rotate(${angle})`}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.2}
          />
        ))}
        <circle cx={0} cy={0} r={2.3} fill="currentColor" />
      </g>
      <g transform="translate(63,32)">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <ellipse
            key={angle}
            cx={0}
            cy={-8}
            rx={2.2}
            ry={7.5}
            transform={`rotate(${angle})`}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.2}
          />
        ))}
        <circle cx={0} cy={0} r={2.6} fill="currentColor" />
      </g>
    </svg>
  );
}
