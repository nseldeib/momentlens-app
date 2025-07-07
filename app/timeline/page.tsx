"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Navigation } from "@/components/navigation"
import { MomentCard } from "@/components/moment-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Loader2 } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface Moment {
  id: string
  content?: string
  notes?: string
  mood?: number
  score?: number
  tags?: string[]
  emotions?: string[]
  created_at: string
  prompt_type?: string
}

export default function TimelinePage() {
  const [user, setUser] = useState<User | null>(null)
  const [moments, setMoments] = useState<Moment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredMoments, setFilteredMoments] = useState<Moment[]>([])

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        await fetchMoments(user.id)
      }
      setLoading(false)
    }

    getUser()
  }, [])

  useEffect(() => {
    // Filter moments based on search query
    if (!searchQuery.trim()) {
      setFilteredMoments(moments)
    } else {
      const filtered = moments.filter((moment) => {
        const content = moment.content || moment.notes || ""
        const tags = moment.tags || moment.emotions || []
        return (
          content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      })
      setFilteredMoments(filtered)
    }
  }, [searchQuery, moments])

  const fetchMoments = async (userId: string) => {
    try {
      // Try to fetch from moments table first
      const { data: momentsData, error: momentsError } = await supabase
        .from("moments")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (!momentsError && momentsData && momentsData.length > 0) {
        setMoments(momentsData)
        return
      }

      // Fallback to daily_checkins if moments table is empty
      const { data: checkinsData, error: checkinsError } = await supabase
        .from("daily_checkins")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (checkinsError) throw checkinsError
      setMoments(checkinsData || [])
    } catch (error) {
      console.error("Error fetching moments:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-gray-600">Please sign in to view your timeline</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pb-20">
      <div className="max-w-md mx-auto p-4 pt-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Your Timeline</h1>
          <p className="text-gray-600">Reflecting on your moments</p>
        </div>

        <div className="mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search moments or tags..."
              className="pl-10 rounded-2xl border-gray-200"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredMoments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                {searchQuery ? "No moments found matching your search" : "No moments yet"}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => (window.location.href = "/")}
                  className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600"
                >
                  Capture Your First Moment
                </Button>
              )}
            </div>
          ) : (
            filteredMoments.map((moment) => <MomentCard key={moment.id} moment={moment} />)
          )}
        </div>
      </div>

      <Navigation />
    </div>
  )
}
