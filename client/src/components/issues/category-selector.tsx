"use client"

import { useState } from "react"
import { ArrowRight, AlertCircle, CheckCircle, Shield, AlertTriangle, ExternalLink } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface Category {
  id: number
  name: string
  description: string
  icon?: "alert" | "check" | "shield" | "warning" | "none"
  externalLink?: boolean
}

interface CategorySelectorProps {
  categories: Category[]
  onChange: (category: Category) => void
  defaultSelected?: number
  className?: string
  loading?: boolean
}

export default function CategorySelector({
  categories,
  onChange,
  defaultSelected,
  className,
  loading = false,
}: CategorySelectorProps) {
  const [selectedId, setSelectedId] = useState<number | null>(defaultSelected || null)

  const handleCategoryClick = (category: Category) => {
    setSelectedId(category.id)
    onChange(category)
  }

  const getIconComponent = (iconType?: string) => {
    switch (iconType) {
      case "alert":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case "check":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "shield":
        return <Shield className="w-5 h-5 text-gray-500" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-orange-500" />
      default:
        return null
    }
  }

  // Add a skeleton loader using shadcn/ui Skeleton component
  const renderSkeletons = () => {
    return Array(8)
      .fill(0)
      .map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="flex items-start border-b last:border-b-0 p-4 border-gray-200 dark:border-gray-700"
        >
          <div className="flex-shrink-0 mt-1">
            <Skeleton className="w-5 h-5 rounded-full" />
          </div>

          <div className="ml-4 flex-grow">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>

          <div className="flex-shrink-0 ml-2">
            <Skeleton className="w-5 h-5" />
          </div>
        </div>
      ))
  }

  return (
    <div
      className={cn("w-full max-w-3xl mx-auto rounded-lg bg-background", className)}
    >
      {loading
        ? renderSkeletons()
        : categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className={cn(
                "flex items-start border-b last:border-b-0 p-2 pr-4 cursor-pointer",
                "border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700",
                "transition-colors duration-150",
                selectedId === category.id ? "bg-blue-50 dark:bg-gray-700" : ""
              )}
            >
              <div className="flex-shrink-0 mt-1">{getIconComponent(category.icon)}</div>

              <div className="ml-4 flex-grow">
                <h3 className="font-medium text-gray-900 dark:text-white">{category.name}</h3>
                {category.description && (
                  <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">{category.description}</p>
                )}
              </div>

              <div className="flex-shrink-0 ml-2">
                {category.externalLink ? (
                  <ExternalLink className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ArrowRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                )}
              </div>
            </div>
          ))}
    </div>
  )
}
