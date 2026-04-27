import { useDashboardSummary, useAlerts, useOpportunities } from "@/hooks/use-atlas-queries";
import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/cards/MetricCard";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { ChartContainer } from "@/components/charts/ChartContainer";
import { SeverityBadge, ConfidenceBadge } from "@/components/badges/StatusBadges";
import { PageSkeleton } from "@/components/layout/LoadingSkeletons";
import { formatDateTime } from "@/lib/formatters";
import { Activity, ShieldCheck, Briefcase, FlaskConical, Gauge } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { AnimatedPage, staggerContainer, staggerItem } from "@/components/layout/AnimatedPage";

export default function DashboardPage() {
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  const { data: alerts } = useAlerts();
  const { data: opportunities } = useOpportunities();

  if (summaryLoading || !summary) {
    return <AppLayout><PageSkeleton /></AppLayout>;
  }

  return (
    <AppLayout>
      <AnimatedPage>
        <div className="space-y-6">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Executive Dashboard</h1>
            <p className="text-xs text-muted-foreground mt-0.5">System overview and decision intelligence summary</p>
          </div>

          {/* KPI Strip */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-5 gap-3"
          >
            {[
              { label: "Active Scenarios", value: summary.activeScenarios, icon: <FlaskConical className="h-4 w-4" /> },
              { label: "Simulations Run", value: summary.simulationsRun, icon: <Activity className="h-4 w-4" /> },
              { label: "At-Risk Portfolios", value: summary.atRiskPortfolios, icon: <Briefcase className="h-4 w-4" /> },
              { label: "Verified Impact Assets", value: summary.verifiedImpactAssets.toLocaleString(), icon: <ShieldCheck className="h-4 w-4" /> },
              { label: "System Confidence", value: summary.systemConfidenceScore, suffix: "%", icon: <Gauge className="h-4 w-4" /> },
            ].map((m) => (
              <motion.div key={m.label} variants={staggerItem}>
                <MetricCard label={m.label} value={m.value as any} suffix={(m as any).suffix} icon={m.icon} />
              </motion.div>
            ))}
          </motion.div>

          {/* Charts Row */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            <motion.div variants={staggerItem}>
              <ChartContainer title="Systemic Risk Trend" subtitle="12-month rolling index">
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={summary.riskTrend}>
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
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </motion.div>

            <motion.div variants={staggerItem}>
              <ChartContainer title="Portfolio Exposure by Sector" subtitle="Current allocation distribution">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={summary.sectorExposure} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis type="category" dataKey="sector" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="exposure" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </motion.div>
          </motion.div>

          {/* Alerts and Opportunities */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            <motion.div variants={staggerItem} className="rounded-lg border border-border bg-card p-4">
              <SectionHeader title="High Priority Alerts" subtitle={`${alerts?.filter(a => !a.acknowledged).length || 0} unacknowledged`} />
              <div className="space-y-3">
                {alerts?.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 rounded-md bg-muted/30 border border-border/50">
                    <SeverityBadge level={alert.severity} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{alert.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{alert.description}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{formatDateTime(alert.timestamp)} · {alert.source}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={staggerItem} className="rounded-lg border border-border bg-card p-4">
              <SectionHeader title="Opportunity Signals" />
              <div className="space-y-3">
                {opportunities?.map((opp) => (
                  <div key={opp.id} className="p-3 rounded-md bg-muted/30 border border-border/50">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-foreground">{opp.title}</p>
                      <ConfidenceBadge level={opp.confidence} />
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{opp.rationale}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                      <span>{opp.region}</span>
                      <span>·</span>
                      <span>{opp.sector}</span>
                      <span>·</span>
                      <span className="text-success font-medium">+{opp.expectedReturn}% expected</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </AnimatedPage>
    </AppLayout>
  );
}
