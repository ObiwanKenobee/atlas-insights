import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { ScenarioForm } from "@/components/scenarios/ScenarioForm";
import { useCreateScenario } from "@/hooks/use-atlas-queries";
import { toast } from "@/hooks/use-toast";

export default function ScenarioBuilderPage() {
  const navigate = useNavigate();
  const createMut = useCreateScenario();

  return (
    <AppLayout>
      <div className="max-w-3xl space-y-6">
        <SectionHeader
          title="New Scenario"
          subtitle="Define scenario parameters for simulation"
        />
        <div className="rounded-lg border border-border bg-card p-6">
          <ScenarioForm
            submitting={createMut.isPending}
            submitLabel="Create Scenario"
            onSubmit={(input) =>
              createMut.mutate(input, {
                onSuccess: (s) => {
                  toast({ title: "Scenario created", description: s.name });
                  navigate("/scenarios");
                },
                onError: (err) =>
                  toast({
                    title: "Could not create scenario",
                    description: err instanceof Error ? err.message : "Unknown error",
                    variant: "destructive",
                  }),
              })
            }
            onCancel={() => navigate("/scenarios")}
          />
        </div>
      </div>
    </AppLayout>
  );
}
