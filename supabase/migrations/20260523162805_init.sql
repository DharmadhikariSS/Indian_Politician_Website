-- Create the politicians table
CREATE TABLE IF NOT EXISTS public.politicians (
    id text PRIMARY KEY,
    name text NOT NULL,
    role text,
    party text,
    state text,
    constituency text,
    "photoUrl" text,
    "isVerified" boolean DEFAULT false,
    "aiScore" integer,
    "netWorth" text,
    "netWorthGrowth" integer,
    "criminalCases" integer DEFAULT 0,
    "attendancePct" integer,
    gender text,
    age integer,
    "termCount" integer,
    education text,
    "panNumber" text,
    "activeSince" integer,
    biography text,
    flags jsonb DEFAULT '{}'::jsonb,
    "integrityDetails" jsonb,
    "financialTimeline" jsonb DEFAULT '[]'::jsonb,
    "criminalCaseList" jsonb DEFAULT '[]'::jsonb,
    "parliamentActivity" jsonb,
    "electoralBonds" jsonb DEFAULT '[]'::jsonb,
    "newsArticles" jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.politicians ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access on politicians"
    ON public.politicians
    FOR SELECT
    TO public
    USING (true);

-- Create policy to allow authenticated users to insert/update (for ingestion)
-- In a real prod environment we'd restrict this to service_role only
CREATE POLICY "Allow authenticated insert/update"
    ON public.politicians
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create indexes for frequent queries
CREATE INDEX IF NOT EXISTS idx_politicians_name ON public.politicians (name);
CREATE INDEX IF NOT EXISTS idx_politicians_party ON public.politicians (party);
CREATE INDEX IF NOT EXISTS idx_politicians_state ON public.politicians (state);
CREATE INDEX IF NOT EXISTS idx_politicians_score ON public.politicians ("aiScore" DESC);
