import type {
  RiskPropagationGraph,
  RiskPropagationNode,
  RiskPropagationEdge,
  SeverityLevel,
} from "@/types/domain";

// ---- Path discovery (longest-weight upstream chain into a node) ----

export interface ChainHop {
  source: RiskPropagationNode;
  target: RiskPropagationNode;
  weight: number;
  mechanism: string;
}

/**
 * Walk backwards from `node` along the highest-weight incoming edges to build
 * a single causal chain. Stops at sources or after a hop limit.
 */
export function buildUpstreamChain(
  graph: RiskPropagationGraph,
  node: RiskPropagationNode,
  maxHops = 6,
): ChainHop[] {
  const nodeById = new Map(graph.nodes.map((n) => [n.id, n]));
  const hops: ChainHop[] = [];
  const visited = new Set<string>([node.id]);
  let current: RiskPropagationNode | undefined = node;

  for (let i = 0; i < maxHops && current; i++) {
    const incoming = graph.edges
      .filter((e) => e.target === current!.id && !visited.has(e.source))
      .sort((a, b) => b.weight - a.weight);
    const next = incoming[0];
    if (!next) break;
    const sourceNode = nodeById.get(next.source);
    if (!sourceNode) break;
    hops.unshift({
      source: sourceNode,
      target: current,
      weight: next.weight,
      mechanism: next.mechanism,
    });
    visited.add(sourceNode.id);
    current = sourceNode;
  }
  return hops;
}

// ---- Per-node verification & ESG truth metrics (synthetic, deterministic) ----

export interface NodeVerificationMetrics {
  contributionScore: number; // 0-100, share of explained risk into the selected node
  truthIndex: number;        // 0-100, evidence quality
  esg: { carbon: number; water: number; biodiversity: number; social: number };
  verificationStatus: "verified" | "pending" | "flagged" | "unverified";
  evidenceSources: string[];
}

const severityWeight: Record<SeverityLevel, number> = {
  critical: 1.0,
  high: 0.8,
  medium: 0.6,
  low: 0.4,
  minimal: 0.2,
};

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h = (h ^ s.charCodeAt(i)) >>> 0;
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

function pseudo(seed: number, salt: string, min: number, max: number): number {
  const v = ((hashStr(salt) ^ seed) % 1000) / 1000;
  return Math.round((min + v * (max - min)) * 10) / 10;
}

export function metricsForNode(
  node: RiskPropagationNode,
  edges: RiskPropagationEdge[],
): NodeVerificationMetrics {
  const incoming = edges.filter((e) => e.target === node.id);
  const incomingTotal = incoming.reduce((s, e) => s + e.weight, 0);
  const totalAcrossGraph = edges.reduce((s, e) => s + e.weight, 0) || 1;
  const contributionScore = Math.round(
    Math.min(100, (incomingTotal / totalAcrossGraph) * 100 + severityWeight[node.severity] * 35),
  );

  const seed = hashStr(node.id);
  const truthIndex = Math.round(60 + (seed % 35));

  const esg = {
    carbon: pseudo(seed, "carbon", 40, 95),
    water: pseudo(seed, "water", 35, 95),
    biodiversity: pseudo(seed, "bio", 30, 92),
    social: pseudo(seed, "social", 45, 95),
  };

  const statuses: NodeVerificationMetrics["verificationStatus"][] = [
    "verified", "pending", "flagged", "unverified",
  ];
  const verificationStatus = statuses[seed % statuses.length];

  const evidenceSources = [
    "IPCC AR6 regional projections",
    "Bloomberg climate indicators (live)",
    "World Bank macro panel (Q4)",
    "Internal scenario library — institutional analysts",
  ].slice(0, 2 + (seed % 3));

  return {
    contributionScore,
    truthIndex,
    esg,
    verificationStatus,
    evidenceSources,
  };
}
