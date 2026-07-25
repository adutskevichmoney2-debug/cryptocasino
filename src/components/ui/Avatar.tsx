/* eslint-disable @next/next/no-img-element */
import { cn, getInitials, hashHue } from "@/lib/utils";

/** Аватар: загруженное фото или градиентная заглушка с инициалами */
export function Avatar({
  username,
  src,
  size = 36,
  className,
}: {
  username: string;
  src?: string | null;
  size?: number;
  className?: string;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={username}
        width={size}
        height={size}
        className={cn("shrink-0 rounded-full object-cover", className)}
        style={{ width: size, height: size }}
      />
    );
  }
  const hue = hashHue(username || "player");
  return (
    <span
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-full font-extrabold text-white",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `linear-gradient(135deg, hsl(${hue} 55% 45%), hsl(${(hue + 40) % 360} 60% 30%))`,
      }}
    >
      {getInitials(username || "P")}
    </span>
  );
}
