import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Play } from "lucide-react";
import {
  usePortfolios, useScenarios, useStartSimulation,
} from "@/hooks/use-atlas-queries";
import { toast } from "@/hooks/use-toast";

export default function SimulationRunnerPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { data: scenarios, isLoading: loadingS } = useScenarios();
  const { data: portfolios, isLoading: loadingP } = usePortfolios();
  const start = useStartSimulation();

  const initialScenario = params.get("scenarioId") ?? "";
  const [scenarioId, setScenarioId] = useState(initialScenario);
  const [portfolioId, setPortfolioId] = useState("");

  const portfolio = useMemo(
    () => portfolios?.find((p) => p.id === portfolioId),
    [portfolios, portfolioId],
  );
  const scenario = useMemo(
    () => scenarios?.find((s) => s.id === scenarioId),
    [scenarios, scenarioId],
  );

  const handleRun = () => {
    if (!scenario || !portfolio) {
      toast({
        title: "Select inputs",
        description: "Pick a scenario and a portfolio before running.",
        variant: "destructive",
      });
      return;
    }
    start.mutate(
      {
        scenarioId: scenario.id,
        portfolioId: portfolio.id,
        portfolioName: portfolio.name,
      },
      {
        onSuccess: ({ runId }) => {
          toast({ title: "Simulation queued", description: scenario.name });
          navigate(`/simulations/${runId}`);
        },
        onError: (err) =>
          toast({
            title: "Could not start simulation",
            description: err instanceof Error ? err.message : "Unknown error",
            variant: "destructive",
          }),
      },
    );
  };

  return (
    <AppLayout>
      <div className="max-w-2xl space-y-6">
        <SectionHeader
          title="Run Simulation"
          subtitle="Submit a scenario against a portfolio to generate impact analytics."
        />

        <div className="rounded-lg border border-border bg-card p-6 space-y-6">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Scenario</Label>
            <Select
              value={scenarioId}
              onValueChange={setScenarioId}
              disabled={loadingS || !scenarios?.length}
            >
              <SelectTrigger className="bg-muted/50">
                <SelectValue placeholder={loadingS ? "Loading…" : "Select a scenario"} />
              </SelectTrigger>
              <SelectContent>
                {scenarios?.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}{" "}
                    <span className="text-muted-foreground">
                      · sev {s.severity}/10 · {s.region}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!loadingS && !scenarios?.length && (
              <p className="text-xs text-muted-foreground">
                No scenarios yet. Create one first from{" "}
                <button
                  className="text-primary underline-offset-2 hover:underline"
                  onClick={() => navigate("/scenarios")}
                  type="button"
                >
                  the scenario library
                </button>
                .
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Portfolio</Label>
            <Select
              value={portfolioId}
              onValueChange={setPortfolioId}
              disabled={loadingP || !portfolios?.length}
            >
              <SelectTrigger className="bg-muted/50">
                <SelectValue placeholder={loadingP ? "Loading…" : "Select a portfolio"} />
              </SelectTrigger>
              <SelectContent>
                {portfolios?.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}{" "}
                    <span className="text-muted-foreground">· {p.strategyType}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {scenario && portfolio && (
            <div className="rounded-md border border-border bg-muted/20 p-3 space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Run summary</p>
              <p className="text-sm text-foreground">{scenario.name}</p>
              <p className="text-xs text-muted-foreground">
                vs. <span className="text-foreground">{portfolio.name}</span> · {portfolio.benchmark}
              </p>
              <p className="text-xs text-muted-foreground">
                Severity {scenario.severity}/10 · {scenario.duration} ·{" "}
                {Math.round(scenario.probability * 100)}% probability
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/simulations")}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="gap-1.5"
              onClick={handleRun}
              disabled={start.isPending || !scenario || !portfolio}
            >
              <Play className="h-3.5 w-3.5" />
              {start.isPending ? "Submitting…" : "Run Simulation"}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
