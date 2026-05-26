-- Alter politicians table to support v5 features: Geolocation, Exemptions, and Conflicts Ledger
ALTER TABLE public.politicians 
ADD COLUMN IF NOT EXISTS "isAttendanceExempt" BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS "attendanceExemptReason" TEXT,
ADD COLUMN IF NOT EXISTS "pincodes" TEXT[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS "conflictLedger" JSONB DEFAULT '[]'::jsonb;

-- Create GIN index for fast geolocation pincode queries at 10,000+ scale
CREATE INDEX IF NOT EXISTS idx_politicians_pincodes ON public.politicians USING GIN ("pincodes");
