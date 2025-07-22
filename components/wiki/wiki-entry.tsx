"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  ChevronDown,
  ChevronRight,
  Edit,
  Save,
  X,
  Trash2,
  Star,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  Tag,
  Plus,
} from "lucide-react"
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
  const [editData, setEditData] = useState<Partial<WikiEntryData>>({})
  const [newTag, setNewTag] = useState("")

  const handleEdit = () => {
    setEditData({
      title: entry.title,
      summary: entry.summary || "",
      content: entry.content || "",
      tags: [...entry.tags],
      category: entry.category,
      status: entry.status,
      priority: entry.priority,
      is_public: entry.is_public,
      rating: entry.rating,
    })
    setIsEditing(true)
  }

  const handleSave = () => {
    onUpdate(editData)
    setIsEditing(false)
    setEditData({})
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({})
  }

  const addTag = () => {
    if (newTag.trim() && !editData.tags?.includes(newTag.trim())) {
      setEditData({
        ...editData,
        tags: [...(editData.tags || []), newTag.trim()],
      })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setEditData({
      ...editData,
      tags: editData.tags?.filter((tag) => tag !== tagToRemove) || [],
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTag()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "published":
        return "bg-green-100 text-green-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-blue-100 text-blue-800"
      case "low":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
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

  const renderStars = (rating?: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn("h-4 w-4", i < (rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300")}
      />
    ))
  }

  return (
    <div className="border rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Button variant="ghost" size="sm" onClick={onToggleExpand} className="p-1 h-auto">
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>

          {isEditing ? (
            <Input
              value={editData.title || ""}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="font-medium"
              placeholder="Entry title"
            />
          ) : (
            <h3 className="font-medium truncate cursor-pointer" onClick={onToggleExpand}>
              {entry.title}
            </h3>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <Badge className={getStatusColor(entry.status)}>{entry.status}</Badge>

          {/* Priority Badge */}
          <Badge className={getPriorityColor(entry.priority)}>{entry.priority}</Badge>

          {/* Visibility Icon */}
          {entry.is_public ? (
            <Eye className="h-4 w-4 text-green-600" title="Public" />
          ) : (
            <EyeOff className="h-4 w-4 text-gray-400" title="Private" />
          )}

          {/* Actions */}
          {isExpanded && (
            <div className="flex items-center gap-1">
              {isEditing ? (
                <>
                  <Button variant="ghost" size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleCancel}>
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={handleEdit}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Entry</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{entry.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {(entry.summary || isEditing) && (
        <div className="text-sm text-gray-600">
          {isEditing ? (
            <Input
              value={editData.summary || ""}
              onChange={(e) => setEditData({ ...editData, summary: e.target.value })}
              placeholder="Brief summary..."
            />
          ) : (
            entry.summary
          )}
        </div>
      )}

      {/* Tags */}
      {(entry.tags.length > 0 || isEditing) && (
        <div className="flex flex-wrap gap-1">
          {isEditing ? (
            <>
              {editData.tags?.map((tag) => (
                <Badge key={tag} variant="outline" className="gap-1">
                  <Tag className="h-3 w-3" />
                  {tag}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
              <div className="flex items-center gap-1">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add tag..."
                  className="w-24 h-6 text-xs"
                />
                <Button variant="ghost" size="sm" onClick={addTag} className="h-6 w-6 p-0">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </>
          ) : (
            entry.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))
          )}
        </div>
      )}

      {/* Expanded Content */}
      {isExpanded && (
        <div className="space-y-4 pt-2 border-t">
          {/* Content */}
          <div>
            <Label className="text-sm font-medium">Content</Label>
            {isEditing ? (
              <Textarea
                value={editData.content || ""}
                onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                placeholder="Entry content..."
                rows={6}
                className="mt-1"
              />
            ) : (
              <div className="mt-1 p-3 bg-gray-50 rounded-md min-h-[100px] whitespace-pre-wrap">
                {entry.content || "No content"}
              </div>
            )}
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <Label className="text-sm font-medium">Category</Label>
              {isEditing ? (
                <Select
                  value={editData.category || "none"}
                  onValueChange={(value) => setEditData({ ...editData, category: value })}
                >
                  <SelectTrigger className="mt-1">
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
                <div className="mt-1 text-sm">{entry.category || "None"}</div>
              )}
            </div>

            {/* Status */}
            <div>
              <Label className="text-sm font-medium">Status</Label>
              {isEditing ? (
                <Select
                  value={editData.status || entry.status}
                  onValueChange={(value: "draft" | "published" | "archived") =>
                    setEditData({ ...editData, status: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge className={cn("mt-1", getStatusColor(entry.status))}>{entry.status}</Badge>
              )}
            </div>

            {/* Priority */}
            <div>
              <Label className="text-sm font-medium">Priority</Label>
              {isEditing ? (
                <Select
                  value={editData.priority || entry.priority}
                  onValueChange={(value: "low" | "medium" | "high") => setEditData({ ...editData, priority: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge className={cn("mt-1", getPriorityColor(entry.priority))}>{entry.priority}</Badge>
              )}
            </div>

            {/* Visibility */}
            <div>
              <Label className="text-sm font-medium">Visibility</Label>
              {isEditing ? (
                <div className="flex items-center space-x-2 mt-1">
                  <Switch
                    checked={editData.is_public ?? entry.is_public}
                    onCheckedChange={(checked) => setEditData({ ...editData, is_public: checked })}
                  />
                  <Label className="text-sm">{(editData.is_public ?? entry.is_public) ? "Public" : "Private"}</Label>
                </div>
              ) : (
                <div className="mt-1 flex items-center gap-1">
                  {entry.is_public ? (
                    <>
                      <Eye className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Public</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Private</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Rating */}
            <div>
              <Label className="text-sm font-medium">Rating</Label>
              {isEditing ? (
                <Select
                  value={editData.rating?.toString() || "none"}
                  onValueChange={(value) =>
                    setEditData({ ...editData, rating: value ? Number.parseInt(value) : undefined })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="No rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No rating</SelectItem>
                    <SelectItem value="1">1 star</SelectItem>
                    <SelectItem value="2">2 stars</SelectItem>
                    <SelectItem value="3">3 stars</SelectItem>
                    <SelectItem value="4">4 stars</SelectItem>
                    <SelectItem value="5">5 stars</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="mt-1 flex items-center gap-1">
                  {renderStars(entry.rating)}
                  {entry.rating && <span className="text-sm ml-1">({entry.rating}/5)</span>}
                </div>
              )}
            </div>

            {/* Timestamps */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Created: {formatDate(entry.created_at)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Updated: {formatDate(entry.updated_at)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
