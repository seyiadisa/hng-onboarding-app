"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { PasswordInput } from "@/components/ui/password-input"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

export default function RegisterPage() {
  const router = useRouter()
  const { signUp } = useAuth()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
  })

  // Helper to clear specific field error
  const clearError = (field: keyof typeof fieldErrors) => {
    setFieldErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setName(value)
    if (fieldErrors.name) clearError("name")
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
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
    setFieldErrors({ name: "", email: "", password: "" })

    const errors: any = {}
    if (!name.trim()) errors.name = "Full name is required"
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
      await signUp(email, password, name)
      toast.success("Account created successfully!", { duration: 2000 })

      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
    } catch (err: any) {
      toast.error(err.message || "Registration failed. Please try again.", { duration: 4000 })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 px-4">
      <Toaster />
      <Card className="w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center ">Create Account <br /> <span className="text-[15px] font-light">TourWidget Account</span></h1>
        <p className="text-center text-gray-600 mb-8">Start your free trial today</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Your name"
              value={name}
              onChange={handleNameChange}
              className={fieldErrors.name ? "border-red-500 focus-visible:ring-grey-100" : ""}
            />
            {fieldErrors.name && (
              <p className="text-red-500 text-sm">{fieldErrors.name}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
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
              id="password"
              label="Password"
              placeholder="Create a password"
              value={password}
              onChange={handlePasswordChange}
              className={fieldErrors.password ? "border-red-500 focus-visible:ring-grey-100" : ""}
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-sm">{fieldErrors.password}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className=" font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  )
}