"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { AuthForm } from "@/components/auth/auth-form"
import { Navigation } from "@/components/navigation"
import { MoodPicker } from "@/components/mood-picker"
import { TagInput } from "@/components/tag-input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Sparkles } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { signInWithDemo } from "@/lib/demo-setup"
import { WikiWidget } from "@/components/wiki/wiki-widget"

const defaultQuestions = [
  "How do you feel right now?",
  "What just happened?",
  "What do you want to remember about this?",
]

export default function CapturePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [content, setContent] = useState("")
  const [mood, setMood] = useState<number>(3)
  const [tags, setTags] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isDemoLoading, setIsDemoLoading] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async () => {
    if (!content.trim() || !user) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase.from("moments").insert({
        user_id: user.id,
        content: content.trim(),
        mood,
        tags,
      })

      if (error) throw error

      // Reset form
      setContent("")
      setMood(3)
      setTags([])
      setCurrentQuestion(0)

      // Show success animation
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    } catch (error) {
      console.error("Error saving moment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDemoSignIn = async () => {
    setIsDemoLoading(true)
    try {
      await signInWithDemo()
    } catch (error) {
      console.error("Demo sign-in error:", error)
    } finally {
      setIsDemoLoading(false)
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
    return <AuthForm />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pb-20">
      <div className="max-w-4xl mx-auto p-4 pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            MomentLens
          </h1>
          <p className="text-gray-600">Capture this moment</p>
        </div>

        {!user && (
          <div className="mb-6 text-center">
            <p className="text-xs text-gray-500 mb-1">Want to explore MomentLens?</p>
            <button
              onClick={handleDemoSignIn}
              disabled={isDemoLoading}
              className="text-xs text-blue-600/70 hover:text-blue-700 underline underline-offset-2 disabled:opacity-50 transition-colors"
            >
              {isDemoLoading ? "Loading demo..." : "Try the demo account"}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Moment Capture Card */}
          <Card className="rounded-3xl border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-lg font-medium text-gray-800">{defaultQuestions[currentQuestion]}</CardTitle>
              <div className="flex justify-center gap-2 mt-4">
                {defaultQuestions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentQuestion ? "bg-blue-600 w-6" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <MoodPicker value={mood} onChange={setMood} />

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Your thoughts</label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="rounded-2xl border-gray-200 resize-none min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={500}
                />
                <div className="text-right text-xs text-gray-500">{content.length}/500</div>
              </div>

              <TagInput tags={tags} onChange={setTags} />

              <Button
                onClick={handleSubmit}
                disabled={!content.trim() || isSubmitting}
                className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-12 text-base font-medium transition-all duration-200 hover:scale-[1.02]"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : showSuccess ? (
                  <Sparkles className="mr-2 h-5 w-5" />
                ) : null}
                {isSubmitting ? "Saving..." : showSuccess ? "Saved!" : "Save Moment"}
              </Button>
            </CardContent>
          </Card>

          {/* Wiki Widget */}
          {user && <WikiWidget user={user} />}
        </div>
      </div>

      <Navigation />
    </div>
  )
}
