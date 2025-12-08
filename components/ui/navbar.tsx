"use client"

import type React from "react"
import Link from "next/link"

interface NavbarProps {
  logo?: React.ReactNode
  items?: Array<{
    label: string
    href: string
  }>
  actions?: React.ReactNode
}

export function Navbar({ logo, items, actions }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-border">
      <div className="container-responsive flex items-center justify-between h-16">
        {logo && <div className="font-bold text-xl text-primary">{logo}</div>}

        <div className="hidden md:flex items-center gap-8">
          {items?.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="text-sm font-medium text-foreground hover:text-accent transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">{actions}</div>
      </div>
    </nav>
  )
}
