-- Only create tables that don't exist yet
-- Check if moments table exists, if not create it
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'moments') THEN
        CREATE TABLE public.moments (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
            content text,
            mood integer CHECK (mood >= 1 AND mood <= 5),
            tags text[] DEFAULT '{}',
            question text,
            prompt_pack_id text,
            created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
            updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
        );

        -- Enable RLS
        ALTER TABLE public.moments ENABLE ROW LEVEL SECURITY;

        -- Create policies
        CREATE POLICY "Users can view own moments" ON public.moments
            FOR SELECT USING (auth.uid() = user_id);

        CREATE POLICY "Users can insert own moments" ON public.moments
            FOR INSERT WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Users can update own moments" ON public.moments
            FOR UPDATE USING (auth.uid() = user_id);

        CREATE POLICY "Users can delete own moments" ON public.moments
            FOR DELETE USING (auth.uid() = user_id);

        -- Create indexes
        CREATE INDEX idx_moments_user_id ON public.moments(user_id);
        CREATE INDEX idx_moments_created_at ON public.moments(created_at DESC);
        CREATE INDEX idx_moments_mood ON public.moments(mood);
    END IF;
END $$;

-- Check if prompt_packs table exists, if not create it
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'prompt_packs') THEN
        CREATE TABLE public.prompt_packs (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            name text NOT NULL,
            description text,
            icon text,
            questions text[] NOT NULL DEFAULT '{}',
            created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
            updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
        );

        -- Enable RLS
        ALTER TABLE public.prompt_packs ENABLE ROW LEVEL SECURITY;

        -- Create policy for public read access
        CREATE POLICY "Anyone can view prompt packs" ON public.prompt_packs
            FOR SELECT USING (true);

        -- Create indexes
        CREATE INDEX idx_prompt_packs_created_at ON public.prompt_packs(created_at);
    END IF;
END $$;

-- Create or replace function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at (only if tables exist)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'moments') THEN
        DROP TRIGGER IF EXISTS update_moments_updated_at ON public.moments;
        CREATE TRIGGER update_moments_updated_at
            BEFORE UPDATE ON public.moments
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'prompt_packs') THEN
        DROP TRIGGER IF EXISTS update_prompt_packs_updated_at ON public.prompt_packs;
        CREATE TRIGGER update_prompt_packs_updated_at
            BEFORE UPDATE ON public.prompt_packs
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
