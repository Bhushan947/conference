-- 2AI conference schema for Supabase (PostgreSQL)
-- Run via Supabase SQL Editor or: supabase db push

CREATE TABLE IF NOT EXISTS public.admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.committee (
  id SERIAL PRIMARY KEY,
  committee_type VARCHAR(255),
  sub_committe VARCHAR(255),
  name VARCHAR(255),
  role VARCHAR(255),
  organization VARCHAR(255),
  country VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS public.registrations (
  id SERIAL PRIMARY KEY,
  registration_id VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  affiliation VARCHAR(255) NOT NULL,
  designation VARCHAR(100),
  country VARCHAR(100),
  email VARCHAR(255),
  contact_number VARCHAR(50),
  participant_type VARCHAR(50),
  paper_id VARCHAR(100),
  paper_title TEXT,
  num_authors INT,
  sub_category VARCHAR(100),
  region VARCHAR(100),
  attend_workshop VARCHAR(10),
  total_fee_usd NUMERIC(10,2),
  total_fee_inr NUMERIC(10,2),
  mode_of_payment VARCHAR(50),
  transaction_id VARCHAR(100),
  date_of_payment DATE,
  payment_proof_path VARCHAR(255),
  declaration BOOLEAN,
  qr_code TEXT,
  payment_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_registrations_registration_id ON public.registrations (registration_id);

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.committee ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Public read for committee lists (frontend)
DROP POLICY IF EXISTS "committee_select_public" ON public.committee;
CREATE POLICY "committee_select_public" ON public.committee FOR SELECT USING (true);

-- Inserts/reads on registrations only via Edge Functions (service role bypasses RLS)
-- No policies for anon = deny direct table access

-- Optional: seed admin (change password in production)
INSERT INTO public.admins (username, password)
SELECT 'admin', 'admin@1234'
WHERE NOT EXISTS (SELECT 1 FROM public.admins WHERE username = 'admin');
