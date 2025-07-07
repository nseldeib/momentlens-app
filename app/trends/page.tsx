"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { subWeeks, subMonths } from "date-fns"
import type { User } from "@supabase/supabase-js"

interface Moment {
  id: string
  mood?: number
  score?: number
  tags?: string[]
  emotions?: string[]
  created_at: string
}

type TimeRange = "week" | "month" | "all"

const moodEmojis = {
  1: "😢",
  2: "😔",
  3: "😐",
  4: "😊",
  5: "😄",
}

const moodLabels = {
  1: "Very Low",
  2: "Low",
  3: "Neutral",
  4: "Good",
  5: "Great",
}

export default function TrendsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [moments, setMoments] = useState<Moment[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<TimeRange>("week")

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

  const fetchMoments = async (userId: string) => {
    try {
      // Try moments table first
      const { data: momentsData, error: momentsError } = await supabase
        .from("moments")
        .select("id, mood, tags, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (!momentsError && momentsData && momentsData.length > 0) {
        setMoments(momentsData)
        return
      }

      // Fallback to daily_checkins
      const { data: checkinsData, error: checkinsError } = await supabase
        .from("daily_checkins")
        .select("id, score, emotions, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (checkinsError) throw checkinsError
      setMoments(checkinsData || [])
    } catch (error) {
      console.error("Error fetching moments:", error)
    }
  }

  const getFilteredMoments = () => {
    const now = new Date()
    let cutoffDate: Date

    switch (timeRange) {
      case "week":
        cutoffDate = subWeeks(now, 1)
        break
      case "month":
        cutoffDate = subMonths(now, 1)
        break
      default:
        return moments
    }

    return moments.filter((moment) => new Date(moment.created_at) >= cutoffDate)
  }

  const getMoodStats = () => {
    const filtered = getFilteredMoments()
    const moodCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

    filtered.forEach((moment) => {
      const moodValue = moment.mood || moment.score || 3
      moodCounts[moodValue as keyof typeof moodCounts]++
    })

    const total = filtered.length
    const average = total > 0 ? filtered.reduce((sum, m) => sum + (m.mood || m.score || 3), 0) / total : 0

    return { moodCounts, total, average }
  }

  const getTopTags = () => {
    const filtered = getFilteredMoments()
    const tagCounts: Record<string, number> = {}

    filtered.forEach((moment) => {
      const tags = moment.tags || moment.emotions || []
      tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    })

    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
  }

  const getTimeOfDayStats = () => {
    const filtered = getFilteredMoments()
    const timeSlots = {
      morning: 0, // 6-12
      afternoon: 0, // 12-18
      evening: 0, // 18-22
      night: 0, // 22-6
    }

    filtered.forEach((moment) => {
      const hour = new Date(moment.created_at).getHours()
      if (hour >= 6 && hour < 12) timeSlots.morning++
      else if (hour >= 12 && hour < 18) timeSlots.afternoon++
      else if (hour >= 18 && hour < 22) timeSlots.evening++
      else timeSlots.night++
    })

    return timeSlots
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
        <p className="text-gray-600">Please sign in to view your trends</p>
      </div>
    )
  }

  const moodStats = getMoodStats()
  const topTags = getTopTags()
  const timeStats = getTimeOfDayStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pb-20">
      <div className="max-w-md mx-auto p-4 pt-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Your Trends</h1>
          <p className="text-gray-600">Insights from your moments</p>
        </div>

        <div className="flex gap-2 mb-6">
          {(["week", "month", "all"] as TimeRange[]).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              onClick={() => setTimeRange(range)}
              className="rounded-2xl flex-1 capitalize"
            >
              {range === "all" ? "All Time" : `Past ${range}`}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {/* Mood Overview */}
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Mood Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-3xl mb-2">
                  {moodEmojis[Math.round(moodStats.average) as keyof typeof moodEmojis] || "😐"}
                </div>
                <p className="text-sm text-gray-600">
                  Average: {moodStats.average.toFixed(1)} (
                  {moodLabels[Math.round(moodStats.average) as keyof typeof moodLabels]})
                </p>
                <p className="text-xs text-gray-500">{moodStats.total} moments</p>
              </div>

              <div className="space-y-2">
                {Object.entries(moodStats.moodCounts).map(([mood, count]) => {
                  const percentage = moodStats.total > 0 ? (count / moodStats.total) * 100 : 0
                  return (
                    <div key={mood} className="flex items-center gap-3">
                      <span className="text-lg">{moodEmojis[Number.parseInt(mood) as keyof typeof moodEmojis]}</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{moodLabels[Number.parseInt(mood) as keyof typeof moodLabels]}</span>
                          <span>{count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top Tags */}
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Most Common Tags</CardTitle>
            </CardHeader>
            <CardContent>
              {topTags.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No tags yet</p>
              ) : (
                <div className="space-y-3">
                  {topTags.map(([tag, count]) => (
                    <div key={tag} className="flex justify-between items-center">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{tag}</span>
                      <span className="text-gray-600 font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Time of Day */}
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">When You Journal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(timeStats).map(([time, count]) => (
                  <div key={time} className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{count}</div>
                    <div className="text-sm text-gray-600 capitalize">{time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Navigation />
    </div>
  )
}
