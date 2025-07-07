-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create moments table for journal entries
CREATE TABLE IF NOT EXISTS public.moments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  mood INTEGER CHECK (mood >= 1 AND mood <= 5),
  tags TEXT[] DEFAULT '{}',
  prompt_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prompt_packs table
CREATE TABLE IF NOT EXISTS public.prompt_packs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  questions TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_packs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own moments" ON public.moments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own moments" ON public.moments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own moments" ON public.moments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own moments" ON public.moments
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view prompt packs" ON public.prompt_packs
  FOR SELECT TO authenticated;

-- Only allow admins to modify prompt packs (for now, we'll insert them directly)
CREATE POLICY "Only service role can modify prompt packs" ON public.prompt_packs
  FOR ALL USING (false);
