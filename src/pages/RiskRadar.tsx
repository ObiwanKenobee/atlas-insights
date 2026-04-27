import { useState } from "react";
import { useRiskRadar } from "@/hooks/use-atlas-queries";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { SeverityBadge, ConfidenceBadge } from "@/components/badges/StatusBadges";
import { PageSkeleton } from "@/components/layout/LoadingSkeletons";
import { RISK_OVERLAY_OPTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import type { RegionRiskSummary } from "@/types/domain";
import { WorldMap } from "@/components/maps/WorldMap";

export default function RiskRadarPage() {
  const { data: regions, isLoading } = useRiskRadar();
  const [selectedOverlays, setSelectedOverlays] = useState<string[]>(["climate"]);
  const [selectedRegion, setSelectedRegion] = useState<RegionRiskSummary | null>(null);

  const toggleOverlay = (value: string) => {
    setSelectedOverlays(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  if (isLoading) return <AppLayout><PageSkeleton /></AppLayout>;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Risk Radar</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Global systemic risk monitoring and regional analysis</p>
        </div>

        {/* Overlay Filters */}
        <div className="flex flex-wrap gap-2">
          {RISK_OVERLAY_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              size="sm"
              variant={selectedOverlays.includes(opt.value) ? "default" : "outline"}
              onClick={() => toggleOverlay(opt.value)}
              className="text-xs h-7"
            >
              {opt.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Interactive World Map */}
          <div className="lg:col-span-2 rounded-lg border border-border bg-card p-4">
            <SectionHeader title="Geospatial Risk Map" subtitle="Click a region to inspect" />
            <WorldMap
              regions={regions ?? []}
              selectedRegion={selectedRegion?.region ?? null}
              onSelectRegion={setSelectedRegion}
            />
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {regions?.map((region) => (
                <button
                  key={region.region}
                  onClick={() => setSelectedRegion(region)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-md border transition-colors text-left
                    ${selectedRegion?.region === region.region
                      ? "border-primary bg-primary/5"
                      : "border-border bg-muted/30 hover:bg-muted/50"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">{region.region}</span>
                  </div>
                  <SeverityBadge level={region.overallSeverity} />
                </button>
              ))}
            </div>
          </div>

          {/* Region Detail Panel */}
          <div className="rounded-lg border border-border bg-card p-4">
            {selectedRegion ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{selectedRegion.region}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <SeverityBadge level={selectedRegion.overallSeverity} />
                    <ConfidenceBadge level={selectedRegion.confidence} />
                  </div>
                </div>

                <div>
                  <SectionHeader title="Top Drivers" />
                  <ul className="space-y-1">
                    {selectedRegion.topDrivers.map((driver, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        {driver}
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedRegion.signals.map((signal) => (
                  <div key={signal.id} className="space-y-2">
                    <SectionHeader title="Affected Sectors" />
                    <div className="flex flex-wrap gap-1">
                      {signal.affectedSectors.map((s) => (
                        <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                          {s}
                        </span>
                      ))}
                    </div>

                    <SectionHeader title="Portfolio Implications" />
                    <p className="text-xs text-muted-foreground">{signal.portfolioImplications}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <MapPin className="h-8 w-8 text-muted-foreground/30 mb-2" />
                <p className="text-xs text-muted-foreground">Select a region to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
