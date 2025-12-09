"use client"

import type React from "react"
import { useEffect, useState } from "react"     // ← Fixed: removed wrong curly braces
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push("/auth/login")
    }
  }, [mounted, loading, user, router])

  if (!mounted || loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-card-bg">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  )
}