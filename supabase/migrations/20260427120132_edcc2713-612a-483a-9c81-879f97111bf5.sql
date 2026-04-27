-- Scenarios table
CREATE TABLE public.scenarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'macro',
  region TEXT NOT NULL DEFAULT 'Global',
  event TEXT NOT NULL DEFAULT '',
  severity NUMERIC NOT NULL DEFAULT 5,
  duration TEXT NOT NULL DEFAULT '6 months',
  probability NUMERIC NOT NULL DEFAULT 0.3,
  status TEXT NOT NULL DEFAULT 'draft',
  affected_sectors TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  notes TEXT,
  assumptions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own scenarios" ON public.scenarios
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own scenarios" ON public.scenarios
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own scenarios" ON public.scenarios
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own scenarios" ON public.scenarios
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER scenarios_set_updated_at
  BEFORE UPDATE ON public.scenarios
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Simulation runs table
CREATE TABLE public.simulation_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  scenario_id UUID REFERENCES public.scenarios(id) ON DELETE SET NULL,
  scenario_name TEXT NOT NULL,
  portfolio_id TEXT NOT NULL,
  portfolio_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  progress INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  expected_drawdown NUMERIC,
  volatility_increase NUMERIC,
  exposure_concentration_shift NUMERIC,
  risk_confidence_score NUMERIC,
  drawdown_timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
  sector_impact JSONB NOT NULL DEFAULT '[]'::jsonb,
  drivers JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  assumptions JSONB NOT NULL DEFAULT '[]'::jsonb,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.simulation_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own runs" ON public.simulation_runs
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own runs" ON public.simulation_runs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own runs" ON public.simulation_runs
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own runs" ON public.simulation_runs
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER simulation_runs_set_updated_at
  BEFORE UPDATE ON public.simulation_runs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX scenarios_user_idx ON public.scenarios(user_id, updated_at DESC);
CREATE INDEX simulation_runs_user_idx ON public.simulation_runs(user_id, started_at DESC);
CREATE INDEX simulation_runs_status_idx ON public.simulation_runs(status);