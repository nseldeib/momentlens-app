import { supabase } from "@/lib/supabase/client"
import { DEMO_CREDENTIALS, DEMO_MOMENTS } from "./demo-data"

export const DEMO_WIKI_ENTRIES = [
  {
    title: "Morning Routine Optimization",
    summary: "Research and notes on building an effective morning routine",
    content: `# Morning Routine Research

## Key Components
- Wake up at consistent time
- Hydration first thing
- Light exercise or stretching
- Meditation/mindfulness
- Healthy breakfast

## Benefits
- Increased energy throughout the day
- Better focus and productivity
- Reduced stress and anxiety
- Improved physical health

## Implementation Plan
1. Start with 5-minute meditation
2. Add 10-minute walk
3. Prepare breakfast the night before
4. Gradually wake up 15 minutes earlier each week`,
    tags: ["routine", "health", "productivity", "habits"],
    category: "Personal",
    status: "published" as const,
    priority: "high" as const,
    is_public: false,
    rating: 4,
    related_links: [
      { id: 1, title: "The Miracle Morning", url: "https://example.com/miracle-morning" },
      { id: 2, title: "Harvard Health - Morning Routines", url: "https://example.com/harvard-health" },
    ],
  },
  {
    title: "React Performance Tips",
    summary: "Collection of React optimization techniques and best practices",
    content: `# React Performance Optimization

## Memo and Callbacks
- Use React.memo for expensive components
- useMemo for expensive calculations
- useCallback for stable function references

## Code Splitting
- React.lazy for component-level splitting
- Dynamic imports for route-based splitting

## Bundle Analysis
- webpack-bundle-analyzer
- React DevTools Profiler

## Common Pitfalls
- Avoid inline objects in JSX
- Be careful with useEffect dependencies
- Don't optimize prematurely`,
    tags: ["react", "performance", "javascript", "optimization"],
    category: "Work",
    status: "published" as const,
    priority: "medium" as const,
    is_public: true,
    rating: 5,
    related_links: [
      { id: 1, title: "React Docs - Optimization", url: "https://react.dev/learn/render-and-commit" },
      { id: 2, title: "Web.dev React Performance", url: "https://web.dev/react" },
    ],
  },
  {
    title: "Weekend Project Ideas",
    summary: "List of potential side projects and weekend coding experiments",
    content: `# Weekend Project Ideas

## Web Apps
- Personal finance tracker
- Recipe organizer with meal planning
- Local event discovery app
- Habit tracker with analytics

## Tools & Utilities
- Markdown to PDF converter
- Image compression tool
- QR code generator with analytics
- Password strength checker

## Learning Projects
- Build a simple compiler
- Create a basic game engine
- Implement common algorithms
- Try a new framework or language

## Status
- [ ] Choose next project
- [ ] Set up development environment
- [ ] Create project timeline`,
    tags: ["projects", "coding", "ideas", "weekend"],
    category: "Projects",
    status: "draft" as const,
    priority: "low" as const,
    is_public: false,
    rating: 3,
    related_links: [],
  },
]

export const DEMO_CATEGORIES = [
  { name: "Personal", color: "#10B981" },
  { name: "Work", color: "#3B82F6" },
  { name: "Learning", color: "#8B5CF6" },
  { name: "Projects", color: "#F59E0B" },
  { name: "Ideas", color: "#EF4444" },
]

export async function createDemoAccount() {
  try {
    // First, try to sign up the demo user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password,
    })

    // If user already exists, that's fine - we'll just sign them in
    if (signUpError && !signUpError.message.includes("already registered")) {
      throw signUpError
    }

    // Sign in to get the user ID
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password,
    })

    if (signInError) throw signInError

    const userId = signInData.user?.id
    if (!userId) throw new Error("No user ID found")

    // Check if demo data already exists
    const { data: existingMoments } = await supabase.from("moments").select("id").eq("user_id", userId).limit(1)

    // Only create demo data if it doesn't exist
    if (!existingMoments || existingMoments.length === 0) {
      // Create demo moments
      const momentsToInsert = DEMO_MOMENTS.map((moment) => ({
        ...moment,
        user_id: userId,
      }))

      const { error: momentsError } = await supabase.from("moments").insert(momentsToInsert)

      if (momentsError) {
        console.error("Error creating demo moments:", momentsError)
      }

      // Create demo wiki categories
      const categoriesToInsert = DEMO_CATEGORIES.map((category) => ({
        ...category,
        user_id: userId,
      }))

      const { error: categoriesError } = await supabase.from("wiki_categories").insert(categoriesToInsert)

      if (categoriesError) {
        console.error("Error creating demo categories:", categoriesError)
      }

      // Create demo wiki entries
      const wikiEntriesToInsert = DEMO_WIKI_ENTRIES.map((entry) => ({
        ...entry,
        user_id: userId,
        file_attachments: [],
      }))

      const { error: wikiError } = await supabase.from("wiki_entries").insert(wikiEntriesToInsert)

      if (wikiError) {
        console.error("Error creating demo wiki entries:", wikiError)
      }

      // Create profile if it doesn't exist
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: userId,
        email: DEMO_CREDENTIALS.email,
        full_name: "Demo User",
      })

      if (profileError) {
        console.error("Error creating demo profile:", profileError)
      }
    }

    return { success: true, user: signInData.user }
  } catch (error) {
    console.error("Error setting up demo account:", error)
    return { success: false, error }
  }
}

export async function signInWithDemo() {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password,
    })

    if (error) {
      // If demo account doesn't exist, create it
      if (error.message.includes("Invalid login credentials")) {
        return await createDemoAccount()
      }
      throw error
    }

    return { success: true, user: data.user }
  } catch (error) {
    console.error("Error signing in with demo:", error)
    return { success: false, error }
  }
}
