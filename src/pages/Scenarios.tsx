import { useScenarios } from "@/hooks/use-atlas-queries";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { SeverityBadge } from "@/components/badges/StatusBadges";
import { PageSkeleton } from "@/components/layout/LoadingSkeletons";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/lib/formatters";
import type { ScenarioType } from "@/types/domain";

const typeColors: Record<ScenarioType, string> = {
  climate: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  macro: "bg-chart-1/15 text-chart-1 border-chart-1/30",
  infrastructure: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  geopolitical: "bg-chart-5/15 text-chart-5 border-chart-5/30",
  policy: "bg-chart-4/15 text-chart-4 border-chart-4/30",
  "multi-factor": "bg-foreground/10 text-foreground border-foreground/20",
};

export default function ScenariosPage() {
  const { data: scenarios, isLoading } = useScenarios();
  const navigate = useNavigate();

  if (isLoading) return <AppLayout><PageSkeleton /></AppLayout>;

  return (
    <AppLayout>
      <div className="space-y-6">
        <SectionHeader
          title="Scenario Library"
          subtitle={`${scenarios?.length || 0} scenarios configured`}
          action={
            <Button size="sm" className="gap-1.5" onClick={() => navigate("/scenarios/new")}>
              <Plus className="h-3.5 w-3.5" /> New Scenario
            </Button>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {scenarios?.map((scenario) => (
            <div
              key={scenario.id}
              className="rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-colors cursor-pointer"
              onClick={() => navigate(`/scenarios/${scenario.id}`)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider border ${typeColors[scenario.type]}`}>
                  {scenario.type}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-medium uppercase tracking-wider
                  ${scenario.status === "active" ? "text-success bg-success/10" : scenario.status === "draft" ? "text-muted-foreground bg-muted" : "text-muted-foreground bg-muted"}`}>
                  {scenario.status}
                </span>
              </div>
              <h3 className="text-sm font-medium text-foreground mb-1">{scenario.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{scenario.event}</p>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span>{scenario.region}</span>
                <span>·</span>
                <span>Severity {scenario.severity}/10</span>
                <span>·</span>
                <span>{scenario.duration}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {scenario.affectedSectors.slice(0, 3).map((s) => (
                  <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                    {s}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-3">
                Updated {formatDate(scenario.updatedAt)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
