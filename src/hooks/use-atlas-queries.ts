import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export const useDashboardSummary = () =>
  useQuery({ queryKey: ["dashboard", "summary"], queryFn: api.dashboard.getSummary });

export const useAlerts = () =>
  useQuery({ queryKey: ["dashboard", "alerts"], queryFn: api.dashboard.getAlerts });

export const useOpportunities = () =>
  useQuery({ queryKey: ["dashboard", "opportunities"], queryFn: api.dashboard.getOpportunities });

export const useScenarios = () =>
  useQuery({ queryKey: ["scenarios"], queryFn: api.scenarios.list });

export const useScenario = (id: string) =>
  useQuery({ queryKey: ["scenarios", id], queryFn: () => api.scenarios.get(id), enabled: !!id });

export const useSimulations = () =>
  useQuery({ queryKey: ["simulations"], queryFn: api.simulations.list });

export const useSimulation = (id: string) =>
  useQuery({ queryKey: ["simulations", id], queryFn: () => api.simulations.get(id), enabled: !!id });

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
