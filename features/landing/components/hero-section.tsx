import Link from "next/link"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { ArrowRight, PlayCircle, Zap, Bot, Shuffle, CheckCircle2 } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-24 md:pt-32 md:pb-32">
      {/* ambient glow, offset toward the visual rather than centered */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-10 -z-10 h-[520px] w-[520px] rounded-full bg-primary/15 blur-[120px]"
      />

      <div className="container relative mx-auto grid items-center gap-16 px-4 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        {/* Copy column */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 py-1 pl-2 pr-3 text-sm font-medium text-foreground">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            FlowForge Pro is live
          </div>

          <h1 className="max-w-xl text-4xl font-extrabold tracking-tight md:text-6xl lg:text-[3.4rem] lg:leading-[1.05]">
            Build AI workflows
            <br />
            <span className="bg-gradient-to-r from-primary to-muted-foreground bg-clip-text text-transparent">
              visually &amp; instantly
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg text-muted-foreground md:text-xl">
            {siteConfig.description} Connect nodes, add AI agents, and run powerful automations without writing a single line of code.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:items-start">
            <Button size="lg" asChild className="h-12 gap-2 px-8 text-base">
              <Link href="/sign-in">
                Get started free <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 gap-2 px-8 text-base">
              <Link href="/learn-more">
                <PlayCircle className="size-4" /> See how it works
              </Link>
            </Button>
          </div>
        </div>

        {/* Signature visual: a live workflow graph representing the actual product */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <svg
            viewBox="0 0 460 320"
            fill="none"
            className="w-full"
            role="img"
            aria-label="Diagram of a workflow connecting a trigger, an AI agent, a transform step, and an output"
          >
            <defs>
              <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.55" />
              </linearGradient>
            </defs>

            {/* connectors */}
            <path id="edgeA" d="M96 96 C150 96 150 60 208 60" stroke="url(#edge)" strokeWidth="2" />
            <path id="edgeB" d="M96 116 C150 116 150 220 208 220" stroke="url(#edge)" strokeWidth="2" />
            <path id="edgeC" d="M300 60 C350 60 350 140 384 140" stroke="url(#edge)" strokeWidth="2" />
            <path id="edgeD" d="M300 220 C350 220 350 168 384 168" stroke="url(#edge)" strokeWidth="2" />

            {/* traveling data packets */}
            <circle r="3.5" fill="hsl(var(--primary))" className="motion-reduce:hidden">
              <animateMotion dur="2.6s" repeatCount="indefinite" begin="0s">
                <mpath href="#edgeA" />
              </animateMotion>
            </circle>
            <circle r="3.5" fill="hsl(var(--primary))" className="motion-reduce:hidden">
              <animateMotion dur="2.6s" repeatCount="indefinite" begin="0.6s">
                <mpath href="#edgeB" />
              </animateMotion>
            </circle>
            <circle r="3.5" fill="hsl(var(--primary))" className="motion-reduce:hidden">
              <animateMotion dur="2.2s" repeatCount="indefinite" begin="1.1s">
                <mpath href="#edgeC" />
              </animateMotion>
            </circle>
            <circle r="3.5" fill="hsl(var(--primary))" className="motion-reduce:hidden">
              <animateMotion dur="2.2s" repeatCount="indefinite" begin="1.5s">
                <mpath href="#edgeD" />
              </animateMotion>
            </circle>

            {/* Trigger node */}
            <g transform="translate(20 84)">
              <rect width="76" height="64" rx="14" className="fill-card stroke-border" strokeWidth="1.5" />
              <foreignObject x="10" y="10" width="56" height="44">
                <div className="flex h-full flex-col items-start justify-center gap-1">
                  <Zap className="size-4 text-muted-foreground" />
                  <span className="text-[10px] font-medium text-foreground">Trigger</span>
                </div>
              </foreignObject>
            </g>

            {/* AI Agent node — the one accent-color spend */}
            <g transform="translate(208 24)">
              <rect width="92" height="72" rx="16" className="fill-primary stroke-primary" strokeWidth="1.5" />
              <foreignObject x="12" y="10" width="70" height="52">
                <div className="flex h-full flex-col items-start justify-center gap-1">
                  <Bot className="size-4 text-primary-foreground" />
                  <span className="text-[10px] font-semibold text-primary-foreground">AI Agent</span>
                </div>
              </foreignObject>
            </g>

            {/* Transform node */}
            <g transform="translate(208 184)">
              <rect width="92" height="72" rx="16" className="fill-card stroke-border" strokeWidth="1.5" />
              <foreignObject x="12" y="10" width="70" height="52">
                <div className="flex h-full flex-col items-start justify-center gap-1">
                  <Shuffle className="size-4 text-muted-foreground" />
                  <span className="text-[10px] font-medium text-foreground">Transform</span>
                </div>
              </foreignObject>
            </g>

            {/* Output node */}
            <g transform="translate(388 120)">
              <rect width="56" height="64" rx="14" className="fill-card stroke-border" strokeWidth="1.5" />
              <foreignObject x="6" y="10" width="44" height="44">
                <div className="flex h-full flex-col items-start justify-center gap-1">
                  <CheckCircle2 className="size-4 text-muted-foreground" />
                  <span className="text-[10px] font-medium text-foreground">Output</span>
                </div>
              </foreignObject>
            </g>
          </svg>
        </div>
      </div>
    </section>
  )
}
