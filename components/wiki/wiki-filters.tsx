"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronsUpDown, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

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
  const [tagComboOpen, setTagComboOpen] = useState(false)

  const updateFilters = (updates: Partial<WikiFiltersState>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const addTag = (tag: string) => {
    if (!filters.tags.includes(tag)) {
      updateFilters({ tags: [...filters.tags, tag] })
    }
    setTagComboOpen(false)
  }

  const removeTag = (tagToRemove: string) => {
    updateFilters({ tags: filters.tags.filter((tag) => tag !== tagToRemove) })
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
    filters.search ||
    filters.tags.length > 0 ||
    (filters.category && filters.category !== "all") ||
    (filters.status && filters.status !== "all") ||
    (filters.visibility && filters.visibility !== "all")

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search entries..."
          value={filters.search}
          onChange={(e) => updateFilters({ search: e.target.value })}
          className="pl-10"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-2">
        {/* Category Filter */}
        <Select value={filters.category} onValueChange={(value) => updateFilters({ category: value })}>
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

        {/* Status Filter */}
        <Select value={filters.status} onValueChange={(value) => updateFilters({ status: value })}>
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

        {/* Visibility Filter */}
        <Select value={filters.visibility} onValueChange={(value) => updateFilters({ visibility: value })}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="private">Private</SelectItem>
            <SelectItem value="public">Public</SelectItem>
          </SelectContent>
        </Select>

        {/* Tag Filter */}
        <Popover open={tagComboOpen} onOpenChange={setTagComboOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={tagComboOpen}
              className="w-[140px] justify-between bg-transparent"
            >
              Add Tag Filter
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search tags..." />
              <CommandList>
                <CommandEmpty>No tags found.</CommandEmpty>
                <CommandGroup>
                  {availableTags.map((tag) => (
                    <CommandItem key={tag} value={tag} onSelect={() => addTag(tag)}>
                      <Check className={cn("mr-2 h-4 w-4", filters.tags.includes(tag) ? "opacity-100" : "opacity-0")} />
                      {tag}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear All
          </Button>
        )}
      </div>

      {/* Active Tag Filters */}
      {filters.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {filters.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                aria-label={`Remove ${tag} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
