import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/cards/MetricCard";
import { ChartContainer } from "@/components/charts/ChartContainer";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { SimulationStatusBadge } from "@/components/badges/StatusBadges";
import { PageSkeleton } from "@/components/layout/LoadingSkeletons";
import { EmptyState } from "@/components/layout/EmptyState";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatDateTime } from "@/lib/formatters";
import {
  TrendingDown, BarChart3, ShieldAlert, Gauge, Download, Trash2, AlertTriangle, CheckCircle2,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell, ReferenceLine,
} from "recharts";
import { useDeleteSimulation, useSimulation } from "@/hooks/use-atlas-queries";
import { downloadSimulationCsv } from "@/lib/exports/simulation-csv";
import { toast } from "@/hooks/use-toast";

function severityFromConfidence(score: number | null) {
  if (score === null) return { label: "Pending", className: "text-muted-foreground bg-muted" };
  if (score >= 80) return { label: "High confidence", className: "text-success bg-success/10" };
  if (score >= 65) return { label: "Medium confidence", className: "text-chart-4 bg-chart-4/10" };
  return { label: "Low confidence", className: "text-destructive bg-destructive/10" };
}

export default function SimulationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: sim, isLoading } = useSimulation(id ?? "", { pollWhileRunning: true });
  const deleteMut = useDeleteSimulation();
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (isLoading) return <AppLayout><PageSkeleton /></AppLayout>;
  if (!sim)
    return (
      <AppLayout>
        <EmptyState title="Simulation not found" description="This run may have been deleted." />
      </AppLayout>
    );

  const isRunning = sim.status === "queued" || sim.status === "running";
  const conf = severityFromConfidence(sim.riskConfidenceScore);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-lg font-semibold text-foreground">{sim.scenarioName}</h1>
              <SimulationStatusBadge status={sim.status} />
            </div>
            <p className="text-xs text-muted-foreground">
              Portfolio: {sim.portfolioName} · Started {formatDateTime(sim.startedAt)}
              {sim.completedAt && ` · Completed ${formatDateTime(sim.completedAt)}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => downloadSimulationCsv(sim)}
              disabled={sim.status !== "completed"}
            >
              <Download className="h-3.5 w-3.5" /> Download CSV
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground hover:text-destructive"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
          </div>
        </div>

        {/* Progress strip while running */}
        {isRunning && (
          <div className="rounded-lg border border-border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {sim.status === "queued"
                  ? "Run queued — waiting for the simulation engine."
                  : "Simulation in progress — propagating shocks across the network."}
              </p>
              <span className="font-mono text-xs text-foreground">{sim.progress}%</span>
            </div>
            <Progress value={sim.progress} className="h-1.5" />
            <p className="text-[10px] text-muted-foreground">
              Live status updates every 1.5s. Results will appear automatically.
            </p>
          </div>
        )}

        {sim.status === "failed" && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">Simulation failed</p>
              <p className="text-xs text-destructive/80 mt-0.5">
                {sim.errorMessage ?? "An unexpected error occurred during the run."}
              </p>
            </div>
          </div>
        )}

        {sim.status === "completed" && (
          <>
            {/* Confidence + alert summary */}
            <div className="rounded-lg border border-border bg-card p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                  Risk confidence
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-mono text-foreground">
                    {sim.riskConfidenceScore}%
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wider ${conf.className}`}>
                    {conf.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Composite confidence in the modeled trajectory.
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                  Worst sector
                </p>
                {(() => {
                  const worst = [...sim.sectorImpact].sort((a, b) => a.impact - b.impact)[0];
                  return worst ? (
                    <>
                      <p className="text-sm font-medium text-foreground">{worst.sector}</p>
                      <p className="text-xs text-destructive font-mono">{worst.impact}%</p>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground">—</p>
                  );
                })()}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                  Alert summary
                </p>
                <div className="space-y-1">
                  {(sim.expectedDrawdown ?? 0) <= -5 ? (
                    <div className="flex items-start gap-1.5 text-xs text-destructive">
                      <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
                      Drawdown exceeds -5% loss threshold
                    </div>
                  ) : (
                    <div className="flex items-start gap-1.5 text-xs text-success">
                      <CheckCircle2 className="h-3 w-3 mt-0.5 shrink-0" />
                      Drawdown within tolerance
                    </div>
                  )}
                  {(sim.volatilityIncrease ?? 0) >= 8 && (
                    <div className="flex items-start gap-1.5 text-xs text-chart-4">
                      <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
                      Volatility shock above 8%
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard
                label="Expected Drawdown"
                value={`${sim.expectedDrawdown}%`}
                icon={<TrendingDown className="h-4 w-4" />}
              />
              <MetricCard
                label="Volatility Increase"
                value={`+${sim.volatilityIncrease}%`}
                icon={<BarChart3 className="h-4 w-4" />}
              />
              <MetricCard
                label="Exposure Shift"
                value={`${sim.exposureConcentrationShift}%`}
                icon={<ShieldAlert className="h-4 w-4" />}
              />
              <MetricCard
                label="Risk Confidence"
                value={`${sim.riskConfidenceScore}%`}
                icon={<Gauge className="h-4 w-4" />}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ChartContainer
                title="Expected Drawdown Over Time"
                subtitle="Portfolio value trajectory under scenario"
              >
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={sim.drawdownTimeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                        fontSize: "12px",
                      }}
                    />
                    <ReferenceLine y={0} stroke="hsl(var(--border))" />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--destructive))"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "hsl(var(--destructive))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>

              <ChartContainer title="Sector Impact" subtitle="Percentage impact by sector">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={sim.sectorImpact} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      type="category"
                      dataKey="sector"
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      width={110}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                        fontSize: "12px",
                      }}
                    />
                    <ReferenceLine x={0} stroke="hsl(var(--border))" />
                    <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                      {sim.sectorImpact.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={entry.impact < 0 ? "hsl(var(--destructive))" : "hsl(var(--success))"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            {/* Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-lg border border-border bg-card p-4 space-y-4">
                <SectionHeader title="Key Drivers" />
                <ul className="space-y-2">
                  {sim.drivers.map((d, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex gap-2">
                      <span className="text-primary shrink-0">→</span>{d}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-card p-4 space-y-4">
                <SectionHeader title="Recommendations" subtitle="Repositioning options" />
                <ul className="space-y-2">
                  {sim.recommendations.map((r, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex gap-2">
                      <span className="text-success shrink-0">◆</span>{r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <SectionHeader title="Assumptions" />
              <ul className="space-y-1.5">
                {sim.assumptions.map((a, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex gap-2">
                    <span className="text-muted-foreground/50">•</span>{a}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this simulation run?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the run, including all computed metrics.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMut.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMut.isPending}
              onClick={() => {
                if (!sim) return;
                deleteMut.mutate(sim.id, {
                  onSuccess: () => {
                    toast({ title: "Simulation run deleted" });
                    navigate("/simulations");
                  },
                  onError: (err) =>
                    toast({
                      title: "Could not delete run",
                      description: err instanceof Error ? err.message : "Unknown error",
                      variant: "destructive",
                    }),
                });
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
