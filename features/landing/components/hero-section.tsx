import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-32 md:pt-32 md:pb-40">
      <div className="container mx-auto px-4 sm:px-8 relative z-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8">
          🚀 FlowForge Pro is now available
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mb-6">
          Build AI-Powered Workflows <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
            Visually & Instantly
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
          Build powerful browser automations with an intuitive drag-and-drop workflow editor. Collaborate in real time, integrate AI-powered automation, and execute durable background workflows—all without writing a single line of code.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button size="lg" asChild className="gap-2 h-12 px-8 text-base">
            <Link href="/sign-in">
              Get Started Free <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
      </div>
    </section>
  )
}
