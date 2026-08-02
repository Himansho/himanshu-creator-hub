import type { ProjectStatus } from "@/lib/types";

const STATUS_STYLES: Record<
  ProjectStatus,
  { label: string; dot: string; className: string }
> = {
  draft: {
    label: "Draft",
    dot: "🟡",
    className: "bg-white/5 text-muted",
  },
  in_progress: {
    label: "In Progress",
    dot: "🔵",
    className: "bg-white/5 text-muted",
  },
  published: {
    label: "Published",
    dot: "🟢",
    className: "bg-success/10 text-success",
  },
};

export default function StatusBadge({ status }: { status: ProjectStatus }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.draft;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${style.className}`}
    >
      <span aria-hidden="true">{style.dot}</span>
      {style.label}
    </span>
  );
}
