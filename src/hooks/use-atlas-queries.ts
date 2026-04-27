import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { scenariosApi, type ScenarioInput } from "@/lib/api/scenarios";
import { simulationsApi } from "@/lib/api/simulations";

// ---- Dashboard / static mock-backed data ----
export const useDashboardSummary = () =>
  useQuery({ queryKey: ["dashboard", "summary"], queryFn: api.dashboard.getSummary });

export const useAlerts = () =>
  useQuery({ queryKey: ["dashboard", "alerts"], queryFn: api.dashboard.getAlerts });

export const useOpportunities = () =>
  useQuery({ queryKey: ["dashboard", "opportunities"], queryFn: api.dashboard.getOpportunities });

export const usePortfolios = () =>
  useQuery({ queryKey: ["portfolios"], queryFn: api.portfolios.list });

export const usePortfolio = (id: string) =>
  useQuery({ queryKey: ["portfolios", id], queryFn: () => api.portfolios.get(id), enabled: !!id });

export const useRiskRadar = () =>
  useQuery({ queryKey: ["risk-radar"], queryFn: api.riskRadar.getRegions });

export const useImpactAssets = () =>
  useQuery({ queryKey: ["impact", "assets"], queryFn: api.impact.getAssets });

export const usePropagationGraph = (id?: string) =>
  useQuery({ queryKey: ["graph", "propagation", id], queryFn: () => api.graph.getPropagation(id) });

// ---- Scenarios (Cloud-backed) ----
export const useScenarios = () =>
  useQuery({ queryKey: ["scenarios"], queryFn: scenariosApi.list });

export const useScenario = (id: string) =>
  useQuery({
    queryKey: ["scenarios", id],
    queryFn: () => scenariosApi.get(id),
    enabled: !!id,
  });

export const useCreateScenario = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ScenarioInput) => scenariosApi.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["scenarios"] }),
  });
};

export const useUpdateScenario = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ScenarioInput }) =>
      scenariosApi.update(id, input),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["scenarios"] });
      qc.invalidateQueries({ queryKey: ["scenarios", vars.id] });
    },
  });
};

export const useDeleteScenario = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => scenariosApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["scenarios"] }),
  });
};

// ---- Simulations (Cloud-backed) ----
export const useSimulations = () =>
  useQuery({ queryKey: ["simulations"], queryFn: simulationsApi.list });

export const useSimulation = (id: string, opts?: { pollWhileRunning?: boolean }) =>
  useQuery({
    queryKey: ["simulations", id],
    queryFn: () => simulationsApi.get(id),
    enabled: !!id,
    refetchInterval: (query) => {
      if (!opts?.pollWhileRunning) return false;
      const data = query.state.data;
      if (!data) return 1500;
      if (data.status === "queued" || data.status === "running") return 1500;
      return false;
    },
  });

export const useStartSimulation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: simulationsApi.start,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["simulations"] }),
  });
};

export const useDeleteSimulation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => simulationsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["simulations"] }),
  });
};
