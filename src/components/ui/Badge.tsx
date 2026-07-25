import { cn } from "@/lib/utils";

const kinds = {
  hot: "bg-danger/15 text-danger",
  new: "bg-info/15 text-info",
  top: "bg-em/15 text-em",
  neutral: "bg-raise text-sub",
  live: "bg-danger/15 text-danger",
} as const;

export function Badge({
  kind = "neutral",
  children,
  className,
}: {
  kind?: keyof typeof kinds;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10.5px] font-extrabold uppercase tracking-wide",
        kinds[kind],
        className,
      )}
    >
      {kind === "live" && (
        <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-danger" />
      )}
      {children}
    </span>
  );
}
