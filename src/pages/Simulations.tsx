import { useSimulations } from "@/hooks/use-atlas-queries";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { SimulationStatusBadge } from "@/components/badges/StatusBadges";
import { PageSkeleton } from "@/components/layout/LoadingSkeletons";
import { formatDateTime } from "@/lib/formatters";
import { useNavigate } from "react-router-dom";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export default function SimulationsPage() {
  const { data: simulations, isLoading } = useSimulations();
  const navigate = useNavigate();

  if (isLoading) return <AppLayout><PageSkeleton /></AppLayout>;

  return (
    <AppLayout>
      <div className="space-y-6">
        <SectionHeader title="Simulation Runs" subtitle="Track and review simulation execution history" />

        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">ID</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Scenario</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Portfolio</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Status</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Drawdown</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Confidence</TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Started</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {simulations?.map((sim) => (
                <TableRow
                  key={sim.id}
                  className="border-border cursor-pointer hover:bg-muted/30"
                  onClick={() => navigate(`/simulations/${sim.id}`)}
                >
                  <TableCell className="font-mono text-xs text-muted-foreground">{sim.id}</TableCell>
                  <TableCell className="text-sm text-foreground">{sim.scenarioName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{sim.portfolioName}</TableCell>
                  <TableCell><SimulationStatusBadge status={sim.status} /></TableCell>
                  <TableCell className="font-mono text-sm">
                    {sim.status === "completed" ? (
                      <span className="text-destructive">{sim.expectedDrawdown}%</span>
                    ) : "—"}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {sim.status === "completed" ? `${sim.riskConfidenceScore}%` : "—"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDateTime(sim.startedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
