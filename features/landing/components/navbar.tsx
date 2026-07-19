"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { WorkflowIcon } from "lucide-react"
import { useActiveSection } from "@/hooks/use-active-section"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()
  const activeSection = useActiveSection(["features", "how-it-works", "faq"])
  
  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "How it Works", href: "/#how-it-works" },
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
            {navLinks.map((link) => {
              const isSectionLink = link.href.startsWith("/#")
              const sectionId = isSectionLink ? link.href.split("#")[1] : ""
              // A link is active if its corresponding section is on screen, or if we are on that exact page route
              const isActive = (isSectionLink && activeSection === sectionId) || (!isSectionLink && pathname === link.href)

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative text-sm font-medium transition-colors hover:text-foreground/80 py-1",
                    isActive ? "text-foreground" : "text-foreground/60"
                  )}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-gradient-to-r from-orange-400 to-orange-600 rounded-full" />
                  )}
                </Link>
              )
            })}
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
