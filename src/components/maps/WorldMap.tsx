import { useMemo } from "react";
import type { RegionRiskSummary, SeverityLevel } from "@/types/domain";

interface RegionShape {
  name: string; // must match RegionRiskSummary.region values
  // Simplified continent/region polygons in a 1000x500 equirectangular space
  d: string;
  centroid: [number, number];
}

// Stylized — not geographically perfect, but reads as a world map.
const REGIONS: RegionShape[] = [
  {
    name: "North America",
    d: "M 90 110 L 160 90 L 235 95 L 300 130 L 295 195 L 250 225 L 200 245 L 155 235 L 120 200 L 95 160 Z",
    centroid: [195, 165],
  },
  {
    name: "South America",
    d: "M 245 270 L 295 260 L 320 295 L 315 360 L 290 410 L 260 425 L 240 395 L 230 340 Z",
    centroid: [275, 345],
  },
  {
    name: "Western Europe",
    d: "M 460 105 L 510 95 L 530 130 L 520 170 L 480 175 L 455 145 Z",
    centroid: [490, 140],
  },
  {
    name: "Southern Europe",
    d: "M 480 175 L 540 170 L 575 185 L 565 215 L 510 220 L 480 200 Z",
    centroid: [520, 195],
  },
  {
    name: "East Africa",
    d: "M 555 230 L 605 225 L 615 280 L 595 330 L 565 335 L 545 290 Z",
    centroid: [580, 285],
  },
  {
    name: "Asia",
    d: "M 595 100 L 720 85 L 830 110 L 870 165 L 850 215 L 780 230 L 700 215 L 640 195 L 600 165 Z",
    centroid: [735, 155],
  },
  {
    name: "Southeast Asia",
    d: "M 780 240 L 855 235 L 880 270 L 855 300 L 800 295 L 775 270 Z",
    centroid: [820, 270],
  },
  {
    name: "Oceania",
    d: "M 830 320 L 905 315 L 930 350 L 905 385 L 850 380 L 825 355 Z",
    centroid: [875, 350],
  },
];

const severityFill: Record<SeverityLevel, string> = {
  critical: "hsl(var(--severity-critical) / 0.55)",
  high: "hsl(var(--severity-high) / 0.5)",
  medium: "hsl(var(--severity-medium) / 0.45)",
  low: "hsl(var(--severity-low) / 0.4)",
  minimal: "hsl(var(--severity-minimal) / 0.3)",
};

const severityStroke: Record<SeverityLevel, string> = {
  critical: "hsl(var(--severity-critical))",
  high: "hsl(var(--severity-high))",
  medium: "hsl(var(--severity-medium))",
  low: "hsl(var(--severity-low))",
  minimal: "hsl(var(--severity-minimal))",
};

interface WorldMapProps {
  regions: RegionRiskSummary[];
  selectedRegion: string | null;
  onSelectRegion: (region: RegionRiskSummary) => void;
}

export function WorldMap({ regions, selectedRegion, onSelectRegion }: WorldMapProps) {
  const byName = useMemo(() => {
    const m = new Map<string, RegionRiskSummary>();
    regions.forEach((r) => m.set(r.region, r));
    return m;
  }, [regions]);

  return (
    <div className="w-full">
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-auto"
        role="img"
        aria-label="Global risk map"
      >
        {/* Ocean / backdrop */}
        <rect width="1000" height="500" fill="hsl(var(--muted) / 0.3)" />
        {/* Subtle graticule */}
        <g stroke="hsl(var(--border) / 0.4)" strokeWidth="0.5" fill="none">
          {[100, 200, 300, 400].map((y) => (
            <line key={y} x1="0" y1={y} x2="1000" y2={y} />
          ))}
          {[200, 400, 600, 800].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="500" />
          ))}
        </g>

        {REGIONS.map((shape) => {
          const data = byName.get(shape.name);
          const severity = data?.overallSeverity;
          const isSelected = selectedRegion === shape.name;
          const fill = severity ? severityFill[severity] : "hsl(var(--muted) / 0.5)";
          const stroke = severity ? severityStroke[severity] : "hsl(var(--border))";

          return (
            <g
              key={shape.name}
              className={data ? "cursor-pointer" : "cursor-default"}
              onClick={() => data && onSelectRegion(data)}
            >
              <path
                d={shape.d}
                fill={fill}
                stroke={stroke}
                strokeWidth={isSelected ? 2.5 : 1}
                className="transition-all duration-200 hover:brightness-125"
                style={isSelected ? { filter: "drop-shadow(0 0 8px hsl(var(--primary) / 0.6))" } : undefined}
              />
              {data && (
                <>
                  <circle
                    cx={shape.centroid[0]}
                    cy={shape.centroid[1]}
                    r={isSelected ? 5 : 3.5}
                    fill={severityStroke[severity!]}
                    className="pointer-events-none"
                  >
                    {severity === "critical" && (
                      <animate attributeName="r" values="3.5;6;3.5" dur="2s" repeatCount="indefinite" />
                    )}
                  </circle>
                  <text
                    x={shape.centroid[0]}
                    y={shape.centroid[1] - 10}
                    textAnchor="middle"
                    className="pointer-events-none select-none"
                    fill="hsl(var(--foreground))"
                    fontSize="11"
                    fontWeight="500"
                  >
                    {shape.name}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 mt-3 text-[10px] text-muted-foreground">
        <span className="uppercase tracking-wider">Severity</span>
        {(["critical", "high", "medium", "low", "minimal"] as SeverityLevel[]).map((s) => (
          <div key={s} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: severityStroke[s] }} />
            <span className="capitalize">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
