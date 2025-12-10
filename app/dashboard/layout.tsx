"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { Toaster } from "@/components/ui/sonner"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [hasMounted, setHasMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (hasMounted && !authLoading && !user) {
      router.replace("/auth/login")
    }
  }, [hasMounted, authLoading, user, router])

  if (!hasMounted || authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-card-bg overflow-hidden">
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <div className="hidden lg:block h-full">
        <DashboardSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Sidebar */}
          <div className="absolute left-0 top-0 bottom-0 w-3/4 max-w-xs bg-white shadow-xl animate-in slide-in-from-left duration-200">
            <DashboardSidebar onClose={() => setIsMobileMenuOpen(false)} className="w-full" />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 border-b bg-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
                <Image
                    src="/widgetlogo.jpeg"
                    alt="Widget Logo"
                    width={24}
                    height={24}
                    className="rounded-sm object-contain"
                />
                <span className="font-bold text-lg">TourWidget</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="h-6 w-6" />
            </Button>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
            {children}
        </div>
      </div>
      <Toaster />
    </div>
  )
}