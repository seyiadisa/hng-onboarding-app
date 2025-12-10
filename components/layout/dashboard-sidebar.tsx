"use client"

import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
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
import Image from "next/image"

export function DashboardSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/auth/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const menuItems = [
    { label: "Tours", href: "/dashboard", icon: "🎯" },
    { label: "Analytics", href: "/dashboard/analytics", icon: "📊" },
    { label: "Settings", href: "/dashboard/settings", icon: "⚙️" },
  ]

  return (
    <aside className="w-64 bg-white border-r border-border flex flex-col min-h-screen">
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/widgetlogo.jpeg"
            alt="Widget Logo"
            width={30}
            height={30}
            className="rounded-sm object-contain"
          />
          <h2 className="text-xl font-bold gradient-text">TourWidget</h2>
        </Link>
        <p className="text-xs text-gray-500 mt-1">Dashboard</p>
      </div>

      <nav className="flex-1 p-6 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === item.href
                ? "bg-primary text-white"
                : "text-foreground hover:bg-gray-100"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t border-border space-y-4">
        <div className="flex items-center gap-3">
          <Avatar 
            initials={user?.name?.substring(0, 2).toUpperCase() || "U"} 
            size="sm" 
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>

        {/* Logout Confirmation Dialog */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="secondary" size="sm" className="w-full">
              Logout
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
              <AlertDialogDescription>
                You will be redirected to the login page.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                Yes, Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  )
}