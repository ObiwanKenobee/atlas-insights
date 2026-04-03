import { cn } from "@/lib/utils";
import type { SeverityLevel, ConfidenceLevel, VerificationStatus, SimulationStatus } from "@/types/domain";

const severityStyles: Record<SeverityLevel, string> = {
  critical: "bg-severity-critical/15 text-severity-critical border-severity-critical/30",
  high: "bg-severity-high/15 text-severity-high border-severity-high/30",
  medium: "bg-severity-medium/15 text-severity-medium border-severity-medium/30",
  low: "bg-severity-low/15 text-severity-low border-severity-low/30",
  minimal: "bg-muted text-muted-foreground border-border",
};

const confidenceStyles: Record<ConfidenceLevel, string> = {
  high: "bg-confidence-high/15 text-confidence-high border-confidence-high/30",
  medium: "bg-confidence-medium/15 text-confidence-medium border-confidence-medium/30",
  low: "bg-confidence-low/15 text-confidence-low border-confidence-low/30",
};

const verificationStyles: Record<VerificationStatus, string> = {
  verified: "bg-success/15 text-success border-success/30",
  pending: "bg-warning/15 text-warning border-warning/30",
  flagged: "bg-destructive/15 text-destructive border-destructive/30",
  unverified: "bg-muted text-muted-foreground border-border",
};

const simulationStyles: Record<SimulationStatus, string> = {
  completed: "bg-success/15 text-success border-success/30",
  running: "bg-primary/15 text-primary border-primary/30",
  queued: "bg-muted text-muted-foreground border-border",
  failed: "bg-destructive/15 text-destructive border-destructive/30",
};

interface BadgeProps {
  className?: string;
}

export function SeverityBadge({ level, className }: BadgeProps & { level: SeverityLevel }) {
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border", severityStyles[level], className)}>
      {level}
    </span>
  );
}

export function ConfidenceBadge({ level, className }: BadgeProps & { level: ConfidenceLevel }) {
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border", confidenceStyles[level], className)}>
      {level}
    </span>
  );
}

export function VerificationBadge({ status, className }: BadgeProps & { status: VerificationStatus }) {
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border", verificationStyles[status], className)}>
      {status}
    </span>
  );
}

export function SimulationStatusBadge({ status, className }: BadgeProps & { status: SimulationStatus }) {
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border", simulationStyles[status], className)}>
      {status === "running" && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-subtle" />}
      {status}
    </span>
  );
}
