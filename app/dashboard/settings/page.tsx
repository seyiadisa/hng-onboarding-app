"use client"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"

export default function SettingsPage() {
  const { user } = useAuth()

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600 mb-8">Manage your account and preferences</p>

        {/* Account */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar size="lg" initials={user?.name?.substring(0, 2).toUpperCase() || "U"} />
              <div>
                <h3 className="font-bold text-lg">{user?.name}</h3>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span>Email notifications</span>
              </label>
            </div>
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span>Newsletter</span>
              </label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
