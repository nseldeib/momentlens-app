"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { WikiEntry } from "./wiki-entry"
import { WikiFilters } from "./wiki-filters"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, BookOpen } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface WikiEntryData {
  id: string
  title: string
  summary?: string
  content?: string
  tags: string[]
  category?: string
  status: "draft" | "published" | "archived"
  priority: "low" | "medium" | "high"
  is_public: boolean
  rating?: number
  file_attachments: any[]
  related_links: any[]
  created_at: string
  updated_at: string
}

interface WikiCategory {
  id: string
  name: string
  color: string
}

interface WikiFiltersState {
  tags: string[]
  category: string
  status: string
  visibility: string
  search: string
}

interface WikiWidgetProps {
  user: User
}

const DEFAULT_CATEGORIES = [
  { id: "default-1", name: "Personal", color: "#10B981" },
  { id: "default-2", name: "Work", color: "#3B82F6" },
  { id: "default-3", name: "Learning", color: "#8B5CF6" },
  { id: "default-4", name: "Projects", color: "#F59E0B" },
  { id: "default-5", name: "Ideas", color: "#EF4444" },
]

export function WikiWidget({ user }: WikiWidgetProps) {
  const [entries, setEntries] = useState<WikiEntryData[]>([])
  const [categories, setCategories] = useState<WikiCategory[]>(DEFAULT_CATEGORIES)
  const [loading, setLoading] = useState(true)
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null)
  const [filters, setFilters] = useState<WikiFiltersState>({
    tags: [],
    category: "all",
    status: "all",
    visibility: "all",
    search: "",
  })

  useEffect(() => {
    if (user) {
      initializeUserData()
    }
  }, [user])

  const initializeUserData = async () => {
    try {
      // First, ensure default categories exist for the user
      await createDefaultCategories()
      // Then fetch all data
      await Promise.all([fetchEntries(), fetchCategories()])
    } catch (error) {
      console.error("Error initializing user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const createDefaultCategories = async () => {
    try {
      // Check if user has any categories
      const { data: existingCategories, error: checkError } = await supabase
        .from("wiki_categories")
        .select("id")
        .eq("user_id", user.id)
        .limit(1)

      if (checkError) {
        console.error("Error checking categories:", checkError)
        return
      }

      // If no categories exist, create defaults
      if (!existingCategories || existingCategories.length === 0) {
        const categoriesToInsert = DEFAULT_CATEGORIES.map((category) => ({
          user_id: user.id,
          name: category.name,
          color: category.color,
        }))

        const { error: insertError } = await supabase.from("wiki_categories").insert(categoriesToInsert)

        if (insertError) {
          console.error("Error creating default categories:", insertError)
        }
      }
    } catch (error) {
      console.error("Error in createDefaultCategories:", error)
    }
  }

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from("wiki_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })

      if (error) throw error
      setEntries(data || [])
    } catch (error) {
      console.error("Error fetching wiki entries:", error)
      setEntries([])
    }
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from("wiki_categories").select("*").eq("user_id", user.id).order("name")

      if (error) {
        console.error("Error fetching categories:", error)
        // Use default categories if fetch fails
        setCategories(DEFAULT_CATEGORIES)
        return
      }

      // If no categories returned, use defaults
      if (!data || data.length === 0) {
        setCategories(DEFAULT_CATEGORIES)
      } else {
        setCategories(data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      setCategories(DEFAULT_CATEGORIES)
    }
  }

  const createNewEntry = async () => {
    try {
      const newEntry = {
        user_id: user.id,
        title: "New Entry",
        summary: "",
        content: "",
        tags: [],
        category: categories[0]?.name || "Personal",
        status: "draft" as const,
        priority: "medium" as const,
        is_public: false,
        rating: null,
        file_attachments: [],
        related_links: [],
      }

      const { data, error } = await supabase.from("wiki_entries").insert(newEntry).select().single()

      if (error) throw error

      setEntries((prev) => [data, ...prev])
      setExpandedEntry(data.id)
    } catch (error) {
      console.error("Error creating entry:", error)
    }
  }

  const updateEntry = async (id: string, updates: Partial<WikiEntryData>) => {
    try {
      const { data, error } = await supabase
        .from("wiki_entries")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single()

      if (error) throw error

      setEntries((prev) => prev.map((entry) => (entry.id === id ? { ...entry, ...data } : entry)))
    } catch (error) {
      console.error("Error updating entry:", error)
    }
  }

  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase.from("wiki_entries").delete().eq("id", id).eq("user_id", user.id)

      if (error) throw error

      setEntries((prev) => prev.filter((entry) => entry.id !== id))
      if (expandedEntry === id) {
        setExpandedEntry(null)
      }
    } catch (error) {
      console.error("Error deleting entry:", error)
    }
  }

  const filteredEntries = entries.filter((entry) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesSearch =
        entry.title.toLowerCase().includes(searchLower) ||
        entry.summary?.toLowerCase().includes(searchLower) ||
        entry.content?.toLowerCase().includes(searchLower) ||
        entry.tags.some((tag) => tag.toLowerCase().includes(searchLower))

      if (!matchesSearch) return false
    }

    // Tag filter
    if (filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some((tag) => entry.tags.includes(tag))
      if (!hasMatchingTag) return false
    }

    // Category filter
    if (filters.category && filters.category !== "all" && entry.category !== filters.category) {
      return false
    }

    // Status filter
    if (filters.status && filters.status !== "all" && entry.status !== filters.status) {
      return false
    }

    // Visibility filter
    if (filters.visibility && filters.visibility !== "all") {
      if (filters.visibility === "public" && !entry.is_public) return false
      if (filters.visibility === "private" && entry.is_public) return false
    }

    return true
  })

  const allTags = Array.from(new Set(entries.flatMap((entry) => entry.tags)))

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Personal Wiki
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Personal Wiki
          </CardTitle>
          <Button onClick={createNewEntry} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New Entry
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <WikiFilters
          filters={filters}
          onFiltersChange={setFilters}
          availableTags={allTags}
          availableCategories={categories.map((c) => c.name)}
        />

        <div className="space-y-2">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {entries.length === 0 ? (
                <>
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No wiki entries yet. Create your first entry to get started!</p>
                </>
              ) : (
                <p>No entries match your current filters.</p>
              )}
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <WikiEntry
                key={entry.id}
                entry={entry}
                categories={categories}
                isExpanded={expandedEntry === entry.id}
                onToggleExpand={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                onUpdate={(updates) => updateEntry(entry.id, updates)}
                onDelete={() => deleteEntry(entry.id)}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
