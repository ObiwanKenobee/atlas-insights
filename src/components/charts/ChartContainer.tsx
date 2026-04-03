import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function ChartContainer({ title, subtitle, children, className, action }: ChartContainerProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">{title}</h3>
          {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
