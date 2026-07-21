import { siteConfig } from "@/config/site"
import { WorkflowIcon } from "lucide-react"
import Link from "next/link"
import { ScrollToTop } from "./scroll-to-top"

export function Footer() {
  return (
    <footer className="border-t py-12 md:py-16 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-8 flex flex-col md:flex-row justify-between gap-8">
        <div className="flex flex-col gap-4 max-w-sm">
          <Link href="/" className="flex items-center space-x-2">
            <WorkflowIcon className="h-6 w-6 text-primary" />
            <span className="font-bold inline-block">{siteConfig.name}</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            {siteConfig.description}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-sm tracking-wider uppercase text-foreground">Navigation</h3>
          <Link href="/" onClick={ScrollToTop} className="text-sm text-muted-foreground hover:text-foreground">Home</Link>
          <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground">Features</Link>
          <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-sm tracking-wider uppercase text-foreground">Legal</h3>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms & Conditions</Link>
          <Link href="/refund" className="text-sm text-muted-foreground hover:text-foreground">Refund Policy</Link>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-sm tracking-wider uppercase text-foreground">Contact & Developer</h3>
          <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground">GitHub</a>
          <a href={siteConfig.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground">LinkedIn</a>
          <a href={siteConfig.links.instagram} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground">Instagram</a>
          <a href={`mailto:${siteConfig.supportEmail}`} className="text-sm text-muted-foreground hover:text-foreground">Support</a>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-8 mt-12 pt-8 border-t border-border">
        <p className="text-sm text-muted-foreground text-center">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
