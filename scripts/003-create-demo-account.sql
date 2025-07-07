-- Create demo user account
-- Note: This creates a user in auth.users which requires service role permissions
-- In production, you'd typically create this through the Supabase dashboard or auth API

-- Insert demo user into auth.users (this requires service role access)
-- We'll handle this through the application instead since we can't directly insert into auth.users

-- Create demo moments data for the demo account
-- We'll use a known demo user ID that we'll create through the auth system
-- For now, let's create some sample data structure

-- First, let's create some sample prompt packs if they don't exist
INSERT INTO public.prompt_packs (name, description, icon, questions) 
VALUES
(
  'Morning Reflection',
  'Start your day with intention and clarity',
  '🌅',
  ARRAY[
    'How are you feeling this morning?',
    'What are you looking forward to today?',
    'What intention do you want to set?',
    'What are you grateful for right now?'
  ]
),
(
  'Evening Wind Down',
  'Reflect on your day and prepare for rest',
  '🌙',
  ARRAY[
    'What was the best part of your day?',
    'What challenged you today?',
    'What did you learn about yourself?',
    'How do you want to feel tomorrow?'
  ]
),
(
  'Quick Check-in',
  'A fast moment of self-awareness',
  '⚡',
  ARRAY[
    'How are you feeling right now?',
    'What do you need in this moment?',
    'What are you noticing around you?'
  ]
)
ON CONFLICT (name) DO NOTHING;
