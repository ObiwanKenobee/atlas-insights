// Atlas Sanctum — Simulation Runner edge function
// Creates a simulation_runs row and progresses it from queued -> running -> completed
// in the background using EdgeRuntime.waitUntil so the client can poll for status.

import { createClient } from "npm:@supabase/supabase-js@2.49.4";
import { corsHeaders } from "npm:@supabase/supabase-js@2.49.4/cors";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ??
  Deno.env.get("SUPABASE_ANON_KEY")!;

interface RunRequest {
  scenarioId: string;
  portfolioId: string;
  portfolioName: string;
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
function round(n: number, d = 2) {
  const f = Math.pow(10, d);
  return Math.round(n * f) / f;
}

function buildResults(scenarioName: string, severity: number) {
  const sev = Math.max(1, Math.min(10, severity || 5));
  const expectedDrawdown = round(-(sev * rand(0.4, 0.9)), 2);
  const volatilityIncrease = round(sev * rand(0.6, 1.4), 2);
  const exposureConcentrationShift = round(rand(-3, 8), 2);
  const riskConfidenceScore = Math.round(rand(60, 92));

  const months = ["M+1", "M+2", "M+3", "M+4", "M+5", "M+6"];
  let v = 0;
  const drawdownTimeline = months.map((m) => {
    v = round(v + expectedDrawdown / 6 + rand(-0.4, 0.4), 2);
    return { date: m, value: v };
  });

  const sectors = [
    "Sovereign Debt",
    "Infrastructure",
    "Energy Transition",
    "Agriculture",
    "Technology",
    "Real Assets",
  ];
  const sectorImpact = sectors.map((s) => ({
    sector: s,
    impact: round(rand(-9, 4) * (sev / 6), 2),
  }));

  const drivers = [
    `${scenarioName} primary shock channel`,
    `Cross-asset correlation regime shift (sev ${sev}/10)`,
    "Liquidity premium re-pricing in EM sovereign curve",
    "Secondary contagion through commodity-linked credit",
  ];
  const recommendations = [
    "Reduce concentration in most-impacted sector by 200-400bps",
    "Add tail hedges via long-dated index puts on at-risk regions",
    "Rotate to higher-quality sovereign duration",
    "Increase allocation to verified-impact resilient assets",
  ];
  const assumptions = [
    "Linear shock propagation across the first two transmission tiers",
    "Central bank response lag of 4-6 weeks",
    "No coordinated fiscal backstop within scenario horizon",
  ];

  return {
    expected_drawdown: expectedDrawdown,
    volatility_increase: volatilityIncrease,
    exposure_concentration_shift: exposureConcentrationShift,
    risk_confidence_score: riskConfidenceScore,
    drawdown_timeline: drawdownTimeline,
    sector_impact: sectorImpact,
    drivers,
    recommendations,
    assumptions,
  };
}

async function progressRun(runId: string, scenarioName: string, severity: number) {
  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  try {
    // queued -> running
    await sleep(800);
    await admin
      .from("simulation_runs")
      .update({ status: "running", progress: 10 })
      .eq("id", runId);

    // step progress
    for (const p of [25, 45, 65, 80, 92]) {
      await sleep(900);
      await admin.from("simulation_runs").update({ progress: p }).eq("id", runId);
    }

    const results = buildResults(scenarioName, severity);
    await sleep(700);

    await admin
      .from("simulation_runs")
      .update({
        ...results,
        status: "completed",
        progress: 100,
        completed_at: new Date().toISOString(),
      })
      .eq("id", runId);
  } catch (err) {
    console.error("run-simulation background error", err);
    await admin
      .from("simulation_runs")
      .update({
        status: "failed",
        error_message: err instanceof Error ? err.message : String(err),
        completed_at: new Date().toISOString(),
      })
      .eq("id", runId);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;

    const body = (await req.json()) as RunRequest;
    if (!body?.scenarioId || !body?.portfolioId || !body?.portfolioName) {
      return new Response(
        JSON.stringify({ error: "scenarioId, portfolioId and portfolioName are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: scenario, error: scenarioErr } = await admin
      .from("scenarios")
      .select("id, name, severity, user_id")
      .eq("id", body.scenarioId)
      .maybeSingle();
    if (scenarioErr || !scenario || scenario.user_id !== userId) {
      return new Response(JSON.stringify({ error: "Scenario not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: run, error: insertErr } = await admin
      .from("simulation_runs")
      .insert({
        user_id: userId,
        scenario_id: scenario.id,
        scenario_name: scenario.name,
        portfolio_id: body.portfolioId,
        portfolio_name: body.portfolioName,
        status: "queued",
        progress: 0,
      })
      .select()
      .single();

    if (insertErr || !run) {
      return new Response(JSON.stringify({ error: insertErr?.message ?? "Insert failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Background progression
    // @ts-ignore EdgeRuntime is provided by Supabase Edge runtime
    EdgeRuntime.waitUntil(progressRun(run.id, scenario.name, Number(scenario.severity ?? 5)));

    return new Response(JSON.stringify({ runId: run.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("run-simulation error", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
