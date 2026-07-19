import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground">
            Start for free, upgrade when your organization needs more power.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="flex flex-col p-8 bg-card rounded-3xl border border-border shadow-sm">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <p className="text-muted-foreground mb-6">Perfect for individuals and small projects.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Unlimited basic workflows",
                "Standard nodes (Triggers, Actions)",
                "Community support",
                "Basic execution history",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" size="lg" className="w-full" asChild>
              <Link href="/sign-up">Get Started Free</Link>
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="flex flex-col p-8 bg-primary text-primary-foreground rounded-3xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div className="inline-flex max-w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-semibold mb-4">
              RECOMMENDED FOR ORGS
            </div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <p className="text-primary-foreground/80 mb-6">For organizations that need AI power and collaboration.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">$19</span>
              <span className="text-primary-foreground/80">/month per seat (billed annually)</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Everything in Free, plus:",
                "Powerful AI Agent Nodes",
                "Advanced Execution Replays",
                "Real-time multiplayer collaboration",
                "Organization-level billing & RBAC",
                "Priority support",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button variant="secondary" size="lg" className="w-full" asChild>
              <Link href="/sign-up">Upgrade to Pro</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
