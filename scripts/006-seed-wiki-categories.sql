-- Insert default wiki categories for demo user
-- This will be handled by the application for real users
INSERT INTO public.wiki_categories (user_id, name, color) 
SELECT 
  auth.uid(),
  category_name,
  category_color
FROM (
  VALUES 
    ('Personal', '#10B981'),
    ('Work', '#3B82F6'),
    ('Learning', '#8B5CF6'),
    ('Projects', '#F59E0B'),
    ('Ideas', '#EF4444'),
    ('Reference', '#6B7280'),
    ('Health', '#EC4899'),
    ('Finance', '#059669')
) AS categories(category_name, category_color)
WHERE auth.uid() IS NOT NULL
ON CONFLICT (user_id, name) DO NOTHING;
