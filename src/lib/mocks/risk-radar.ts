import type { RegionRiskSummary } from "@/types/domain";

export const mockRegionRisks: RegionRiskSummary[] = [
  {
    region: "Southern Europe",
    overallSeverity: "critical",
    topDrivers: ["Water scarcity", "Agricultural stress", "Heat infrastructure strain"],
    confidence: "high",
    signals: [
      {
        id: "rs1", region: "Southern Europe", category: "Climate",
        severity: "critical", description: "Prolonged drought reducing freshwater availability by 35%",
        drivers: ["Below-average precipitation", "Groundwater depletion", "Increased agricultural demand"],
        affectedSectors: ["Agriculture", "Real Assets", "Infrastructure"],
        confidence: "high",
        portfolioImplications: "Direct exposure through agricultural commodity holdings and Southern European real assets.",
      },
    ],
  },
  {
    region: "East Africa",
    overallSeverity: "high",
    topDrivers: ["Food insecurity", "Sovereign fiscal stress", "Political instability"],
    confidence: "medium",
    signals: [
      {
        id: "rs2", region: "East Africa", category: "Supply Chain",
        severity: "high", description: "Compound food security crisis affecting Kenya and Ethiopia",
        drivers: ["Drought cycle", "Import dependency", "Currency depreciation"],
        affectedSectors: ["Sovereign Debt", "Agriculture", "Healthcare"],
        confidence: "medium",
        portfolioImplications: "Sovereign debt holdings at elevated default risk. Healthcare sector strain as secondary effect.",
      },
    ],
  },
  {
    region: "Southeast Asia",
    overallSeverity: "medium",
    topDrivers: ["Trade route vulnerability", "Geopolitical tension", "Climate adaptation gaps"],
    confidence: "high",
    signals: [
      {
        id: "rs3", region: "Southeast Asia", category: "Conflict",
        severity: "medium", description: "Elevated disruption probability at Strait of Malacca",
        drivers: ["Naval activity increase", "Trade policy shifts", "Insurance cost escalation"],
        affectedSectors: ["Energy Transition", "Technology", "Infrastructure"],
        confidence: "high",
        portfolioImplications: "Supply chain dependent holdings face throughput reduction risk.",
      },
    ],
  },
  {
    region: "Western Europe",
    overallSeverity: "low",
    topDrivers: ["Energy policy transition", "Regulatory acceleration", "Fiscal adjustment"],
    confidence: "high",
    signals: [
      {
        id: "rs4", region: "Western Europe", category: "Policy Risk",
        severity: "low", description: "Accelerated natural gas subsidy phase-out creating transition pressure",
        drivers: ["EU Green Deal acceleration", "Carbon border adjustment", "Energy price reform"],
        affectedSectors: ["Energy Transition", "Infrastructure"],
        confidence: "high",
        portfolioImplications: "Positive for green infrastructure allocation. Transition risk for legacy energy holdings.",
      },
    ],
  },
  {
    region: "South America",
    overallSeverity: "medium",
    topDrivers: ["Commodity price volatility", "Deforestation policy", "Political cycle"],
    confidence: "medium",
    signals: [
      {
        id: "rs5", region: "South America", category: "Climate",
        severity: "medium", description: "Amazon deforestation rate acceleration impacting biodiversity metrics",
        drivers: ["Policy enforcement gaps", "Agricultural expansion", "Mining activity"],
        affectedSectors: ["Agriculture", "Real Assets", "Energy Transition"],
        confidence: "medium",
        portfolioImplications: "ESG verification scores at risk for Brazilian holdings. Carbon credit exposure affected.",
      },
    ],
  },
];
