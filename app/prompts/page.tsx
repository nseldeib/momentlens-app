"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowRight } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface PromptPack {
  id: string
  name: string
  description: string
  icon: string
  questions: string[]
}

export default function PromptsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [promptPacks, setPromptPacks] = useState<PromptPack[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPack, setSelectedPack] = useState<PromptPack | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      await fetchPromptPacks()
      setLoading(false)
    }

    getUser()
  }, [])

  const fetchPromptPacks = async () => {
    try {
      const { data, error } = await supabase.from("prompt_packs").select("*").order("created_at")

      if (error) throw error
      setPromptPacks(data || [])
    } catch (error) {
      console.error("Error fetching prompt packs:", error)
    }
  }

  const handleUsePromptPack = (pack: PromptPack) => {
    // Store selected prompt pack in localStorage for the capture page
    localStorage.setItem("selectedPromptPack", JSON.stringify(pack))
    window.location.href = "/"
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
        <p className="text-gray-600">Please sign in to view prompt packs</p>
      </div>
    )
  }

  if (selectedPack) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pb-20">
        <div className="max-w-md mx-auto p-4 pt-8">
          <div className="text-center mb-6">
            <Button variant="ghost" onClick={() => setSelectedPack(null)} className="mb-4">
              ← Back to Prompt Packs
            </Button>
            <div className="text-4xl mb-2">{selectedPack.icon}</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{selectedPack.name}</h1>
            <p className="text-gray-600">{selectedPack.description}</p>
          </div>

          <Card className="rounded-2xl border-0 shadow-sm mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Questions in this pack</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedPack.questions.map((question, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-gray-800">{question}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={() => handleUsePromptPack(selectedPack)}
            className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-12"
          >
            Use This Prompt Pack
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <Navigation />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pb-20">
      <div className="max-w-md mx-auto p-4 pt-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Prompt Packs</h1>
          <p className="text-gray-600">Curated questions to guide your reflection</p>
        </div>

        <div className="space-y-4">
          {promptPacks.map((pack) => (
            <Card
              key={pack.id}
              className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedPack(pack)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{pack.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{pack.name}</h3>
                    <p className="text-sm text-gray-600">{pack.description}</p>
                    <p className="text-xs text-gray-500 mt-2">{pack.questions.length} questions</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Navigation />
    </div>
  )
}
