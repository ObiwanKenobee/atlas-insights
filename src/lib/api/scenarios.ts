import { supabase } from "@/integrations/supabase/client";
import type { Scenario, ScenarioType } from "@/types/domain";

type Row = {
  id: string;
  user_id: string;
  name: string;
  type: string;
  region: string;
  event: string;
  severity: number | string;
  duration: string;
  probability: number | string;
  status: string;
  affected_sectors: string[] | null;
  notes: string | null;
  assumptions: string | null;
  created_at: string;
  updated_at: string;
};

function rowToScenario(r: Row): Scenario {
  return {
    id: r.id,
    name: r.name,
    type: r.type as ScenarioType,
    region: r.region,
    event: r.event,
    severity: Number(r.severity),
    duration: r.duration,
    probability: Number(r.probability),
    status: (r.status as Scenario["status"]) ?? "draft",
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    affectedSectors: r.affected_sectors ?? [],
    notes: r.notes ?? undefined,
    assumptions: r.assumptions ?? undefined,
  };
}

export interface ScenarioInput {
  name: string;
  type: ScenarioType;
  region: string;
  event: string;
  severity: number;
  duration: string;
  probability: number;
  status: Scenario["status"];
  affectedSectors: string[];
  notes?: string;
  assumptions?: string;
}

export const scenariosApi = {
  async list(): Promise<Scenario[]> {
    const { data, error } = await supabase
      .from("scenarios")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return (data as Row[]).map(rowToScenario);
  },
  async get(id: string): Promise<Scenario | null> {
    const { data, error } = await supabase
      .from("scenarios")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? rowToScenario(data as Row) : null;
  },
  async create(input: ScenarioInput): Promise<Scenario> {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) throw new Error("Not authenticated");
    const { data, error } = await supabase
      .from("scenarios")
      .insert({
        user_id: userId,
        name: input.name,
        type: input.type,
        region: input.region,
        event: input.event,
        severity: input.severity,
        duration: input.duration,
        probability: input.probability,
        status: input.status,
        affected_sectors: input.affectedSectors,
        notes: input.notes,
        assumptions: input.assumptions,
      })
      .select()
      .single();
    if (error) throw error;
    return rowToScenario(data as Row);
  },
  async update(id: string, input: ScenarioInput): Promise<Scenario> {
    const { data, error } = await supabase
      .from("scenarios")
      .update({
        name: input.name,
        type: input.type,
        region: input.region,
        event: input.event,
        severity: input.severity,
        duration: input.duration,
        probability: input.probability,
        status: input.status,
        affected_sectors: input.affectedSectors,
        notes: input.notes,
        assumptions: input.assumptions,
      })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return rowToScenario(data as Row);
  },
  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("scenarios").delete().eq("id", id);
    if (error) throw error;
  },
};
