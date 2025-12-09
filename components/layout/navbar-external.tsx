"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { Menu, X } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog"

export function NavbarExternal() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const [logoutModalOpen, setLogoutModalOpen] = useState(false)

  const confirmLogout = async () => {
  // Close modals immediately
  setLogoutModalOpen(false)
  setOpen(false)
  setMobileOpen(false)

  router.replace("/auth/login")
  signOut()
}

  const avatarLetter =
    user?.name
      ? user.name.trim().charAt(0).toUpperCase()
      : user?.email?.charAt(0).toUpperCase() || "U"

  return (
    <>
      {/* LOGOUT CONFIRMATION MODAL */}
      <Dialog open={logoutModalOpen} onOpenChange={setLogoutModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Are you sure you want to logout?</DialogTitle>
            <DialogDescription>
              You will be signed out immediately if you continue.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setLogoutModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmLogout}>
              Yes, Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="container-responsive flex items-center justify-between h-16">

          <Link href="/" className="text-2xl font-bold gradient-text">
            TourWidget
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/"
              className="text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-black/10 hover:text-black"
            >
              Home
            </Link>

            <Link 
              href="/about"
              className="text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-black/10 hover:text-black"
            >
              About
            </Link>

            <Link 
              href="/docs"
              className="text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-black/10 hover:text-black"
            >
              Docs
            </Link>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-2">
            {loading ? (
              <div className="h-9 w-24 skeleton rounded-lg" />
            ) : user ? (
              <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 rounded-full bg-primary/10 px-4 py-2 hover:bg-primary/20 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
                      {avatarLetter}
                    </div>
                    <span className="hidden sm:inline text-sm font-medium text-foreground">
                      {user.name || user.email}
                    </span>

                    <svg
                      className="w-4 h-4 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56 ">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard" className="cursor-pointer">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => setLogoutModalOpen(true)}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>

                <Link href="/auth/register">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-border px-6 py-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">

            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="block text-lg text-foreground px-2 rounded-lg hover:bg-black/10 hover:text-black"
            >
              Home
            </Link>

            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className="block text-lg text-foreground px-2 rounded-lg hover:bg-black/10 hover:text-black"
            >
              About
            </Link>

            <Link
              href="/docs"
              onClick={() => setMobileOpen(false)}
              className="block text-lg text-foreground px-2 rounded-lg hover:bg-black/10 hover:text-black"
            >
              Docs
            </Link>

            <div className="pt-2 border-t border-border">
              {loading ? (
                <div className="h-9 w-24 skeleton rounded-lg" />
              ) : user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
                      {avatarLetter}
                    </div>
                    <span className="text-lg font-medium">
                      {user.name || user.email}
                    </span>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="block text-foreground px-2 rounded-lg hover:bg-black/10 hover:text-black"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={() => setLogoutModalOpen(true)}
                    className="w-full text-left text-destructive font-medium px-2 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" className="w-full">
                      Sign In
                    </Button>
                  </Link>

                  <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}