import type { ServiceItem } from "@/lib/data";

type ServiceIconProps = {
  name: ServiceItem["icon"];
  className?: string;
};

/** Icônes SVG utilisées sur les cartes de prestations. */
export default function ServiceIcon({ name, className }: ServiceIconProps) {
  const commonProps = {
    viewBox: "0 0 24 24",
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.3,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "urn":
      return (
        <svg {...commonProps}>
          <path d="M12 3c1.6 2.1 2.2 3.4 2.2 4.4a2.2 2.2 0 1 1-4.4 0C9.8 6.4 10.4 5.1 12 3Z" />
          <rect x="9.2" y="10.2" width="5.6" height="9.6" rx="0.6" />
          <line x1="6" y1="19.8" x2="18" y2="19.8" />
        </svg>
      );
    case "house":
      return (
        <svg {...commonProps}>
          <path d="M4 11.5L12 4l8 7.5" />
          <path d="M6 10.3V19a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8.7" />
          <rect x="10" y="14" width="4" height="6" />
        </svg>
      );
    case "plane":
      return (
        <svg {...commonProps} strokeWidth={1}>
          <path d="M21 15.5v-1.7l-8-5V4.2a1.5 1.5 0 0 0-3 0v4.6l-8 5v1.7l8-2.5V19l-2.5 1.8v1.4l3.5-1 3.5 1v-1.4L13 19v-5.7Z" />
        </svg>
      );
    case "torch":
      return (
        <svg {...commonProps}>
          <path d="M5 4h14l-7 9Z" />
          <line x1="12" y1="13" x2="12" y2="19.5" />
          <line x1="8" y1="19.5" x2="16" y2="19.5" />
          <line x1="16.2" y1="2.6" x2="10.3" y2="8.6" />
          <circle cx="16.6" cy="1.8" r="1.1" />
        </svg>
      );
    case "fire":
      return (
        <svg {...commonProps}>
          <path d="M9.5 4h5M8.3 4c0 1.4 1 2 1 2h5.4s1-.6 1-2M6.8 7.2h10.4l-1 12a2 2 0 0 1-2 1.8h-4.4a2 2 0 0 1-2-1.8Z" />
        </svg>
      );
    case "star":
      return (
        <svg {...commonProps}>
          <path d="M12 3.5l1.8 5.2L19 10.5l-5.2 1.8L12 17.5l-1.8-5.2L5 10.5l5.2-1.8Z" />
        </svg>
      );
    default:
      return null;
  }
}
