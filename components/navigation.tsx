"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Clock, TrendingUp, BookOpen, Settings } from "lucide-react"

const navigation = [
  { name: "Capture", href: "/", icon: Home },
  { name: "Timeline", href: "/timeline", icon: Clock },
  { name: "Trends", href: "/trends", icon: TrendingUp },
  { name: "Prompts", href: "/prompts", icon: BookOpen },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around max-w-md mx-auto">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center p-2 rounded-xl transition-all duration-200",
                isActive ? "text-blue-600 bg-blue-50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
