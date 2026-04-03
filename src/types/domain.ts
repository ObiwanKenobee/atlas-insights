// ============================================================
// Atlas Sanctum — Domain Models
// ============================================================

export type SeverityLevel = "critical" | "high" | "medium" | "low" | "minimal";
export type ConfidenceLevel = "high" | "medium" | "low";
export type SimulationStatus = "queued" | "running" | "completed" | "failed";
export type ScenarioType = "climate" | "macro" | "infrastructure" | "geopolitical" | "policy" | "multi-factor";
export type VerificationStatus = "verified" | "pending" | "flagged" | "unverified";
export type RiskDomain = "climate" | "economy" | "infrastructure" | "health" | "policy" | "markets";

export interface DashboardSummary {
  activeScenarios: number;
  simulationsRun: number;
  atRiskPortfolios: number;
  verifiedImpactAssets: number;
  systemConfidenceScore: number;
  riskTrend: { date: string; value: number }[];
  sectorExposure: { sector: string; exposure: number; change: number }[];
}

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  severity: SeverityLevel;
  timestamp: string;
  source: string;
  acknowledged: boolean;
}

export interface OpportunitySignal {
  id: string;
  title: string;
  region: string;
  sector: string;
  confidence: ConfidenceLevel;
  expectedReturn: number;
  rationale: string;
}

export interface Scenario {
  id: string;
  name: string;
  type: ScenarioType;
  region: string;
  event: string;
  severity: number;
  duration: string;
  probability: number;
  status: "draft" | "active" | "archived";
  createdAt: string;
  updatedAt: string;
  affectedSectors: string[];
  notes?: string;
  assumptions?: string;
}

export interface Simulation {
  id: string;
  scenarioId: string;
  scenarioName: string;
  portfolioId: string;
  portfolioName: string;
  status: SimulationStatus;
  startedAt: string;
  completedAt?: string;
  expectedDrawdown: number;
  volatilityIncrease: number;
  exposureConcentrationShift: number;
  riskConfidenceScore: number;
  drawdownTimeline: { date: string; value: number }[];
  sectorImpact: { sector: string; impact: number }[];
  drivers: string[];
  recommendations: string[];
  assumptions: string[];
}

export interface Holding {
  id: string;
  name: string;
  ticker: string;
  assetClass: string;
  weight: number;
  marketValue: number;
  region: string;
  sector: string;
}

export interface Portfolio {
  id: string;
  name: string;
  strategyType: string;
  aum: number;
  benchmark: string;
  holdings: Holding[];
  regionalExposure: { region: string; weight: number }[];
  sectorAllocation: { sector: string; weight: number }[];
  recentScenarios: { scenarioId: string; scenarioName: string; date: string; result: string }[];
  vulnerabilitySummary: string;
}

export interface RiskSignal {
  id: string;
  region: string;
  category: string;
  severity: SeverityLevel;
  description: string;
  drivers: string[];
  affectedSectors: string[];
  confidence: ConfidenceLevel;
  portfolioImplications: string;
}

export interface RegionRiskSummary {
  region: string;
  overallSeverity: SeverityLevel;
  signals: RiskSignal[];
  topDrivers: string[];
  confidence: ConfidenceLevel;
}

export interface ImpactAsset {
  id: string;
  name: string;
  assetClass: string;
  region: string;
  verificationStatus: VerificationStatus;
  carbonScore: VerificationScore;
  waterScore: VerificationScore;
  biodiversityScore: VerificationScore;
  socialResilienceScore: VerificationScore;
  claimedScore: number;
  verifiedScore: number;
  redFlags: string[];
}

export interface VerificationScore {
  claimed: number;
  verified: number;
  confidence: ConfidenceLevel;
  lastVerified: string;
}

export interface RiskPropagationNode {
  id: string;
  label: string;
  domain: RiskDomain;
  severity: SeverityLevel;
  description: string;
}

export interface RiskPropagationEdge {
  source: string;
  target: string;
  weight: number;
  mechanism: string;
}

export interface RiskPropagationGraph {
  nodes: RiskPropagationNode[];
  edges: RiskPropagationEdge[];
}

export interface NavigationItem {
  title: string;
  url: string;
  icon: string;
  badge?: number;
}
