-- Ensure RLS policies allow demo account access
-- This script ensures the demo account can access all necessary tables

-- Allow demo user to access prompt_packs
DROP POLICY IF EXISTS "Only service role can modify prompt packs" ON public.prompt_packs;

CREATE POLICY "Anyone can view prompt packs" ON public.prompt_packs
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Service role can modify prompt packs" ON public.prompt_packs
  FOR ALL TO service_role
  USING (true);

-- Ensure moments table has proper policies (should already exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'moments' 
    AND policyname = 'Users can view own moments'
  ) THEN
    CREATE POLICY "Users can view own moments" ON public.moments
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'moments' 
    AND policyname = 'Users can insert own moments'
  ) THEN
    CREATE POLICY "Users can insert own moments" ON public.moments
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'moments' 
    AND policyname = 'Users can update own moments'
  ) THEN
    CREATE POLICY "Users can update own moments" ON public.moments
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'moments' 
    AND policyname = 'Users can delete own moments'
  ) THEN
    CREATE POLICY "Users can delete own moments" ON public.moments
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;
