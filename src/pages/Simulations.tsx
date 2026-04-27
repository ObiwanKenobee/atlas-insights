import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { SimulationStatusBadge } from "@/components/badges/StatusBadges";
import { PageSkeleton } from "@/components/layout/LoadingSkeletons";
import { EmptyState } from "@/components/layout/EmptyState";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Trash2 } from "lucide-react";
import { formatDateTime } from "@/lib/formatters";
import { useDeleteSimulation, useSimulations } from "@/hooks/use-atlas-queries";
import type { SimulationRun } from "@/lib/api/simulations";
import { toast } from "@/hooks/use-toast";

export default function SimulationsPage() {
  const navigate = useNavigate();
  const { data: simulations, isLoading } = useSimulations();
  const deleteMut = useDeleteSimulation();
  const [deleting, setDeleting] = useState<SimulationRun | null>(null);

  if (isLoading) return <AppLayout><PageSkeleton /></AppLayout>;

  return (
    <AppLayout>
      <div className="space-y-6">
        <SectionHeader
          title="Simulation Runs"
          subtitle="Track and review simulation execution history"
          action={
            <Button size="sm" className="gap-1.5" onClick={() => navigate("/simulations/new")}>
              <Plus className="h-3.5 w-3.5" /> New Run
            </Button>
          }
        />

        {!simulations?.length ? (
          <EmptyState
            title="No simulation runs yet"
            description="Submit a scenario and a portfolio to generate your first run."
            action={
              <Button size="sm" className="gap-1.5" onClick={() => navigate("/simulations/new")}>
                <Plus className="h-3.5 w-3.5" /> New Run
              </Button>
            }
          />
        ) : (
          <div className="rounded-lg border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Scenario</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Portfolio</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Status</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground w-[160px]">Progress</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Drawdown</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Confidence</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">Started</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {simulations.map((sim) => (
                  <TableRow
                    key={sim.id}
                    className="border-border cursor-pointer hover:bg-muted/30"
                    onClick={() => navigate(`/simulations/${sim.id}`)}
                  >
                    <TableCell className="text-sm text-foreground">{sim.scenarioName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{sim.portfolioName}</TableCell>
                    <TableCell><SimulationStatusBadge status={sim.status} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={sim.progress ?? 0} className="h-1.5" />
                        <span className="font-mono text-[10px] text-muted-foreground w-8 shrink-0 text-right">
                          {sim.progress ?? 0}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {sim.status === "completed" && sim.expectedDrawdown !== null ? (
                        <span className="text-destructive">{sim.expectedDrawdown}%</span>
                      ) : "—"}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {sim.status === "completed" && sim.riskConfidenceScore !== null
                        ? `${sim.riskConfidenceScore}%`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDateTime(sim.startedAt)}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => setDeleting(sim)}
                        aria-label="Delete run"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this simulation run?</AlertDialogTitle>
            <AlertDialogDescription>
              The run for {deleting?.scenarioName} on {deleting?.portfolioName} will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMut.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMut.isPending}
              onClick={() => {
                if (!deleting) return;
                deleteMut.mutate(deleting.id, {
                  onSuccess: () => {
                    toast({ title: "Simulation run deleted" });
                    setDeleting(null);
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
