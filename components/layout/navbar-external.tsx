"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function NavbarExternal() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-border">
      <div className="container-responsive flex items-center justify-between h-16">
        <Link href="/" className="text-2xl font-bold gradient-text">
          TourWidget
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-foreground hover:text-accent transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-foreground hover:text-accent transition-colors">
            About
          </Link>
          <Link href="/docs" className="text-foreground hover:text-accent transition-colors">
            Docs
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/auth/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button variant="primary" size="sm">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
