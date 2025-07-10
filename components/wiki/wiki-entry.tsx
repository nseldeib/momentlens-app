"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import {
  ChevronDown,
  ChevronRight,
  Edit3,
  Save,
  X,
  Trash2,
  Star,
  StarOff,
  Calendar,
  Tag,
  Eye,
  EyeOff,
  Link,
  Plus,
  Paperclip,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

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
  const [newLink, setNewLink] = useState({ title: "", url: "" })

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
      setEditData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setEditData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const addRelatedLink = () => {
    if (newLink.title.trim() && newLink.url.trim()) {
      setEditData((prev) => ({
        ...prev,
        related_links: [...prev.related_links, { ...newLink, id: Date.now() }],
      }))
      setNewLink({ title: "", url: "" })
    }
  }

  const removeRelatedLink = (linkId: number) => {
    setEditData((prev) => ({
      ...prev,
      related_links: prev.related_links.filter((link) => link.id !== linkId),
    }))
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

  const renderStars = (rating?: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        onClick={() => setEditData((prev) => ({ ...prev, rating: i + 1 }))}
        disabled={!isEditing}
        className={`${isEditing ? "cursor-pointer" : "cursor-default"}`}
      >
        {i < (rating || 0) ? (
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ) : (
          <StarOff className="h-4 w-4 text-gray-300" />
        )}
      </button>
    ))
  }

  return (
    <Card className="overflow-hidden">
      {/* Header - Always Visible */}
      <div className="p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={onToggleExpand}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium truncate">{entry.title}</h3>
                <div className="flex items-center gap-1">
                  {entry.is_public ? (
                    <Eye className="h-3 w-3 text-green-600" />
                  ) : (
                    <EyeOff className="h-3 w-3 text-gray-400" />
                  )}
                  <Badge className={`text-xs ${getPriorityColor(entry.priority)}`}>{entry.priority}</Badge>
                  <Badge className={`text-xs ${getStatusColor(entry.status)}`}>{entry.status}</Badge>
                </div>
              </div>

              {entry.summary && <p className="text-sm text-gray-600 truncate">{entry.summary}</p>}

              <div className="flex items-center gap-2 mt-1">
                {entry.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {entry.tags.length > 3 && <span className="text-xs text-gray-500">+{entry.tags.length - 3} more</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(entry.rating)}</div>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(entry.updated_at), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t bg-white">
          <div className="p-4 space-y-4">
            {/* Edit Controls */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Created {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                </span>
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button size="sm" onClick={handleSave}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit3 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={onDelete}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Content Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div className="md:col-span-2">
                <Label>Title</Label>
                {isEditing ? (
                  <Input
                    value={editData.title}
                    onChange={(e) => setEditData((prev) => ({ ...prev, title: e.target.value }))}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 p-2 bg-gray-50 rounded">{entry.title}</p>
                )}
              </div>

              {/* Summary */}
              <div className="md:col-span-2">
                <Label>Summary</Label>
                {isEditing ? (
                  <Textarea
                    value={editData.summary || ""}
                    onChange={(e) => setEditData((prev) => ({ ...prev, summary: e.target.value }))}
                    className="mt-1"
                    rows={2}
                  />
                ) : (
                  <p className="mt-1 p-2 bg-gray-50 rounded">{entry.summary || "No summary"}</p>
                )}
              </div>

              {/* Content */}
              <div className="md:col-span-2">
                <Label>Content</Label>
                {isEditing ? (
                  <Textarea
                    value={editData.content || ""}
                    onChange={(e) => setEditData((prev) => ({ ...prev, content: e.target.value }))}
                    className="mt-1"
                    rows={6}
                  />
                ) : (
                  <div className="mt-1 p-2 bg-gray-50 rounded min-h-[100px] whitespace-pre-wrap">
                    {entry.content || "No content"}
                  </div>
                )}
              </div>

              {/* Category */}
              <div>
                <Label>Category</Label>
                {isEditing ? (
                  <Select
                    value={editData.category || ""}
                    onValueChange={(value) => setEditData((prev) => ({ ...prev, category: value }))}
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
                  <p className="mt-1 p-2 bg-gray-50 rounded">{entry.category || "No category"}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <Label>Status</Label>
                {isEditing ? (
                  <Select
                    value={editData.status}
                    onValueChange={(value: "draft" | "published" | "archived") =>
                      setEditData((prev) => ({ ...prev, status: value }))
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
                  <p className="mt-1 p-2 bg-gray-50 rounded capitalize">{entry.status}</p>
                )}
              </div>

              {/* Priority */}
              <div>
                <Label>Priority</Label>
                {isEditing ? (
                  <Select
                    value={editData.priority}
                    onValueChange={(value: "low" | "medium" | "high") =>
                      setEditData((prev) => ({ ...prev, priority: value }))
                    }
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
                  <p className="mt-1 p-2 bg-gray-50 rounded capitalize">{entry.priority}</p>
                )}
              </div>

              {/* Public/Private Toggle */}
              <div>
                <Label>Visibility</Label>
                <div className="mt-1 flex items-center space-x-2">
                  {isEditing ? (
                    <Switch
                      checked={editData.is_public}
                      onCheckedChange={(checked) => setEditData((prev) => ({ ...prev, is_public: checked }))}
                    />
                  ) : (
                    <Switch checked={entry.is_public} disabled />
                  )}
                  <Label className="text-sm">
                    {(isEditing ? editData.is_public : entry.is_public) ? "Public" : "Private"}
                  </Label>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div>
              <Label>Rating</Label>
              <div className="mt-1 flex items-center gap-1">
                {renderStars(isEditing ? editData.rating : entry.rating)}
                {isEditing && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditData((prev) => ({ ...prev, rating: undefined }))}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label>Tags</Label>
              <div className="mt-1 space-y-2">
                <div className="flex flex-wrap gap-1">
                  {(isEditing ? editData.tags : entry.tags).map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {tag}
                      {isEditing && <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addTag()}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={addTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Related Links */}
            <div>
              <Label>Related Links</Label>
              <div className="mt-1 space-y-2">
                {(isEditing ? editData.related_links : entry.related_links).map((link: any) => (
                  <div key={link.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <Link className="h-4 w-4 text-gray-400" />
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex-1"
                    >
                      {link.title}
                    </a>
                    {isEditing && (
                      <X
                        className="h-4 w-4 cursor-pointer text-gray-400 hover:text-red-600"
                        onClick={() => removeRelatedLink(link.id)}
                      />
                    )}
                  </div>
                ))}
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Link title..."
                      value={newLink.title}
                      onChange={(e) => setNewLink((prev) => ({ ...prev, title: e.target.value }))}
                      className="flex-1"
                    />
                    <Input
                      placeholder="URL..."
                      value={newLink.url}
                      onChange={(e) => setNewLink((prev) => ({ ...prev, url: e.target.value }))}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={addRelatedLink}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* File Attachments Placeholder */}
            <div>
              <Label>File Attachments</Label>
              <div className="mt-1 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
                <Paperclip className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">File upload functionality coming soon</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
