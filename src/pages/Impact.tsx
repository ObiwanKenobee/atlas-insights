import { useImpactAssets } from "@/hooks/use-atlas-queries";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { VerificationBadge, ConfidenceBadge } from "@/components/badges/StatusBadges";
import { ChartContainer } from "@/components/charts/ChartContainer";
import { PageSkeleton } from "@/components/layout/LoadingSkeletons";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { AlertTriangle } from "lucide-react";

export default function ImpactPage() {
  const { data: assets, isLoading } = useImpactAssets();

  if (isLoading) return <AppLayout><PageSkeleton /></AppLayout>;

  const chartData = assets?.map((a) => ({
    name: a.name.length > 20 ? a.name.substring(0, 20) + "…" : a.name,
    claimed: a.claimedScore,
    verified: a.verifiedScore,
  }));

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Impact Verification</h1>
          <p className="text-xs text-muted-foreground mt-0.5">ESG truth layer — claimed vs verified metrics</p>
        </div>

        {/* Scorecards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["Carbon", "Water", "Biodiversity", "Social Resilience"].map((metric) => {
            const verified = assets?.filter(a => a.verificationStatus === "verified").length || 0;
            const total = assets?.length || 0;
            return (
              <div key={metric} className="rounded-lg border border-border bg-card p-4">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{metric}</span>
                <p className="text-xl font-mono font-semibold text-foreground mt-1">
                  {verified}/{total}
                </p>
                <p className="text-[10px] text-muted-foreground">verified assets</p>
              </div>
            );
          })}
        </div>

        {/* Claimed vs Verified Chart */}
        <ChartContainer title="Claimed vs Verified Scores" subtitle="Aggregate impact scores by asset">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="claimed" fill="hsl(var(--muted-foreground))" name="Claimed" radius={[4, 4, 0, 0]} />
              <Bar dataKey="verified" fill="hsl(var(--primary))" name="Verified" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Asset Table */}
        <div className="rounded-lg border border-border bg-card">
          <div className="p-4 border-b border-border">
            <SectionHeader title="Asset Verification Table" className="mb-0" />
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Asset</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Class</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Region</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Status</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Claimed</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Verified</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Flags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets?.map((asset) => (
                <TableRow key={asset.id} className="border-border">
                  <TableCell className="text-sm text-foreground">{asset.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{asset.assetClass}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{asset.region}</TableCell>
                  <TableCell><VerificationBadge status={asset.verificationStatus} /></TableCell>
                  <TableCell className="font-mono text-sm">{asset.claimedScore.toFixed(1)}</TableCell>
                  <TableCell className="font-mono text-sm">{asset.verifiedScore > 0 ? asset.verifiedScore.toFixed(1) : "—"}</TableCell>
                  <TableCell>
                    {asset.redFlags.length > 0 && (
                      <div className="flex items-center gap-1 text-destructive">
                        <AlertTriangle className="h-3 w-3" />
                        <span className="text-[10px]">{asset.redFlags.length}</span>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Red Flags Panel */}
        {assets?.some(a => a.redFlags.length > 0) && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <SectionHeader title="Red Flags & Inconsistencies" />
            <div className="space-y-3">
              {assets?.filter(a => a.redFlags.length > 0).map((asset) => (
                <div key={asset.id}>
                  <p className="text-xs font-medium text-foreground mb-1">{asset.name}</p>
                  <ul className="space-y-0.5">
                    {asset.redFlags.map((flag, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex gap-2">
                        <AlertTriangle className="h-3 w-3 text-destructive shrink-0 mt-0.5" />
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
