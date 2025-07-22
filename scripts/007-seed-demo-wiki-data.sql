-- Insert demo wiki entries for the demo user
-- This will be handled by the application, but we can create a template

-- First, ensure demo categories exist
INSERT INTO public.wiki_categories (user_id, name, color) 
VALUES 
  ((SELECT id FROM auth.users WHERE email = 'demo@momentlens.app'), 'Personal', '#10B981'),
  ((SELECT id FROM auth.users WHERE email = 'demo@momentlens.app'), 'Work', '#3B82F6'),
  ((SELECT id FROM auth.users WHERE email = 'demo@momentlens.app'), 'Learning', '#8B5CF6'),
  ((SELECT id FROM auth.users WHERE email = 'demo@momentlens.app'), 'Projects', '#F59E0B'),
  ((SELECT id FROM auth.users WHERE email = 'demo@momentlens.app'), 'Ideas', '#EF4444')
ON CONFLICT (user_id, name) DO NOTHING;

-- Demo wiki data will be created by the application
-- This ensures proper user authentication and RLS policies

DO $$
BEGIN
  -- Check if wiki tables exist
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'wiki_entries') THEN
    RAISE NOTICE 'Wiki tables exist. Demo data will be created by the application when demo user signs in.';
  ELSE
    RAISE NOTICE 'Wiki tables do not exist yet. Please run the table creation script first.';
  END IF;
END $$;

-- Insert demo wiki entries
INSERT INTO public.wiki_entries (
  user_id, 
  title, 
  summary, 
  content, 
  tags, 
  category, 
  status, 
  priority, 
  is_public, 
  rating,
  related_links,
  created_at,
  updated_at
) 
SELECT 
  (SELECT id FROM auth.users WHERE email = 'demo@momentlens.app'),
  entry_title,
  entry_summary,
  entry_content,
  entry_tags,
  entry_category,
  entry_status,
  entry_priority,
  entry_is_public,
  entry_rating,
  entry_links,
  entry_created,
  entry_updated
