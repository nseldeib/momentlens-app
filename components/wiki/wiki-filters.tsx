"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, X, Search, Tag } from "lucide-react"
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
  const [tagPopoverOpen, setTagPopoverOpen] = useState(false)

  const updateFilters = (updates: Partial<WikiFiltersState>) => {
    onFiltersChange({ ...filters, ...updates })
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

  const removeTag = (tagToRemove: string) => {
    updateFilters({
      tags: filters.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const addTag = (tagToAdd: string) => {
    if (!filters.tags.includes(tagToAdd)) {
      updateFilters({
        tags: [...filters.tags, tagToAdd],
      })
    }
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
        <Popover open={tagPopoverOpen} onOpenChange={setTagPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-10 bg-transparent">
              <Tag className="h-4 w-4 mr-2" />
              Tags
              {filters.tags.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                  {filters.tags.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search tags..." />
              <CommandList>
                <CommandEmpty>No tags found.</CommandEmpty>
                <CommandGroup>
                  {availableTags.map((tag) => (
                    <CommandItem
                      key={tag}
                      onSelect={() => {
                        if (filters.tags.includes(tag)) {
                          removeTag(tag)
                        } else {
                          addTag(tag)
                        }
                      }}
                    >
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
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-10">
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: {filters.search}
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilters({ search: "" })} />
            </Badge>
          )}
          {filters.category && filters.category !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Category: {filters.category}
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilters({ category: "all" })} />
            </Badge>
          )}
          {filters.status && filters.status !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Status: {filters.status}
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilters({ status: "all" })} />
            </Badge>
          )}
          {filters.visibility && filters.visibility !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Visibility: {filters.visibility}
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilters({ visibility: "all" })} />
            </Badge>
          )}
          {filters.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              Tag: {tag}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
