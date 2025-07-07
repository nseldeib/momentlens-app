import { formatDistanceToNow } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const moodEmojis = {
  1: "😢",
  2: "😔",
  3: "😐",
  4: "😊",
  5: "😄",
}

interface MomentCardProps {
  moment: {
    id: string
    content?: string
    notes?: string // for daily_checkins compatibility
    mood?: number
    score?: number // for daily_checkins compatibility
    tags?: string[]
    emotions?: string[] // for daily_checkins compatibility
    created_at: string
    prompt_type?: string
  }
}

export function MomentCard({ moment }: MomentCardProps) {
  // Handle both moments and daily_checkins data structures
  const content = moment.content || moment.notes || ""
  const moodValue = moment.mood || moment.score || 3
  const tagList = moment.tags || moment.emotions || []

  return (
    <Card className="mb-4 rounded-2xl border-0 shadow-sm bg-gradient-to-br from-white to-gray-50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{moodEmojis[moodValue as keyof typeof moodEmojis] || "😐"}</span>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(moment.created_at), { addSuffix: true })}
            </span>
          </div>
          {moment.prompt_type && (
            <Badge variant="outline" className="rounded-full text-xs">
              {moment.prompt_type}
            </Badge>
          )}
        </div>

        <p className="text-gray-800 mb-3 leading-relaxed">{content}</p>

        {tagList.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tagList.map((tag) => (
              <Badge key={tag} variant="secondary" className="rounded-full bg-blue-100 text-blue-700 text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
