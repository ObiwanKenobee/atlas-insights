import type { RiskPropagationGraph } from "@/types/domain";

export const mockPropagationGraph: RiskPropagationGraph = {
  nodes: [
    { id: "n1", label: "Mediterranean Drought", domain: "climate", severity: "critical", description: "Prolonged water scarcity across Southern Europe" },
    { id: "n2", label: "Agricultural Output Decline", domain: "economy", severity: "high", description: "Crop yield reduction of 25-35% in affected regions" },
    { id: "n3", label: "Food Price Inflation", domain: "economy", severity: "high", description: "Staple food prices increase 15-20% in import-dependent economies" },
    { id: "n4", label: "Sovereign Fiscal Pressure", domain: "policy", severity: "medium", description: "Emergency spending on water infrastructure and food subsidies" },
    { id: "n5", label: "Real Asset Devaluation", domain: "markets", severity: "medium", description: "Agricultural land and water-dependent properties lose 10-15% value" },
    { id: "n6", label: "Infrastructure Strain", domain: "infrastructure", severity: "medium", description: "Water distribution and cooling systems under stress" },
    { id: "n7", label: "Health Impact", domain: "health", severity: "low", description: "Heat-related health incidents increase in vulnerable populations" },
    { id: "n8", label: "Portfolio Drawdown", domain: "markets", severity: "high", description: "Expected -4.7% drawdown across exposed portfolios" },
    { id: "n9", label: "Migration Pressure", domain: "policy", severity: "medium", description: "Climate migration from rural to urban areas intensifies" },
    { id: "n10", label: "Insurance Cost Escalation", domain: "markets", severity: "medium", description: "Agricultural and property insurance premiums increase 20-30%" },
  ],
  edges: [
    { source: "n1", target: "n2", weight: 0.9, mechanism: "Direct water scarcity reduces irrigation capacity" },
    { source: "n1", target: "n6", weight: 0.7, mechanism: "Water infrastructure capacity exceeded" },
    { source: "n1", target: "n7", weight: 0.5, mechanism: "Heat stress compounds with water scarcity" },
    { source: "n2", target: "n3", weight: 0.85, mechanism: "Supply reduction drives price increase" },
    { source: "n2", target: "n5", weight: 0.7, mechanism: "Reduced productivity devalues agricultural assets" },
    { source: "n3", target: "n4", weight: 0.6, mechanism: "Governments forced to subsidize food imports" },
    { source: "n4", target: "n8", weight: 0.75, mechanism: "Fiscal deterioration impacts sovereign holdings" },
    { source: "n5", target: "n8", weight: 0.8, mechanism: "Direct portfolio exposure to devalued assets" },
    { source: "n5", target: "n10", weight: 0.65, mechanism: "Increased loss probability raises premiums" },
    { source: "n7", target: "n9", weight: 0.4, mechanism: "Health and livelihood impacts drive displacement" },
    { source: "n9", target: "n4", weight: 0.3, mechanism: "Migration increases fiscal burden on receiving areas" },
  ],
};
