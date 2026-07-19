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
    title: "Visual Drag & Drop",
    description: "Build complex workflows simply by dragging nodes and connecting edges on an infinite canvas.",
    icon: MousePointer2,
  },
  {
    title: "AI Agent Node",
    description: "Incorporate powerful LLM-driven agents directly into your workflow to process text, categorize data, and make decisions.",
    icon: Bot,
  },
  {
    title: "Instant Execution",
    description: "Run your workflows instantly. No compilation time, no complicated deployment pipelines.",
    icon: Zap,
  },
  {
    title: "Execution Replays",
    description: "Monitor history and replay past executions to trace exactly how data flowed through your nodes.",
    icon: History,
  },
  {
    title: "Real-time Collaboration",
    description: "Team-ready architecture lets your entire organization build and edit workflows simultaneously.",
    icon: Activity,
  },
  {
    title: "Enterprise Security",
    description: "Role-based access control and organization-level sandboxing ensure your data stays secure.",
    icon: ShieldCheck,
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Modern Teams</h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to automate your business processes, accessible through an intuitive interface.
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
