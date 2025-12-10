"use client"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"

export default function SettingsPage() {
  const { user } = useAuth()

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Settings</h1>
        <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8">Manage your account and preferences</p>

        {/* Account */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
              <Avatar size="lg" initials={user?.name?.substring(0, 2).toUpperCase() || "U"} />
              <div>
                <h3 className="font-bold text-lg">{user?.name}</h3>
                <p className="text-gray-600 break-all">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="flex items-center gap-3 cursor-pointer p-2 md:p-0 active:bg-gray-50 rounded-lg md:rounded-none">
                <input type="checkbox" defaultChecked className="w-5 h-5 md:w-4 md:h-4" />
                <span className="text-sm md:text-base">Email notifications</span>
              </label>
            </div>
            <div>
              <label className="flex items-center gap-3 cursor-pointer p-2 md:p-0 active:bg-gray-50 rounded-lg md:rounded-none">
                <input type="checkbox" defaultChecked className="w-5 h-5 md:w-4 md:h-4" />
                <span className="text-sm md:text-base">Newsletter</span>
              </label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}