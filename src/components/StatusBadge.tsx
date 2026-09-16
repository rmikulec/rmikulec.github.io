import type { Project } from "@/lib/portfolio";

const STYLES: Record<Project["status"], { label: string; className: string }> = {
  active: { label: "Active", className: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30" },
  wip: { label: "WIP", className: "bg-amber-500/15 text-amber-300 ring-amber-500/30" },
  archived: { label: "Archived", className: "bg-slate-500/15 text-slate-300 ring-slate-500/30" },
};

export default function StatusBadge({ status }: { status: Project["status"] }) {
  const s = STYLES[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${s.className}`}
    >
      {s.label}
    </span>
  );
}
