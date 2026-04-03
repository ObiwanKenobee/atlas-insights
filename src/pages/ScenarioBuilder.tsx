import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { SCENARIO_TYPES } from "@/lib/constants";
import { Save, Play } from "lucide-react";

const REGIONS = ["Global", "North America", "Western Europe", "Southern Europe", "Northern Europe", "East Africa", "Southeast Asia", "South America", "Middle East", "Central Asia", "Asia-Pacific"];
const SECTORS = ["Sovereign Debt", "Infrastructure", "Energy Transition", "Agriculture", "Technology", "Real Assets", "Healthcare"];

export default function ScenarioBuilderPage() {
  const navigate = useNavigate();
  const [severity, setSeverity] = useState([5]);
  const [probability, setProbability] = useState([50]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);

  const toggleSector = (sector: string) => {
    setSelectedSectors(prev =>
      prev.includes(sector) ? prev.filter(s => s !== sector) : [...prev, sector]
    );
  };

  return (
    <AppLayout>
      <div className="max-w-3xl space-y-6">
        <SectionHeader
          title="New Scenario"
          subtitle="Define scenario parameters for simulation"
          action={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Save className="h-3.5 w-3.5" /> Save Draft
              </Button>
              <Button size="sm" className="gap-1.5">
                <Play className="h-3.5 w-3.5" /> Run Scenario
              </Button>
            </div>
          }
        />

        <div className="rounded-lg border border-border bg-card p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Scenario Name</Label>
              <Input placeholder="e.g., Mediterranean Water Constraint Scenario" className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Scenario Type</Label>
              <Select>
                <SelectTrigger className="bg-muted/50"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {SCENARIO_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Region</Label>
              <Select>
                <SelectTrigger className="bg-muted/50"><SelectValue placeholder="Select region" /></SelectTrigger>
                <SelectContent>
                  {REGIONS.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Event */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Event Description</Label>
            <Textarea placeholder="Describe the scenario event and its initial conditions..." className="bg-muted/50 min-h-[80px]" />
          </div>

          {/* Severity and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Severity — <span className="font-mono text-foreground">{severity[0]}/10</span>
              </Label>
              <Slider value={severity} onValueChange={setSeverity} min={1} max={10} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Duration</Label>
              <Input placeholder="e.g., 12 months" className="bg-muted/50" />
            </div>
            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Probability — <span className="font-mono text-foreground">{probability[0]}%</span>
              </Label>
              <Slider value={probability} onValueChange={setProbability} min={0} max={100} step={5} />
            </div>
          </div>

          {/* Affected Sectors */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Affected Sectors</Label>
            <div className="flex flex-wrap gap-2">
              {SECTORS.map((sector) => (
                <Button
                  key={sector}
                  size="sm"
                  variant={selectedSectors.includes(sector) ? "default" : "outline"}
                  onClick={() => toggleSector(sector)}
                  className="text-xs h-7"
                >
                  {sector}
                </Button>
              ))}
            </div>
          </div>

          {/* Assumptions and Notes */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Trigger Assumptions</Label>
            <Textarea placeholder="Key assumptions underlying this scenario..." className="bg-muted/50 min-h-[60px]" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Notes</Label>
            <Textarea placeholder="Additional context or references..." className="bg-muted/50 min-h-[60px]" />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
