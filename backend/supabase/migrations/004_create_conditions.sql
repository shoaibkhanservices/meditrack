-- Create conditions table
CREATE TABLE IF NOT EXISTS public.conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  condition_name TEXT NOT NULL,
  confidence_pct INTEGER NOT NULL CHECK (confidence_pct >= 0 AND confidence_pct <= 100),
  description TEXT NOT NULL,
  learn_more_url TEXT,
  rank INTEGER NOT NULL
);

-- Enable Row-Level Security
ALTER TABLE public.conditions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (linked to parent session user_id)
CREATE POLICY "Users can select conditions of own sessions" 
  ON public.conditions FOR SELECT 
  USING (
    session_id IN (
      SELECT s.id FROM public.sessions s WHERE s.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert conditions for own sessions" 
  ON public.conditions FOR INSERT 
  WITH CHECK (
    session_id IN (
      SELECT s.id FROM public.sessions s WHERE s.user_id = auth.uid()
    )
  );

-- Key Indexes
CREATE INDEX IF NOT EXISTS idx_conditions_session_id ON public.conditions(session_id);
