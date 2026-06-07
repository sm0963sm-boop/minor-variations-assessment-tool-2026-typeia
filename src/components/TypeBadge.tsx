import type { VariationType } from "@/lib/variations-data";

const STYLES: Record<VariationType, string> = {
  IA: "bg-success/15 text-success-foreground border-success/30",
  IAIN: "bg-info/15 text-info-foreground border-info/30",
};

const COLORS: Record<VariationType, string> = {
  IA: "bg-[color:var(--success)]",
  IAIN: "bg-[color:var(--info)]",
};

export function TypeBadge({ type, size = "md" }: { type: VariationType; size?: "sm" | "md" | "lg" }) {
  const sizing = size === "lg" ? "text-base px-4 py-1.5" : size === "sm" ? "text-[11px] px-2 py-0.5" : "text-xs px-3 py-1";
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border font-bold ${STYLES[type]} ${sizing}`}>
      <span className={`size-2 rounded-full ${COLORS[type]}`} />
      Type {type}
    </span>
  );
}
