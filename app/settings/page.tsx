"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Loader2, Moon, Sun, Bell, Download, LogOut } from "lucide-react"
import type { User } from "@supabase/supabase-js"

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    // Load preferences from localStorage
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    const savedNotifications = localStorage.getItem("notifications") === "true"
    setDarkMode(savedDarkMode)
    setNotifications(savedNotifications)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const toggleDarkMode = (enabled: boolean) => {
    setDarkMode(enabled)
    localStorage.setItem("darkMode", enabled.toString())
    // In a real app, you'd implement dark mode styling
  }

  const toggleNotifications = (enabled: boolean) => {
    setNotifications(enabled)
    localStorage.setItem("notifications", enabled.toString())
    // In a real app, you'd set up push notifications
  }

  const exportData = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("moments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      const dataStr = JSON.stringify(data, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `momentlens-export-${new Date().toISOString().split("T")[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting data:", error)
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
        <p className="text-gray-600">Please sign in to access settings</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pb-20">
      <div className="max-w-md mx-auto p-4 pt-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Settings</h1>
          <p className="text-gray-600">Customize your MomentLens experience</p>
        </div>

        <div className="space-y-4">
          {/* Account Info */}
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Account</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-gray-600">Email</Label>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Member since</Label>
                  <p className="font-medium">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  <div>
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-gray-600">Switch to dark theme</p>
                  </div>
                </div>
                <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5" />
                  <div>
                    <Label>Notifications</Label>
                    <p className="text-sm text-gray-600">Daily reflection reminders</p>
                  </div>
                </div>
                <Switch checked={notifications} onCheckedChange={toggleNotifications} />
              </div>
            </CardContent>
          </Card>

          {/* Data */}
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Your Data</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={exportData} variant="outline" className="w-full rounded-2xl bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
              <p className="text-xs text-gray-500 mt-2 text-center">Download all your moments as JSON</p>
            </CardContent>
          </Card>

          {/* Sign Out */}
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardContent className="pt-6">
              <Button onClick={handleSignOut} variant="destructive" className="w-full rounded-2xl">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Navigation />
    </div>
  )
}
