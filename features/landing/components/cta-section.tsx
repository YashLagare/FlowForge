import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="py-24 md:py-32 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      <div className="container mx-auto px-4 sm:px-8 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to automate your workflows?</h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl">
            Join thousands of modern teams building logic visually. Start for free today and upgrade as you grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button size="lg" variant="secondary" className="px-8 h-12 text-base" asChild>
              <Link href="/sign-up">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 h-12 text-base bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10 text-primary-foreground" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
