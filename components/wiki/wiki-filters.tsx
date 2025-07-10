"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"

interface WikiFiltersState {
  tags: string[]
  category: string
  status: string
  visibility: string
  search: string
}

interface WikiFiltersProps {
  filters: WikiFiltersState
  onFiltersChange: (filters: WikiFiltersState) => void
  availableTags: string[]
  availableCategories: string[]
}

export function WikiFilters({ filters, onFiltersChange, availableTags, availableCategories }: WikiFiltersProps) {
  const updateFilter = (key: keyof WikiFiltersState, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const addTag = (tag: string) => {
    if (!filters.tags.includes(tag)) {
      updateFilter("tags", [...filters.tags, tag])
    }
  }

  const removeTag = (tag: string) => {
    updateFilter(
      "tags",
      filters.tags.filter((t) => t !== tag),
    )
  }

  const clearAllFilters = () => {
    onFiltersChange({
      tags: [],
      category: "all",
      status: "all",
      visibility: "all",
      search: "",
    })
  }

  const hasActiveFilters =
    filters.tags.length > 0 ||
    filters.category !== "all" ||
    filters.status !== "all" ||
    filters.visibility !== "all" ||
    filters.search

  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search entries..."
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-2">
        <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {availableCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.visibility} onValueChange={(value) => updateFilter("visibility", value)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="private">Private</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearAllFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Selected Tags */}
      {filters.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {filters.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="cursor-pointer">
              {tag}
              <X className="h-3 w-3 ml-1" onClick={() => removeTag(tag)} />
            </Badge>
          ))}
        </div>
      )}

      {/* Available Tags */}
      {availableTags.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-gray-600">Available tags:</p>
          <div className="flex flex-wrap gap-1">
            {availableTags
              .filter((tag) => !filters.tags.includes(tag))
              .slice(0, 10)
              .map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => addTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
