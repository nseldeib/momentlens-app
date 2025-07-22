-- First, drop all existing wiki tables and their dependencies
DROP TABLE IF EXISTS public.wiki_entries CASCADE;
DROP TABLE IF EXISTS public.wiki_categories CASCADE;

-- Drop any existing functions and triggers
DROP TRIGGER IF EXISTS update_wiki_entries_updated_at ON public.wiki_entries;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Create the update function first
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create wiki_categories table with proper schema
CREATE TABLE public.wiki_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- Create wiki_entries table with proper schema
CREATE TABLE public.wiki_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT,
    tags TEXT[] DEFAULT '{}',
    category TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    is_public BOOLEAN DEFAULT false,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    file_attachments JSONB DEFAULT '[]',
    related_links JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.wiki_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wiki_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for wiki_categories
CREATE POLICY "Users can view own wiki categories" ON public.wiki_categories
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wiki categories" ON public.wiki_categories
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wiki categories" ON public.wiki_categories
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own wiki categories" ON public.wiki_categories
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for wiki_entries
CREATE POLICY "Users can view own wiki entries" ON public.wiki_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wiki entries" ON public.wiki_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wiki entries" ON public.wiki_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own wiki entries" ON public.wiki_entries
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_wiki_categories_user_id ON public.wiki_categories(user_id);
CREATE INDEX idx_wiki_categories_name ON public.wiki_categories(user_id, name);

CREATE INDEX idx_wiki_entries_user_id ON public.wiki_entries(user_id);
CREATE INDEX idx_wiki_entries_status ON public.wiki_entries(user_id, status);
CREATE INDEX idx_wiki_entries_category ON public.wiki_entries(user_id, category);
CREATE INDEX idx_wiki_entries_tags ON public.wiki_entries USING GIN(tags);
CREATE INDEX idx_wiki_entries_updated_at ON public.wiki_entries(user_id, updated_at DESC);

-- Create trigger for automatic updated_at timestamp
CREATE TRIGGER update_wiki_entries_updated_at 
    BEFORE UPDATE ON public.wiki_entries 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Verify tables were created correctly
DO $$
BEGIN
    -- Check if tables exist with correct columns
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'wiki_categories' 
        AND column_name = 'user_id'
        AND table_schema = 'public'
    ) THEN
        RAISE EXCEPTION 'wiki_categories table was not created correctly';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'wiki_entries' 
        AND column_name = 'user_id'
        AND table_schema = 'public'
    ) THEN
        RAISE EXCEPTION 'wiki_entries table was not created correctly';
    END IF;
    
    RAISE NOTICE 'Wiki tables created successfully with correct schema';
END $$;
