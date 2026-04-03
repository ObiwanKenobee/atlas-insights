import { useParams } from "react-router-dom";
import { useSimulation } from "@/hooks/use-atlas-queries";
import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/cards/MetricCard";
import { ChartContainer } from "@/components/charts/ChartContainer";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { SimulationStatusBadge, ConfidenceBadge } from "@/components/badges/StatusBadges";
import { PageSkeleton } from "@/components/layout/LoadingSkeletons";
import { EmptyState } from "@/components/layout/EmptyState";
import { formatDateTime } from "@/lib/formatters";
import { TrendingDown, BarChart3, ShieldAlert, Gauge } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell, ReferenceLine,
} from "recharts";

export default function SimulationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: sim, isLoading } = useSimulation(id || "");

  if (isLoading) return <AppLayout><PageSkeleton /></AppLayout>;
  if (!sim) return <AppLayout><EmptyState title="Simulation not found" /></AppLayout>;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
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
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard label="Expected Drawdown" value={`${sim.expectedDrawdown}%`} icon={<TrendingDown className="h-4 w-4" />} />
          <MetricCard label="Volatility Increase" value={`+${sim.volatilityIncrease}%`} icon={<BarChart3 className="h-4 w-4" />} />
          <MetricCard label="Exposure Shift" value={`${sim.exposureConcentrationShift}%`} icon={<ShieldAlert className="h-4 w-4" />} />
          <MetricCard label="Risk Confidence" value={`${sim.riskConfidenceScore}%`} icon={<Gauge className="h-4 w-4" />} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartContainer title="Expected Drawdown Over Time" subtitle="Portfolio value trajectory under scenario">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={sim.drawdownTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: "12px" }} />
                <ReferenceLine y={0} stroke="hsl(var(--border))" />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--destructive))" }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer title="Sector Impact" subtitle="Percentage impact by sector">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={sim.sectorImpact} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis type="category" dataKey="sector" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={100} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: "12px" }} />
                <ReferenceLine x={0} stroke="hsl(var(--border))" />
                <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                  {sim.sectorImpact.map((entry, i) => (
                    <Cell key={i} fill={entry.impact < 0 ? "hsl(var(--destructive))" : "hsl(var(--success))"} />
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
      </div>
    </AppLayout>
  );
}
