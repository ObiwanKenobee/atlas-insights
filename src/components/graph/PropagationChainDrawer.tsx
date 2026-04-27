import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { SeverityBadge } from "@/components/badges/StatusBadges";
import { ArrowRight, ShieldCheck, AlertTriangle, FileSearch } from "lucide-react";
import type {
  RiskPropagationGraph,
  RiskPropagationNode,
  RiskDomain,
} from "@/types/domain";
import {
  buildUpstreamChain,
  metricsForNode,
} from "@/lib/graph/propagation-analysis";

const domainColors: Record<RiskDomain, string> = {
  climate: "bg-chart-2",
  economy: "bg-chart-1",
  infrastructure: "bg-chart-3",
  health: "bg-chart-4",
  policy: "bg-chart-5",
  markets: "bg-primary",
};

const statusStyles: Record<string, string> = {
  verified: "text-success bg-success/10 border-success/30",
  pending: "text-chart-4 bg-chart-4/10 border-chart-4/30",
  flagged: "text-destructive bg-destructive/10 border-destructive/30",
  unverified: "text-muted-foreground bg-muted border-border",
};

interface PropagationChainDrawerProps {
  graph: RiskPropagationGraph;
  node: RiskPropagationNode | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function EsgBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="font-mono text-[10px] text-foreground">{value.toFixed(0)}</span>
      </div>
      <Progress value={value} className="h-1.5" />
    </div>
  );
}

export function PropagationChainDrawer({
  graph, node, open, onOpenChange,
}: PropagationChainDrawerProps) {
  if (!node) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-xl w-full overflow-y-auto" />
      </Sheet>
    );
  }

  const chain = buildUpstreamChain(graph, node, 6);
  const metrics = metricsForNode(node, graph.edges);
  const outgoing = graph.edges.filter((e) => e.source === node.id);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl w-full overflow-y-auto">
        <SheetHeader className="space-y-2 pb-2">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${domainColors[node.domain]}`} />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {node.domain}
            </span>
            <SeverityBadge level={node.severity} />
          </div>
          <SheetTitle className="text-base font-semibold">{node.label}</SheetTitle>
          <SheetDescription className="text-xs">{node.description}</SheetDescription>
        </SheetHeader>

        {/* Contribution */}
        <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-2 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Contribution to selected node
            </span>
            <span className="font-mono text-xs text-foreground">
              {metrics.contributionScore}%
            </span>
          </div>
          <Progress value={metrics.contributionScore} className="h-1.5" />
          <p className="text-[11px] text-muted-foreground">
            Share of explained downstream risk arriving at this node, weighted by severity and
            upstream edge intensity.
          </p>
        </div>

        {/* Causal chain */}
        <section className="mt-6 space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground">
              Causal Chain
            </h3>
            <span className="text-[10px] text-muted-foreground">
              {chain.length === 0 ? "Origin node" : `${chain.length} upstream hop${chain.length === 1 ? "" : "s"}`}
            </span>
          </div>
          {chain.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              This node is a source in the current graph view — no upstream propagation chain.
            </p>
          ) : (
            <ol className="space-y-2">
              {chain.map((hop, i) => (
                <li
                  key={`${hop.source.id}-${hop.target.id}`}
                  className="rounded-md border border-border bg-card p-3"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${domainColors[hop.source.domain]}`} />
                    <span className="text-xs font-medium text-foreground">{hop.source.label}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <div className={`w-2 h-2 rounded-full ${domainColors[hop.target.domain]}`} />
                    <span className="text-xs font-medium text-foreground">{hop.target.label}</span>
                    <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                      {(hop.weight * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground pl-5">{hop.mechanism}</p>
                </li>
              ))}
            </ol>
          )}
        </section>

        {/* Verification */}
        <section className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground">
              Verification
            </h3>
            <span
              className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${statusStyles[metrics.verificationStatus]}`}
            >
              {metrics.verificationStatus}
            </span>
          </div>

          <div className="rounded-md border border-border bg-card p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Truth index
              </span>
              <span className="font-mono text-xs text-foreground">{metrics.truthIndex}</span>
            </div>
            <Progress value={metrics.truthIndex} className="h-1.5" />
            <p className="text-[11px] text-muted-foreground flex items-start gap-1.5">
              {metrics.truthIndex >= 75 ? (
                <ShieldCheck className="h-3 w-3 text-success mt-0.5 shrink-0" />
              ) : (
                <AlertTriangle className="h-3 w-3 text-chart-4 mt-0.5 shrink-0" />
              )}
              Composite confidence in evidence backing this node's modeled effect.
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
              Evidence sources
            </p>
            <ul className="space-y-1">
              {metrics.evidenceSources.map((src) => (
                <li
                  key={src}
                  className="text-[11px] text-muted-foreground flex items-center gap-2"
                >
                  <FileSearch className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                  {src}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ESG */}
        <section className="mt-6 space-y-3">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground">ESG Truth Metrics</h3>
          <div className="rounded-md border border-border bg-card p-3 grid grid-cols-2 gap-3">
            <EsgBar label="Carbon" value={metrics.esg.carbon} />
            <EsgBar label="Water" value={metrics.esg.water} />
            <EsgBar label="Biodiversity" value={metrics.esg.biodiversity} />
            <EsgBar label="Social" value={metrics.esg.social} />
          </div>
        </section>

        {/* Outgoing impact */}
        {outgoing.length > 0 && (
          <section className="mt-6 mb-2 space-y-2">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground">
              Downstream Effects
            </h3>
            <ul className="space-y-1.5">
              {outgoing.map((e) => {
                const target = graph.nodes.find((n) => n.id === e.target);
                return (
                  <li
                    key={`${e.source}-${e.target}`}
                    className="text-[11px] text-muted-foreground flex items-start gap-2 p-2 rounded bg-muted/20 border border-border/40"
                  >
                    <ArrowRight className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <span className="text-foreground font-medium">{target?.label}</span>
                      <span className="ml-2 font-mono text-[10px]">
                        {(e.weight * 100).toFixed(0)}%
                      </span>
                      <p className="mt-0.5">{e.mechanism}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </SheetContent>
    </Sheet>
  );
}
