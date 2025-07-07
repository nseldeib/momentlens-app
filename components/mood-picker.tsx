"use client"
import { cn } from "@/lib/utils"

const moods = [
  { value: 1, emoji: "😢", label: "Very Low", color: "from-red-400 to-red-500" },
  { value: 2, emoji: "😔", label: "Low", color: "from-orange-400 to-orange-500" },
  { value: 3, emoji: "😐", label: "Neutral", color: "from-yellow-400 to-yellow-500" },
  { value: 4, emoji: "😊", label: "Good", color: "from-green-400 to-green-500" },
  { value: 5, emoji: "😄", label: "Great", color: "from-blue-400 to-blue-500" },
]

interface MoodPickerProps {
  value?: number
  onChange: (mood: number) => void
}

export function MoodPicker({ value, onChange }: MoodPickerProps) {
  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-gray-700">How are you feeling?</label>
      <div className="flex justify-between gap-2">
        {moods.map((mood) => (
          <button
            key={mood.value}
            type="button"
            onClick={() => onChange(mood.value)}
            className={cn(
              "flex flex-col items-center p-3 rounded-2xl transition-all duration-200 hover:scale-105",
              value === mood.value
                ? `bg-gradient-to-br ${mood.color} text-white shadow-lg scale-105`
                : "bg-white border-2 border-gray-200 hover:border-gray-300",
            )}
          >
            <span className="text-2xl mb-1">{mood.emoji}</span>
            <span className="text-xs font-medium">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
