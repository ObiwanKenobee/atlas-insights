import { supabase } from "@/integrations/supabase/client";
import type { SimulationStatus } from "@/types/domain";

export interface SimulationRun {
  id: string;
  scenarioId: string | null;
  scenarioName: string;
  portfolioId: string;
  portfolioName: string;
  status: SimulationStatus;
  progress: number;
  startedAt: string;
  completedAt: string | null;
  expectedDrawdown: number | null;
  volatilityIncrease: number | null;
  exposureConcentrationShift: number | null;
  riskConfidenceScore: number | null;
  drawdownTimeline: { date: string; value: number }[];
  sectorImpact: { sector: string; impact: number }[];
  drivers: string[];
  recommendations: string[];
  assumptions: string[];
  errorMessage: string | null;
}

type Row = {
  id: string;
  scenario_id: string | null;
  scenario_name: string;
  portfolio_id: string;
  portfolio_name: string;
  status: string;
  progress: number;
  started_at: string;
  completed_at: string | null;
  expected_drawdown: number | string | null;
  volatility_increase: number | string | null;
  exposure_concentration_shift: number | string | null;
  risk_confidence_score: number | string | null;
  drawdown_timeline: unknown;
  sector_impact: unknown;
  drivers: unknown;
  recommendations: unknown;
  assumptions: unknown;
  error_message: string | null;
};

function num(v: number | string | null): number | null {
  if (v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function rowToRun(r: Row): SimulationRun {
  return {
    id: r.id,
    scenarioId: r.scenario_id,
    scenarioName: r.scenario_name,
    portfolioId: r.portfolio_id,
    portfolioName: r.portfolio_name,
    status: r.status as SimulationStatus,
    progress: r.progress ?? 0,
    startedAt: r.started_at,
    completedAt: r.completed_at,
    expectedDrawdown: num(r.expected_drawdown),
    volatilityIncrease: num(r.volatility_increase),
    exposureConcentrationShift: num(r.exposure_concentration_shift),
    riskConfidenceScore: num(r.risk_confidence_score),
    drawdownTimeline: (r.drawdown_timeline as { date: string; value: number }[]) ?? [],
    sectorImpact: (r.sector_impact as { sector: string; impact: number }[]) ?? [],
    drivers: (r.drivers as string[]) ?? [],
    recommendations: (r.recommendations as string[]) ?? [],
    assumptions: (r.assumptions as string[]) ?? [],
    errorMessage: r.error_message,
  };
}

export const simulationsApi = {
  async list(): Promise<SimulationRun[]> {
    const { data, error } = await supabase
      .from("simulation_runs")
      .select("*")
      .order("started_at", { ascending: false });
    if (error) throw error;
    return (data as Row[]).map(rowToRun);
  },
  async get(id: string): Promise<SimulationRun | null> {
    const { data, error } = await supabase
      .from("simulation_runs")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? rowToRun(data as Row) : null;
  },
  async start(input: {
    scenarioId: string;
    portfolioId: string;
    portfolioName: string;
  }): Promise<{ runId: string }> {
    const { data, error } = await supabase.functions.invoke<{ runId: string }>(
      "run-simulation",
      { body: input },
    );
    if (error) throw error;
    if (!data?.runId) throw new Error("Failed to start simulation");
    return data;
  },
  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("simulation_runs").delete().eq("id", id);
    if (error) throw error;
  },
};
