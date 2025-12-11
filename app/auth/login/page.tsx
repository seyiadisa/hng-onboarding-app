"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

export default function LoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  })

  // Helper to clear specific field error
  const clearError = (field: keyof typeof fieldErrors) => {
    setFieldErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    // Clear error immediately on type
    if (fieldErrors.email) clearError("email")
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    // Only clear error if password is at least 6 chars
    if (fieldErrors.password && value.length >= 6) {
      clearError("password")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setFieldErrors({ email: "", password: "" })

    const errors: any = {}
    if (!email.trim()) errors.email = "Email is required"
    if (!password.trim()) {
      errors.password = "Password is required"
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setLoading(false)
      return
    }

    try {
      await signIn(email, password)
      toast.success("Signed in successfully!")

      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err: any) {
      toast.error(err.message || "Invalid email or password")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/5 to-accent/5 px-4">
      <Toaster />
      <Card className="w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
        <p className="text-center text-gray-600 mb-8">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={handleEmailChange}
              className={fieldErrors.email ? "border-red-500 focus-visible:ring-grey-100" : ""}
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-sm">{fieldErrors.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <PasswordInput
              label="Password"
              placeholder="Your password"
              value={password}
              onChange={handlePasswordChange}
              className={fieldErrors.password ? "border-red-500 focus-visible:ring-grey-100" : ""}
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-sm">{fieldErrors.password}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link href="/auth/register" className=" font-semibold hover:underline text-gray-600">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  )
}