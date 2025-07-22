-- This script will be handled by the application
-- Default categories will be created automatically when users first access the wiki widget

-- Insert default categories for any authenticated user
-- This is a fallback in case the application logic doesn't work
DO $$
BEGIN
  -- Only insert if the table exists and is empty for the current user
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'wiki_categories') THEN
    -- This will be handled by the application instead
    RAISE NOTICE 'Wiki categories table exists. Categories will be created by the application.';
  END IF;
END $$;
