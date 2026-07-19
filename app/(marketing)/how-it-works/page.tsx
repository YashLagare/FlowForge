export default function LearnMorePage() {
  return (
    <div className="container mx-auto px-4 sm:px-8 py-24 max-w-4xl">
      <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8">
        Getting Started Guide
      </div>
      <h1 className="text-4xl md:text-5xl font-bold mb-8">How to Use FlowForge</h1>
      <p className="text-xl text-muted-foreground mb-12">
        A step-by-step guide to building your first AI-powered visual workflow.
      </p>

      <div className="space-y-16">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-shrink-0 h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">
            1
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Create a New Workflow</h2>
            <p className="text-muted-foreground leading-relaxed">
              Navigate to your dashboard and click "New Workflow". You'll be presented with an infinite canvas and a default "Start" trigger node. This is the entry point for your logic.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-shrink-0 h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">
            2
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Drag and Drop Nodes</h2>
            <p className="text-muted-foreground leading-relaxed">
              Open the right sidebar to access the node palette. You can drag and drop Action nodes, AI Agent nodes, and more directly onto the canvas. Connect them by dragging from the output handle of one node to the input handle of another.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-shrink-0 h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">
            3
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Configure AI Agents (Pro)</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you're on the Pro plan, you can utilize the AI Agent Node. Click on the node to open its properties in the right sidebar. Here you can define the system prompt, input variables, and the specific LLM model you want to use to process your data dynamically.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-shrink-0 h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">
            4
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Execute and Replay</h2>
            <p className="text-muted-foreground leading-relaxed">
              Click the "Run" button in the top right corner. The workflow will execute instantly. You can then view the Execution History to replay exactly how the data flowed through each node, making debugging a breeze.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
