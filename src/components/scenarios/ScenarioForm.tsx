import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { SCENARIO_TYPES } from "@/lib/constants";
import type { Scenario, ScenarioType } from "@/types/domain";
import type { ScenarioInput } from "@/lib/api/scenarios";

export const SCENARIO_REGIONS = [
  "Global", "North America", "Western Europe", "Southern Europe", "Northern Europe",
  "East Africa", "Southeast Asia", "South America", "Middle East", "Central Asia", "Asia-Pacific",
];

export const SCENARIO_SECTORS = [
  "Sovereign Debt", "Infrastructure", "Energy Transition", "Agriculture",
  "Technology", "Real Assets", "Healthcare",
];

const STATUSES: Scenario["status"][] = ["draft", "active", "archived"];

interface ScenarioFormProps {
  initial?: Scenario | null;
  submitting?: boolean;
  submitLabel?: string;
  onSubmit: (input: ScenarioInput) => void;
  onCancel?: () => void;
}

export function ScenarioForm({
  initial,
  submitting,
  submitLabel = "Save Scenario",
  onSubmit,
  onCancel,
}: ScenarioFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [type, setType] = useState<ScenarioType>(initial?.type ?? "macro");
  const [region, setRegion] = useState(initial?.region ?? "Global");
  const [event, setEvent] = useState(initial?.event ?? "");
  const [severity, setSeverity] = useState<number[]>([initial?.severity ?? 5]);
  const [duration, setDuration] = useState(initial?.duration ?? "6 months");
  const [probability, setProbability] = useState<number[]>([
    Math.round((initial?.probability ?? 0.3) * 100),
  ]);
  const [status, setStatus] = useState<Scenario["status"]>(initial?.status ?? "draft");
  const [sectors, setSectors] = useState<string[]>(initial?.affectedSectors ?? []);
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [assumptions, setAssumptions] = useState(initial?.assumptions ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setType(initial.type);
      setRegion(initial.region);
      setEvent(initial.event);
      setSeverity([initial.severity]);
      setDuration(initial.duration);
      setProbability([Math.round(initial.probability * 100)]);
      setStatus(initial.status);
      setSectors(initial.affectedSectors);
      setNotes(initial.notes ?? "");
      setAssumptions(initial.assumptions ?? "");
    }
  }, [initial]);

  const toggleSector = (s: string) =>
    setSectors((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Scenario name is required.");
      return;
    }
    if (!event.trim()) {
      setError("Event description is required.");
      return;
    }
    setError(null);
    onSubmit({
      name: name.trim(),
      type,
      region,
      event: event.trim(),
      severity: severity[0],
      duration: duration.trim() || "6 months",
      probability: Math.max(0, Math.min(1, probability[0] / 100)),
      status,
      affectedSectors: sectors,
      notes: notes.trim() || undefined,
      assumptions: assumptions.trim() || undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Scenario Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Mediterranean Water Constraint"
            className="bg-muted/50"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Type</Label>
          <Select value={type} onValueChange={(v) => setType(v as ScenarioType)}>
            <SelectTrigger className="bg-muted/50"><SelectValue /></SelectTrigger>
            <SelectContent>
              {SCENARIO_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Region</Label>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="bg-muted/50"><SelectValue /></SelectTrigger>
            <SelectContent>
              {SCENARIO_REGIONS.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as Scenario["status"])}>
            <SelectTrigger className="bg-muted/50"><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Duration</Label>
          <Input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g., 12 months"
            className="bg-muted/50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Event Description</Label>
        <Textarea
          value={event}
          onChange={(e) => setEvent(e.target.value)}
          placeholder="Describe the scenario event and its initial conditions…"
          className="bg-muted/50 min-h-[80px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            Severity — <span className="font-mono text-foreground">{severity[0]}/10</span>
          </Label>
          <Slider value={severity} onValueChange={setSeverity} min={1} max={10} step={1} />
        </div>
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            Probability — <span className="font-mono text-foreground">{probability[0]}%</span>
          </Label>
          <Slider value={probability} onValueChange={setProbability} min={0} max={100} step={5} />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Affected Sectors</Label>
        <div className="flex flex-wrap gap-2">
          {SCENARIO_SECTORS.map((s) => (
            <Button
              key={s}
              type="button"
              size="sm"
              variant={sectors.includes(s) ? "default" : "outline"}
              onClick={() => toggleSector(s)}
              className="text-xs h-7"
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Trigger Assumptions</Label>
        <Textarea
          value={assumptions}
          onChange={(e) => setAssumptions(e.target.value)}
          placeholder="Key assumptions underlying this scenario…"
          className="bg-muted/50 min-h-[60px]"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Notes</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional context or references…"
          className="bg-muted/50 min-h-[60px]"
        />
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
        <Button type="button" size="sm" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Saving…" : submitLabel}
        </Button>
      </div>
    </div>
  );
}
