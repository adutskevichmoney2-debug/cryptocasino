import { cn } from "@/lib/utils";

/**
 * CryptoCasino brand mark — hexagonal casino chip with a "C" core
 * and a crypto spark in the letter aperture. Signature emerald gradient.
 */
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="ccg" x1="8" y1="6" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2ADFA4" />
          <stop offset="0.55" stopColor="#17C588" />
          <stop offset="1" stopColor="#0E9C6B" />
        </linearGradient>
      </defs>
      {/* chip body */}
      <polygon
        points="24,3.5 41.7,13.75 41.7,34.25 24,44.5 6.3,34.25 6.3,13.75"
        fill="url(#ccg)"
        stroke="url(#ccg)"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      {/* inner face */}
      <polygon
        points="24,10.2 35.9,17.1 35.9,30.9 24,37.8 12.1,30.9 12.1,17.1"
        fill="#0B0E13"
        stroke="#0B0E13"
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
      {/* chip edge ticks */}
      <g stroke="#0B0E13" strokeWidth="3.1" strokeLinecap="round">
        <line x1="24" y1="1.6" x2="24" y2="7.6" />
        <line x1="24" y1="40.4" x2="24" y2="46.4" />
        <line x1="4.3" y1="12.6" x2="9.6" y2="15.6" />
        <line x1="38.4" y1="32.4" x2="43.7" y2="35.4" />
        <line x1="4.3" y1="35.4" x2="9.6" y2="32.4" />
        <line x1="38.4" y1="15.6" x2="43.7" y2="12.6" />
      </g>
      {/* C letterform */}
      <path
        d="M 30.4 29.9 A 8.6 8.6 0 1 1 30.4 18.1"
        stroke="#EDF2F7"
        strokeWidth="5.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* crypto spark in the aperture */}
      <rect x="30.1" y="21.9" width="4.2" height="4.2" rx="1" transform="rotate(45 32.2 24)" fill="url(#ccg)" />
    </svg>
  );
}

export function Logo({
  size = 30,
  wordmark = true,
  className,
}: {
  size?: number;
  wordmark?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex select-none items-center gap-2.5", className)}>
      <LogoMark size={size} />
      {wordmark && (
        <span
          className="whitespace-nowrap font-extrabold tracking-[-0.03em] text-ink"
          style={{ fontSize: size * 0.62 }}
        >
          Crypto<span className="text-em">Casino</span>
        </span>
      )}
    </span>
  );
}
