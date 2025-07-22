"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, ChevronRight, Edit3, Save, X, Trash2, Star, Globe, Lock, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

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

interface WikiEntryProps {
  entry: WikiEntryData
  categories: WikiCategory[]
  isExpanded: boolean
  onToggleExpand: () => void
  onUpdate: (updates: Partial<WikiEntryData>) => void
  onDelete: () => void
}

export function WikiEntry({ entry, categories, isExpanded, onToggleExpand, onUpdate, onDelete }: WikiEntryProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(entry)
  const [newTag, setNewTag] = useState("")

  const handleSave = () => {
    onUpdate(editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData(entry)
    setIsEditing(false)
  }

  const addTag = () => {
    if (newTag.trim() && !editData.tags.includes(newTag.trim())) {
      setEditData({
        ...editData,
        tags: [...editData.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setEditData({
      ...editData,
      tags: editData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      case "low":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "text-green-600 bg-green-50"
      case "draft":
        return "text-blue-600 bg-blue-50"
      case "archived":
        return "text-gray-600 bg-gray-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Button variant="ghost" size="sm" onClick={onToggleExpand} className="p-1 h-6 w-6">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>

            {isEditing ? (
              <Input
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="font-semibold text-lg flex-1"
                placeholder="Entry title"
              />
            ) : (
              <h3 className="font-semibold text-lg truncate flex-1">{entry.title}</h3>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Status and Priority Badges */}
            <Badge className={cn("text-xs", getStatusColor(entry.status))}>{entry.status}</Badge>
            <Badge className={cn("text-xs", getPriorityColor(entry.priority))}>{entry.priority}</Badge>

            {/* Visibility Icon */}
            {entry.is_public ? (
              <Globe className="h-4 w-4 text-blue-600" title="Public" />
            ) : (
              <Lock className="h-4 w-4 text-gray-600" title="Private" />
            )}

            {/* Rating */}
            {entry.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm text-gray-600">{entry.rating}</span>
              </div>
            )}

            {/* Action Buttons */}
            {isExpanded && (
              <div className="flex items-center gap-1">
                {isEditing ? (
                  <>
                    <Button variant="ghost" size="sm" onClick={handleSave} className="h-8 w-8 p-0">
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleCancel} className="h-8 w-8 p-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="h-8 w-8 p-0">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onDelete}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {entry.summary && !isExpanded && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{entry.summary}</p>}

        {/* Tags Preview */}
        {entry.tags.length > 0 && !isExpanded && (
          <div className="flex flex-wrap gap-1 mt-2">
            {entry.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {entry.tags.length > 3 && <span className="text-xs text-gray-500">+{entry.tags.length - 3} more</span>}
          </div>
        )}
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <Separator className="mb-4" />

          <div className="space-y-4">
            {/* Summary */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Summary</label>
              {isEditing ? (
                <Textarea
                  value={editData.summary || ""}
                  onChange={(e) => setEditData({ ...editData, summary: e.target.value })}
                  placeholder="Brief summary of this entry..."
                  className="min-h-[60px]"
                />
              ) : (
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                  {entry.summary || "No summary provided"}
                </p>
              )}
            </div>

            {/* Content */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Content</label>
              {isEditing ? (
                <Textarea
                  value={editData.content || ""}
                  onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                  placeholder="Entry content (supports Markdown)..."
                  className="min-h-[200px] font-mono text-sm"
                />
              ) : (
                <div className="text-sm bg-gray-50 p-3 rounded-md whitespace-pre-wrap">
                  {entry.content || "No content provided"}
                </div>
              )}
            </div>

            {/* Metadata Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
                {isEditing ? (
                  <Select
                    value={editData.category || ""}
                    onValueChange={(value) => setEditData({ ...editData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-gray-600">{entry.category || "Uncategorized"}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
                {isEditing ? (
                  <Select
                    value={editData.status}
                    onValueChange={(value: "draft" | "published" | "archived") =>
                      setEditData({ ...editData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge className={cn("text-xs", getStatusColor(entry.status))}>{entry.status}</Badge>
                )}
              </div>

              {/* Priority */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Priority</label>
                {isEditing ? (
                  <Select
                    value={editData.priority}
                    onValueChange={(value: "low" | "medium" | "high") => setEditData({ ...editData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge className={cn("text-xs", getPriorityColor(entry.priority))}>{entry.priority}</Badge>
                )}
              </div>

              {/* Visibility */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Visibility</label>
                {isEditing ? (
                  <Select
                    value={editData.is_public ? "public" : "private"}
                    onValueChange={(value) => setEditData({ ...editData, is_public: value === "public" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-1">
                    {entry.is_public ? (
                      <>
                        <Globe className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-600">Public</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-600">Private</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Tags</label>
              <div className="flex flex-wrap gap-1 mb-2">
                {(isEditing ? editData.tags : entry.tags).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                    {isEditing && (
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                        aria-label={`Remove ${tag} tag`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag..."
                    className="flex-1"
                    onKeyPress={(e) => e.key === "Enter" && addTag()}
                  />
                  <Button onClick={addTag} size="sm">
                    Add
                  </Button>
                </div>
              )}
            </div>

            {/* Timestamps */}
            <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Created: {formatDate(entry.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Updated: {formatDate(entry.updated_at)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
