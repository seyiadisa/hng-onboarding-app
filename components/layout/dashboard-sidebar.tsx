// components/layout/dashboard-sidebar.tsx
"use client"

import Link from "next/link"

export function DashboardSidebar() {
  return (
    <aside className="w-64 bg-white border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold text-gray-800">TourWidget</h2>
        <p className="text-xs text-gray-500 mt-1">Dashboard</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-6 space-y-2">
        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-100">
          Tours
        </Link>
        <Link href="/dashboard/analytics" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500">
          Analytics
        </Link>
        <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500">
          Settings
        </Link>
      </nav>

      {/* Footer placeholder */}
      <div className="p-6 border-t border-border">
        <div className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10 mb-3" />
        <p className="text-sm font-medium">DashboardSidebar</p>
        <p className="text-xs text-gray-500">Real component coming soon</p>
      </div>
    </aside>
  )
}