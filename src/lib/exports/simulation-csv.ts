import type { SimulationRun } from "@/lib/api/simulations";

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCsv(rows: (string | number | null | undefined)[][]): string {
  return rows.map((r) => r.map(csvEscape).join(",")).join("\n");
}

export function buildSimulationCsv(run: SimulationRun): string {
  const sections: string[] = [];

  sections.push(
    toCsv([
      ["Atlas Sanctum — Simulation Report"],
      ["Run ID", run.id],
      ["Scenario", run.scenarioName],
      ["Portfolio", run.portfolioName],
      ["Status", run.status],
      ["Started", run.startedAt],
      ["Completed", run.completedAt ?? ""],
    ]),
  );

  sections.push("");
  sections.push(
    toCsv([
      ["Metric", "Value"],
      ["Expected Drawdown (%)", run.expectedDrawdown ?? ""],
      ["Volatility Increase (%)", run.volatilityIncrease ?? ""],
      ["Exposure Concentration Shift (%)", run.exposureConcentrationShift ?? ""],
      ["Risk Confidence Score", run.riskConfidenceScore ?? ""],
    ]),
  );

  sections.push("");
  sections.push(toCsv([["Drawdown Timeline"], ["Period", "Value"]]));
  sections.push(toCsv(run.drawdownTimeline.map((p) => [p.date, p.value])));

  sections.push("");
  sections.push(toCsv([["Sector Impact"], ["Sector", "Impact (%)"]]));
  sections.push(toCsv(run.sectorImpact.map((s) => [s.sector, s.impact])));

  sections.push("");
  sections.push(toCsv([["Drivers"]]));
  sections.push(toCsv(run.drivers.map((d) => [d])));

  sections.push("");
  sections.push(toCsv([["Recommendations"]]));
  sections.push(toCsv(run.recommendations.map((r) => [r])));

  sections.push("");
  sections.push(toCsv([["Assumptions"]]));
  sections.push(toCsv(run.assumptions.map((a) => [a])));

  return sections.join("\n");
}

export function downloadSimulationCsv(run: SimulationRun) {
  const csv = buildSimulationCsv(run);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safeName = run.scenarioName.replace(/[^a-z0-9-_]+/gi, "_").slice(0, 60);
  a.download = `simulation_${safeName}_${run.id.slice(0, 8)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
