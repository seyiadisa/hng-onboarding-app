"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("demo@tourwidget.com")
  const [password, setPassword] = useState("password")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(email, password)
      router.push("/dashboard")
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 px-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
        <p className="text-center text-gray-600 mb-8">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" variant="primary" className="w-full" loading={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link href="/auth/register" className="text-accent font-semibold hover:underline">
            Sign up
          </Link>
        </p>

        <div className="mt-6 pt-6 border-t border-border text-xs text-center text-gray-500">
          Demo credentials:
          <br />
          Email: demo@tourwidget.com
          <br />
          Password: password
        </div>
      </Card>
    </div>
  )
}
