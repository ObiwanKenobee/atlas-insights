import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { EmptyState } from "@/components/layout/EmptyState";
import { PageSkeleton } from "@/components/layout/LoadingSkeletons";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Pencil, Trash2, Play } from "lucide-react";
import { ScenarioForm } from "@/components/scenarios/ScenarioForm";
import {
  useScenarios, useCreateScenario, useUpdateScenario, useDeleteScenario,
} from "@/hooks/use-atlas-queries";
import type { Scenario, ScenarioType } from "@/types/domain";
import type { ScenarioInput } from "@/lib/api/scenarios";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/formatters";

const typeColors: Record<ScenarioType, string> = {
  climate: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  macro: "bg-chart-1/15 text-chart-1 border-chart-1/30",
  infrastructure: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  geopolitical: "bg-chart-5/15 text-chart-5 border-chart-5/30",
  policy: "bg-chart-4/15 text-chart-4 border-chart-4/30",
  "multi-factor": "bg-foreground/10 text-foreground border-foreground/20",
};

export default function ScenariosPage() {
  const navigate = useNavigate();
  const { data: scenarios, isLoading } = useScenarios();
  const createMut = useCreateScenario();
  const updateMut = useUpdateScenario();
  const deleteMut = useDeleteScenario();

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Scenario | null>(null);
  const [deleting, setDeleting] = useState<Scenario | null>(null);

  const handleCreate = (input: ScenarioInput) => {
    createMut.mutate(input, {
      onSuccess: () => {
        toast({ title: "Scenario created", description: input.name });
        setCreateOpen(false);
      },
      onError: (err) =>
        toast({
          title: "Could not create scenario",
          description: err instanceof Error ? err.message : "Unknown error",
          variant: "destructive",
        }),
    });
  };

  const handleUpdate = (input: ScenarioInput) => {
    if (!editing) return;
    updateMut.mutate(
      { id: editing.id, input },
      {
        onSuccess: () => {
          toast({ title: "Scenario updated", description: input.name });
          setEditing(null);
        },
        onError: (err) =>
          toast({
            title: "Could not update scenario",
            description: err instanceof Error ? err.message : "Unknown error",
            variant: "destructive",
          }),
      },
    );
  };

  const handleDelete = () => {
    if (!deleting) return;
    deleteMut.mutate(deleting.id, {
      onSuccess: () => {
        toast({ title: "Scenario deleted" });
        setDeleting(null);
      },
      onError: (err) =>
        toast({
          title: "Could not delete scenario",
          description: err instanceof Error ? err.message : "Unknown error",
          variant: "destructive",
        }),
    });
  };

  if (isLoading) return <AppLayout><PageSkeleton /></AppLayout>;

  return (
    <AppLayout>
      <div className="space-y-6">
        <SectionHeader
          title="Scenario Library"
          subtitle={`${scenarios?.length ?? 0} scenarios configured`}
          action={
            <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
              <Plus className="h-3.5 w-3.5" /> New Scenario
            </Button>
          }
        />

        {!scenarios?.length ? (
          <EmptyState
            title="No scenarios yet"
            description="Create your first scenario to model how a market or climate shock would propagate through your portfolios."
            action={
              <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
                <Plus className="h-3.5 w-3.5" /> New Scenario
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {scenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider border ${typeColors[scenario.type]}`}
                  >
                    {scenario.type}
                  </span>
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-medium uppercase tracking-wider ${
                        scenario.status === "active"
                          ? "text-success bg-success/10"
                          : "text-muted-foreground bg-muted"
                      }`}
                    >
                      {scenario.status}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreVertical className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditing(scenario)}>
                          <Pencil className="h-3.5 w-3.5 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate(`/simulations/new?scenarioId=${scenario.id}`)}
                        >
                          <Play className="h-3.5 w-3.5 mr-2" /> Run simulation
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleting(scenario)}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <h3 className="text-sm font-medium text-foreground mb-1">{scenario.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {scenario.event}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span>{scenario.region}</span>
                  <span>·</span>
                  <span>Severity {scenario.severity}/10</span>
                  <span>·</span>
                  <span>{scenario.duration}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {scenario.affectedSectors.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                    >
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
        )}
      </div>

      {/* Create */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Scenario</DialogTitle>
            <DialogDescription>Define parameters for the scenario you want to simulate.</DialogDescription>
          </DialogHeader>
          <ScenarioForm
            submitting={createMut.isPending}
            submitLabel="Create Scenario"
            onSubmit={handleCreate}
            onCancel={() => setCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Scenario</DialogTitle>
            <DialogDescription>Update scenario inputs. Existing simulation runs are not modified.</DialogDescription>
          </DialogHeader>
          <ScenarioForm
            initial={editing}
            submitting={updateMut.isPending}
            submitLabel="Save Changes"
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this scenario?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting?.name} will be removed. Past simulation runs that referenced it will be
              kept but will lose the link to the source scenario.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMut.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMut.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
