import { useParams } from "react-router-dom";
import { usePortfolio } from "@/hooks/use-atlas-queries";
import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/cards/MetricCard";
import { ChartContainer } from "@/components/charts/ChartContainer";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { PageSkeleton } from "@/components/layout/LoadingSkeletons";
import { EmptyState } from "@/components/layout/EmptyState";
import { formatCurrency } from "@/lib/formatters";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell,
} from "recharts";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const PIE_COLORS = [
  "hsl(213, 70%, 55%)",
  "hsl(160, 60%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 60%, 60%)",
  "hsl(0, 72%, 55%)",
  "hsl(190, 70%, 50%)",
];

export default function PortfolioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: portfolio, isLoading } = usePortfolio(id || "");

  if (isLoading) return <AppLayout><PageSkeleton /></AppLayout>;
  if (!portfolio) return <AppLayout><EmptyState title="Portfolio not found" /></AppLayout>;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-lg font-semibold text-foreground">{portfolio.name}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {portfolio.strategyType} · Benchmark: {portfolio.benchmark}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <MetricCard label="AuM" value={formatCurrency(portfolio.aum)} />
          <MetricCard label="Holdings" value={portfolio.holdings.length} />
          <MetricCard label="Scenario Tests" value={portfolio.recentScenarios.length} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartContainer title="Regional Exposure" subtitle="Allocation by geography">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={portfolio.regionalExposure}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="region" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: "12px" }} />
                <Bar dataKey="weight" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer title="Sector Allocation">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={portfolio.sectorAllocation} dataKey="weight" nameKey="sector" cx="50%" cy="50%" outerRadius={90} strokeWidth={1} stroke="hsl(var(--border))">
                  {portfolio.sectorAllocation.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-2">
              {portfolio.sectorAllocation.map((s, i) => (
                <div key={s.sector} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  {s.sector} ({s.weight}%)
                </div>
              ))}
            </div>
          </ChartContainer>
        </div>

        {/* Holdings Table */}
        {portfolio.holdings.length > 0 && (
          <div className="rounded-lg border border-border bg-card">
            <div className="p-4 border-b border-border">
              <SectionHeader title="Holdings" className="mb-0" />
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Name</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Ticker</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Class</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Weight</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Market Value</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Region</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolio.holdings.map((h) => (
                  <TableRow key={h.id} className="border-border">
                    <TableCell className="text-sm text-foreground">{h.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{h.ticker}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{h.assetClass}</TableCell>
                    <TableCell className="font-mono text-sm">{h.weight}%</TableCell>
                    <TableCell className="font-mono text-sm">{formatCurrency(h.marketValue)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{h.region}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Vulnerability Summary */}
        <div className="rounded-lg border border-border bg-card p-4">
          <SectionHeader title="Vulnerability Summary" />
          <p className="text-sm text-muted-foreground">{portfolio.vulnerabilitySummary}</p>
        </div>
      </div>
    </AppLayout>
  );
}
