import { 
  Bot, 
  MousePointer2, 
  Activity, 
  History, 
  ShieldCheck,
  Zap
} from "lucide-react"

const features = [
  {
    title: "Infinite Visual Canvas",
    description: "Architect complex logic effortlessly by dragging nodes and connecting edges on a high-performance, infinite workspace.",
    icon: MousePointer2,
  },
  {
    title: "Autonomous AI Agents",
    description: "Incorporate LLM-driven intelligence directly into your workflows to dynamically process text, categorize unstructured data, and make complex decisions on the fly.",
    icon: Bot,
  },
  {
    title: "Durable Background Execution",
    description: "Run your workflows instantly and reliably. Our resilient execution engine handles retries, timeouts, and long-running tasks without complex deployment pipelines.",
    icon: Zap,
  },
  {
    title: "Video Session Replays",
    description: "Never guess what went wrong. Watch pixel-perfect video recordings of your automated headless browser sessions to trace exactly how your workflow executed.",
    icon: History,
  },
  {
    title: "Live Multiplayer Co-Editing",
    description: "Built for teams. Real-time sync allows your entire organization to view, build, and edit workflows simultaneously—just like Google Docs or Figma.",
    icon: Activity,
  },
  {
    title: "Enterprise-Grade Security",
    description: "Multi-tenant organization workspaces, granular Role-Based Access Control (RBAC), and secure execution sandboxing ensure your data stays private and secure.",
    icon: ShieldCheck,
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Enterprise-Grade Features for Modern Teams</h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to automate complex business processes, packaged in an intuitive and highly collaborative interface.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="flex flex-col p-6 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
