-- Create wiki entries table
CREATE TABLE IF NOT EXISTS public.wiki_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Create wiki categories table for predefined categories
CREATE TABLE IF NOT EXISTS public.wiki_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Drop existing tables if they exist with wrong schema
DROP TABLE IF EXISTS public.wiki_entries CASCADE;
DROP TABLE IF EXISTS public.wiki_categories CASCADE;

-- Recreate with correct schema
CREATE TABLE public.wiki_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
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

CREATE TABLE public.wiki_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Enable Row Level Security
ALTER TABLE public.wiki_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wiki_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for wiki_entries
CREATE POLICY "Users can view own wiki entries" ON public.wiki_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wiki entries" ON public.wiki_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wiki entries" ON public.wiki_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own wiki entries" ON public.wiki_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for wiki_categories
CREATE POLICY "Users can view own wiki categories" ON public.wiki_categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wiki categories" ON public.wiki_categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wiki categories" ON public.wiki_categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own wiki categories" ON public.wiki_categories
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_wiki_entries_user_id ON public.wiki_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_wiki_entries_status ON public.wiki_entries(status);
CREATE INDEX IF NOT EXISTS idx_wiki_entries_category ON public.wiki_entries(category);
CREATE INDEX IF NOT EXISTS idx_wiki_entries_tags ON public.wiki_entries USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_wiki_entries_updated_at ON public.wiki_entries(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_wiki_categories_user_id ON public.wiki_categories(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_wiki_entries_updated_at ON public.wiki_entries;
CREATE TRIGGER update_wiki_entries_updated_at 
    BEFORE UPDATE ON public.wiki_entries 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
