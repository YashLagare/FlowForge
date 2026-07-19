"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { WorkflowIcon } from "lucide-react"

export function Navbar() {
  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "How it Works", href: "/how-it-works" },
    { name: "Pricing", href: "/pricing" },
    { name: "FAQ", href: "/#faq" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <WorkflowIcon className="h-6 w-6 text-primary" />
            <span className="font-bold inline-block">{siteConfig.name}</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground/80"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-in">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
