-- Create symptoms detail table
CREATE TABLE IF NOT EXISTS public.symptoms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  body_region TEXT NOT NULL,
  symptom_name TEXT NOT NULL,
  severity INTEGER NOT NULL CHECK (severity >= 1 AND severity <= 10),
  duration_label TEXT,
  free_text TEXT CHECK (char_length(free_text) <= 500)
);

-- Enable Row-Level Security
ALTER TABLE public.symptoms ENABLE ROW LEVEL SECURITY;

-- RLS Policies (linked to parent session user_id)
CREATE POLICY "Users can select symptoms of own sessions" 
  ON public.symptoms FOR SELECT 
  USING (
    session_id IN (
      SELECT s.id FROM public.sessions s WHERE s.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert symptoms for own sessions" 
  ON public.symptoms FOR INSERT 
  WITH CHECK (
    session_id IN (
      SELECT s.id FROM public.sessions s WHERE s.user_id = auth.uid()
    )
  );

-- Key Indexes
CREATE INDEX IF NOT EXISTS idx_symptoms_session_id ON public.symptoms(session_id);