FROM (
  VALUES 
    (
      'Morning Routine Optimization',
      'Research and notes on building an effective morning routine',
      E'# Morning Routine Research\n\n## Key Components\n- Wake up at consistent time\n- Hydration first thing\n- Light exercise or stretching\n- Meditation/mindfulness\n- Healthy breakfast\n\n## Benefits\n- Increased energy throughout the day\n- Better focus and productivity\n- Reduced stress and anxiety\n- Improved physical health\n\n## Implementation Plan\n1. Start with 5-minute meditation\n2. Add 10-minute walk\n3. Prepare breakfast the night before\n4. Gradually wake up 15 minutes earlier each week',
      ARRAY['routine', 'health', 'productivity', 'habits'],
      'Personal',
      'published',
      'high',
      false,
      4,
      '[{"id": 1, "title": "The Miracle Morning", "url": "https://example.com/miracle-morning"}, {"id": 2, "title": "Harvard Health - Morning Routines", "url": "https://example.com/harvard-health"}]'::jsonb,
      NOW() - INTERVAL '3 days',
      NOW() - INTERVAL '1 day'
    ),
    (
      'React Performance Tips',
      'Collection of React optimization techniques and best practices',
      E'# React Performance Optimization\n\n## Memo and Callbacks\n- Use React.memo for expensive components\n- useMemo for expensive calculations\n- useCallback for stable function references\n\n## Code Splitting\n- React.lazy for component-level splitting\n- Dynamic imports for route-based splitting\n\n## Bundle Analysis\n- webpack-bundle-analyzer\n- React DevTools Profiler\n\n## Common Pitfalls\n- Avoid inline objects in JSX\n- Be careful with useEffect dependencies\n- Don''t optimize prematurely',
      ARRAY['react', 'performance', 'javascript', 'optimization'],
      'Work',
      'published',
      'medium',
      true,
      5,
      '[{"id": 1, "title": "React Docs - Optimization", "url": "https://react.dev/learn/render-and-commit"}, {"id": 2, "title": "Web.dev React Performance", "url": "https://web.dev/react"}]'::jsonb,
      NOW() - INTERVAL '5 days',
      NOW() - INTERVAL '2 hours'
    ),
    (
      'Book Notes: Atomic Habits',
      'Key insights and takeaways from James Clear''s Atomic Habits',
      E'# Atomic Habits - James Clear\n\n## The Four Laws of Behavior Change\n\n### Make it Obvious\n- Design your environment\n- Use implementation intentions\n- Habit stacking\n\n### Make it Attractive\n- Temptation bundling\n- Join a culture where desired behavior is normal\n\n### Make it Easy\n- Reduce friction\n- Two-minute rule\n- Prime your environment\n\n### Make it Satisfying\n- Immediate rewards\n- Habit tracking\n- Never miss twice\n\n## Key Quotes\n"You do not rise to the level of your goals. You fall to the level of your systems."\n\n"Every action is a vote for the type of person you wish to become."',
      ARRAY['books', 'habits', 'self-improvement', 'productivity'],
      'Learning',
      'published',
      'high',
      false,
      5,
      '[{"id": 1, "title": "Atomic Habits Official Site", "url": "https://jamesclear.com/atomic-habits"}, {"id": 2, "title": "Book Summary", "url": "https://example.com/atomic-habits-summary"}]'::jsonb,
      NOW() - INTERVAL '1 week',
      NOW() - INTERVAL '3 days'
    ),
    (
      'Weekend Project Ideas',
      'List of potential side projects and weekend coding experiments',
      E'# Weekend Project Ideas\n\n## Web Apps\n- Personal finance tracker\n- Recipe organizer with meal planning\n- Local event discovery app\n- Habit tracker with analytics\n\n## Tools & Utilities\n- Markdown to PDF converter\n- Image compression tool\n- QR code generator with analytics\n- Password strength checker\n\n## Learning Projects\n- Build a simple compiler\n- Create a basic game engine\n- Implement common algorithms\n- Try a new framework or language\n\n## Hardware Projects\n- Raspberry Pi weather station\n- Arduino plant watering system\n- Smart home automation\n\n## Status\n- [ ] Choose next project\n- [ ] Set up development environment\n- [ ] Create project timeline',
      ARRAY['projects', 'coding', 'ideas', 'weekend'],
      'Projects',
      'draft',
      'low',
      false,
      3,
      '[]'::jsonb,
      NOW() - INTERVAL '2 days',
      NOW() - INTERVAL '4 hours'
    ),
    (
      'Investment Strategy Notes',
      'Personal notes on investment approaches and market research',
      E'# Investment Strategy\n\n## Core Principles\n- Diversification across asset classes\n- Long-term thinking (10+ years)\n- Regular contributions (dollar-cost averaging)\n- Low-cost index funds as foundation\n\n## Asset Allocation\n- 70% Stock market (mix of domestic/international)\n- 20% Bonds (government and corporate)\n- 10% Alternative investments (REITs, commodities)\n\n## Research Sources\n- Morningstar for fund analysis\n- SEC filings for individual stocks\n- Economic indicators and Fed reports\n- Financial news (multiple sources)\n\n## Review Schedule\n- Monthly: Check account balances\n- Quarterly: Rebalance if needed\n- Annually: Review and adjust strategy\n\n## Emergency Fund\n- Target: 6 months of expenses\n- Keep in high-yield savings account\n- Separate from investment accounts',
      ARRAY['finance', 'investing', 'planning', 'money'],
      'Personal',
      'draft',
      'medium',
      false,
      NULL,
      '[{"id": 1, "title": "Bogleheads Investment Philosophy", "url": "https://www.bogleheads.org/wiki/Bogleheads%C2%AE_investment_philosophy"}, {"id": 2, "title": "SEC Investor.gov", "url": "https://www.investor.gov/"}]'::jsonb,
      NOW() - INTERVAL '6 hours',
      NOW() - INTERVAL '1 hour'
    )
) AS demo_entries(
  entry_title, entry_summary, entry_content, entry_tags, entry_category, 
  entry_status, entry_priority, entry_is_public, entry_rating, entry_links,
  entry_created, entry_updated
)
WHERE EXISTS (SELECT 1 FROM auth.users WHERE email = 'demo@momentlens.app');
