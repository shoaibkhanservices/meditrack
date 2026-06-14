-- Create sessions table
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  guest_token TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  urgency_level TEXT NOT NULL CHECK (urgency_level IN ('EMERGENCY', 'SEE_DOCTOR_TODAY', 'MONITOR_AT_HOME', 'ROUTINE_CHECKUP')),
  urgency_color TEXT NOT NULL,
  top_condition TEXT NOT NULL,
  raw_ai_response JSONB NOT NULL,
  symptoms_summary JSONB NOT NULL,
  is_offline BOOLEAN DEFAULT false,
  pdf_url TEXT
);

-- Enable Row-Level Security
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can select own sessions" 
  ON public.sessions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" 
  ON public.sessions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions" 
  ON public.sessions FOR DELETE 
  USING (auth.uid() = user_id);

-- Key Indexes
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON public.sessions(created_at DESC);
