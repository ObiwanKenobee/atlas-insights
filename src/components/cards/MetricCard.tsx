import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  suffix?: string;
  icon?: ReactNode;
  className?: string;
}

export function MetricCard({ label, value, change, suffix, icon, className }: MetricCardProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-4", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-semibold font-mono tracking-tight text-card-foreground">
          {value}{suffix}
        </span>
        {change !== undefined && (
          <span className={cn(
            "flex items-center gap-0.5 text-xs font-medium mb-0.5",
            change > 0 ? "text-success" : change < 0 ? "text-destructive" : "text-muted-foreground"
          )}>
            {change > 0 ? <TrendingUp className="h-3 w-3" /> : change < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
            {change > 0 ? "+" : ""}{change}%
          </span>
        )}
      </div>
    </div>
  );
}
