import { useEffect, useRef } from "react";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  type Simulation,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from "d3-force";
import { select } from "d3-selection";
import { drag } from "d3-drag";
import type { RiskPropagationNode, RiskPropagationEdge, RiskDomain, SeverityLevel } from "@/types/domain";

interface SimNode extends SimulationNodeDatum, RiskPropagationNode {}
interface SimLink extends SimulationLinkDatum<SimNode> {
  weight: number;
  mechanism: string;
}

const domainColor: Record<RiskDomain, string> = {
  climate: "hsl(var(--chart-2))",
  economy: "hsl(var(--chart-1))",
  infrastructure: "hsl(var(--chart-3))",
  health: "hsl(var(--chart-4))",
  policy: "hsl(var(--chart-5))",
  markets: "hsl(var(--primary))",
};

const severityRadius: Record<SeverityLevel, number> = {
  critical: 18,
  high: 15,
  medium: 12,
  low: 10,
  minimal: 8,
};

interface ForceGraphProps {
  nodes: RiskPropagationNode[];
  edges: RiskPropagationEdge[];
  selectedNodeId?: string | null;
  onSelectNode: (node: RiskPropagationNode) => void;
  height?: number;
}

export function ForceGraph({ nodes, edges, selectedNodeId, onSelectNode, height = 500 }: ForceGraphProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const simRef = useRef<Simulation<SimNode, SimLink> | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const svgEl = svgRef.current;
    if (!container || !svgEl) return;

    const width = container.clientWidth;
    const simNodes: SimNode[] = nodes.map((n) => ({ ...n }));
    const idToNode = new Map(simNodes.map((n) => [n.id, n]));
    const simLinks: SimLink[] = edges
      .filter((e) => idToNode.has(e.source) && idToNode.has(e.target))
      .map((e) => ({
        source: idToNode.get(e.source)!,
        target: idToNode.get(e.target)!,
        weight: e.weight,
        mechanism: e.mechanism,
      }));

    const svg = select(svgEl);
    svg.selectAll("*").remove();

    const defs = svg.append("defs");
    defs
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 22)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "hsl(var(--muted-foreground))");

    const linkGroup = svg.append("g").attr("class", "links");
    const nodeGroup = svg.append("g").attr("class", "nodes");

    const linkSel = linkGroup
      .selectAll("line")
      .data(simLinks)
      .enter()
      .append("line")
      .attr("stroke", "hsl(var(--border))")
      .attr("stroke-opacity", 0.7)
      .attr("stroke-width", (d) => 0.6 + d.weight * 2.2)
      .attr("marker-end", "url(#arrow)");

    const nodeSel = nodeGroup
      .selectAll("g")
      .data(simNodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .style("cursor", "pointer")
      .on("click", (_e, d) => onSelectNode(d));

    nodeSel
      .append("circle")
      .attr("r", (d) => severityRadius[d.severity])
      .attr("fill", (d) => domainColor[d.domain])
      .attr("fill-opacity", 0.85)
      .attr("stroke", (d) => (d.id === selectedNodeId ? "hsl(var(--primary))" : "hsl(var(--background))"))
      .attr("stroke-width", (d) => (d.id === selectedNodeId ? 3 : 1.5));

    nodeSel
      .append("text")
      .text((d) => d.label)
      .attr("text-anchor", "middle")
      .attr("dy", (d) => severityRadius[d.severity] + 12)
      .attr("font-size", 10)
      .attr("fill", "hsl(var(--foreground))")
      .attr("pointer-events", "none")
      .style("font-weight", 500);

    const sim = forceSimulation<SimNode>(simNodes)
      .force(
        "link",
        forceLink<SimNode, SimLink>(simLinks)
          .id((d) => d.id)
          .distance((d) => 90 + (1 - d.weight) * 60)
          .strength((d) => 0.3 + d.weight * 0.5)
      )
      .force("charge", forceManyBody<SimNode>().strength(-260))
      .force("center", forceCenter(width / 2, height / 2))
      .force("collide", forceCollide<SimNode>().radius((d) => severityRadius[d.severity] + 14))
      .on("tick", () => {
        linkSel
          .attr("x1", (d) => (d.source as SimNode).x ?? 0)
          .attr("y1", (d) => (d.source as SimNode).y ?? 0)
          .attr("x2", (d) => (d.target as SimNode).x ?? 0)
          .attr("y2", (d) => (d.target as SimNode).y ?? 0);
        nodeSel.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
      });

    simRef.current = sim;

    const dragBehavior = drag<SVGGElement, SimNode>()
      .on("start", (event, d) => {
        if (!event.active) sim.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) sim.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    nodeSel.call(dragBehavior as any);

    return () => {
      sim.stop();
      simRef.current = null;
    };
  }, [nodes, edges, selectedNodeId, onSelectNode, height]);

  return (
    <div ref={containerRef} className="w-full">
      <svg ref={svgRef} width="100%" height={height} className="block" />
    </div>
  );
}
