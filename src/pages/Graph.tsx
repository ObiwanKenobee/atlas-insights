import { useState } from "react";
import { usePropagationGraph } from "@/hooks/use-atlas-queries";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { SeverityBadge } from "@/components/badges/StatusBadges";
import { PageSkeleton } from "@/components/layout/LoadingSkeletons";
import { Button } from "@/components/ui/button";
import { RISK_DOMAINS } from "@/lib/constants";
import type { RiskPropagationNode, RiskDomain } from "@/types/domain";
import { GitBranch, ArrowRight, Search } from "lucide-react";
import { ForceGraph } from "@/components/graph/ForceGraph";
import { PropagationChainDrawer } from "@/components/graph/PropagationChainDrawer";

const domainColors: Record<RiskDomain, string> = {
  climate: "bg-chart-2",
  economy: "bg-chart-1",
  infrastructure: "bg-chart-3",
  health: "bg-chart-4",
  policy: "bg-chart-5",
  markets: "bg-primary",
};

export default function GraphPage() {
  const { data: graph, isLoading } = usePropagationGraph();
  const [selectedDomains, setSelectedDomains] = useState<string[]>(RISK_DOMAINS.map(d => d.value));
  const [selectedNode, setSelectedNode] = useState<RiskPropagationNode | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openChainFor = (node: RiskPropagationNode) => {
    setSelectedNode(node);
    setDrawerOpen(true);
  };

  const toggleDomain = (value: string) => {
    setSelectedDomains(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  if (isLoading || !graph) return <AppLayout><PageSkeleton /></AppLayout>;

  const filteredNodes = graph.nodes.filter(n => selectedDomains.includes(n.domain));
  const filteredEdges = graph.edges.filter(e =>
    filteredNodes.some(n => n.id === e.source) && filteredNodes.some(n => n.id === e.target)
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Risk Propagation Graph</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Causal chain visualization from event source to portfolio consequence</p>
        </div>

        {/* Domain Filters */}
        <div className="flex flex-wrap gap-2">
          {RISK_DOMAINS.map((d) => (
            <Button
              key={d.value}
              size="sm"
              variant={selectedDomains.includes(d.value) ? "default" : "outline"}
              onClick={() => toggleDomain(d.value)}
              className="text-xs h-7 gap-1.5"
            >
              <div className={`w-2 h-2 rounded-full ${domainColors[d.value as RiskDomain]}`} />
              {d.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Force-directed graph */}
          <div className="lg:col-span-2 rounded-lg border border-border bg-card p-4">
            <SectionHeader
              title="Propagation Network"
              subtitle={`${filteredNodes.length} nodes · ${filteredEdges.length} edges · drag to reposition`}
            />
            <div className="mt-2">
              <ForceGraph
                nodes={filteredNodes}
                edges={filteredEdges}
                selectedNodeId={selectedNode?.id ?? null}
                onSelectNode={openChainFor}
                height={520}
              />
            </div>

            {/* Propagation Chain Summary */}
            <div className="mt-4 pt-4 border-t border-border">
              <SectionHeader title="Top Propagation Chains" />
              <div className="space-y-2">
                {filteredEdges
                  .slice()
                  .sort((a, b) => b.weight - a.weight)
                  .slice(0, 5)
                  .map((edge, i) => {
                    const source = graph.nodes.find(n => n.id === edge.source);
                    const target = graph.nodes.find(n => n.id === edge.target);
                    return (
                      <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground p-2 rounded bg-muted/20">
                        <span className="font-medium text-foreground">{source?.label}</span>
                        <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                        <span className="font-medium text-foreground">{target?.label}</span>
                        <span className="ml-auto font-mono text-[10px]">{(edge.weight * 100).toFixed(0)}%</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Node Detail Panel */}
          <div className="rounded-lg border border-border bg-card p-4">
            {selectedNode ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-3 h-3 rounded-full ${domainColors[selectedNode.domain]}`} />
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{selectedNode.domain}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">{selectedNode.label}</h3>
                  <SeverityBadge level={selectedNode.severity} className="mt-1" />
                </div>

                <div>
                  <SectionHeader title="Description" />
                  <p className="text-xs text-muted-foreground">{selectedNode.description}</p>
                </div>

                <Button
                  size="sm"
                  className="w-full gap-1.5"
                  onClick={() => setDrawerOpen(true)}
                >
                  <Search className="h-3.5 w-3.5" />
                  Inspect propagation chain
                </Button>

                <div>
                  <SectionHeader title="Outgoing Connections" />
                  <div className="space-y-2">
                    {filteredEdges
                      .filter(e => e.source === selectedNode.id)
                      .map((edge, i) => {
                        const target = graph.nodes.find(n => n.id === edge.target);
                        return (
                          <div key={i} className="p-2 rounded bg-muted/30 border border-border/50">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-foreground">{target?.label}</span>
                              <span className="font-mono text-[10px] text-muted-foreground">{(edge.weight * 100).toFixed(0)}%</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground">{edge.mechanism}</p>
                          </div>
                        );
                      })}
                  </div>
                </div>

                <div>
                  <SectionHeader title="Incoming Connections" />
                  <div className="space-y-2">
                    {filteredEdges
                      .filter(e => e.target === selectedNode.id)
                      .map((edge, i) => {
                        const source = graph.nodes.find(n => n.id === edge.source);
                        return (
                          <div key={i} className="p-2 rounded bg-muted/30 border border-border/50">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-foreground">{source?.label}</span>
                              <span className="font-mono text-[10px] text-muted-foreground">{(edge.weight * 100).toFixed(0)}%</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground">{edge.mechanism}</p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <GitBranch className="h-8 w-8 text-muted-foreground/30 mb-2" />
                <p className="text-xs text-muted-foreground">Select a node to inspect</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
