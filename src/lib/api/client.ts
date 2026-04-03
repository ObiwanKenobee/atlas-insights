// Atlas Sanctum — API Client Layer
// Uses mock data for local development. Replace with real endpoints when available.

import { mockDashboardSummary, mockAlerts, mockOpportunities } from "@/lib/mocks/dashboard";
import { mockScenarios } from "@/lib/mocks/scenarios";
import { mockSimulations } from "@/lib/mocks/simulations";
import { mockPortfolios } from "@/lib/mocks/portfolios";
import { mockRegionRisks } from "@/lib/mocks/risk-radar";
import { mockImpactAssets } from "@/lib/mocks/impact";
import { mockPropagationGraph } from "@/lib/mocks/graph";
import type {
  DashboardSummary, AlertItem, OpportunitySignal,
  Scenario, Simulation, Portfolio,
  RegionRiskSummary, ImpactAsset, RiskPropagationGraph,
} from "@/types/domain";

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export const api = {
  dashboard: {
    getSummary: async (): Promise<DashboardSummary> => { await delay(300); return mockDashboardSummary; },
    getAlerts: async (): Promise<AlertItem[]> => { await delay(200); return mockAlerts; },
    getOpportunities: async (): Promise<OpportunitySignal[]> => { await delay(200); return mockOpportunities; },
  },
  scenarios: {
    list: async (): Promise<Scenario[]> => { await delay(300); return mockScenarios; },
    get: async (id: string): Promise<Scenario | undefined> => { await delay(200); return mockScenarios.find(s => s.id === id); },
    create: async (data: Partial<Scenario>): Promise<Scenario> => {
      await delay(500);
      return { ...data, id: `sc${Date.now()}`, status: "draft", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Scenario;
    },
  },
  simulations: {
    list: async (): Promise<Simulation[]> => { await delay(300); return mockSimulations; },
    get: async (id: string): Promise<Simulation | undefined> => { await delay(200); return mockSimulations.find(s => s.id === id); },
    run: async (_scenarioId: string, _portfolioId: string): Promise<{ simulationId: string }> => {
      await delay(1000);
      return { simulationId: `sim${Date.now()}` };
    },
  },
  portfolios: {
    list: async (): Promise<Portfolio[]> => { await delay(300); return mockPortfolios; },
    get: async (id: string): Promise<Portfolio | undefined> => { await delay(200); return mockPortfolios.find(p => p.id === id); },
  },
  riskRadar: {
    getRegions: async (): Promise<RegionRiskSummary[]> => { await delay(400); return mockRegionRisks; },
  },
  impact: {
    getAssets: async (): Promise<ImpactAsset[]> => { await delay(300); return mockImpactAssets; },
  },
  graph: {
    getPropagation: async (_id?: string): Promise<RiskPropagationGraph> => { await delay(400); return mockPropagationGraph; },
  },
};
