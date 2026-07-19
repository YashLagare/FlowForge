export default function LearnMorePage() {
  return (
    <div className="container mx-auto px-4 sm:px-8 py-24 max-w-4xl">
      <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8">
        Comprehensive User Guide
      </div>
      <h1 className="text-4xl md:text-5xl font-bold mb-8">How to Master FlowForge</h1>
      <p className="text-xl text-muted-foreground mb-16">
        A complete, step-by-step guide to setting up your team, building AI automations, and executing workflows like a pro.
      </p>

      {/* PHASE 1: TEAM & ORG */}
      <div className="mb-20">
        <h2 className="text-3xl font-extrabold border-b pb-4 mb-10 text-foreground">Phase 1: Team & Workspace Setup</h2>
        <div className="space-y-12">
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center text-xl font-bold">1</div>
            <div>
              <h3 className="text-2xl font-semibold mb-3">Create Your Organization</h3>
              <p className="text-muted-foreground leading-relaxed">
                When you first log in, you will be prompted to create an <strong>Organization</strong>. This acts as a secure, private workspace where all of your workflows, AI agents, and execution history will be stored.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center text-xl font-bold">2</div>
            <div>
              <h3 className="text-2xl font-semibold mb-3">Invite Team Members & Set Roles</h3>
              <p className="text-muted-foreground leading-relaxed">
                Automation is a team effort. Navigate to your Organization settings to send email invitations to your colleagues. You can assign granular roles (like <em>Admin</em> or <em>Member</em>) to ensure your data stays secure.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* PHASE 2: BUILDING */}
      <div className="mb-20">
        <h2 className="text-3xl font-extrabold border-b pb-4 mb-10 text-foreground">Phase 2: Building Visual Automations</h2>
        <div className="space-y-12">
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl font-bold">3</div>
            <div>
              <h3 className="text-2xl font-semibold mb-3">Start a New Workflow</h3>
              <p className="text-muted-foreground leading-relaxed">
                From your dashboard, click <strong>"New Workflow"</strong>. You will instantly be dropped into the infinite visual canvas. Every workflow begins with a default "Start" trigger node.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl font-bold">4</div>
            <div>
              <h3 className="text-2xl font-semibold mb-3">Drag & Drop Browser Actions</h3>
              <p className="text-muted-foreground leading-relaxed">
                Open the node palette to access our pre-built browser automation nodes. Drag elements like <em>"Navigate to URL"</em>, <em>"Click Element"</em>, or <em>"Extract Text"</em> directly onto the canvas. Connect them by dragging a line from one node to the next.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl font-bold">5</div>
            <div>
              <h3 className="text-2xl font-semibold mb-3">Configure Node Properties</h3>
              <p className="text-muted-foreground leading-relaxed">
                Select any node on the canvas to open the right-hand <strong>Properties Panel</strong>. Here you can define specific instructions for the browser—like which website to navigate to, or the specific text you want typed into a search bar.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* PHASE 3: ADVANCED CAPABILITIES */}
      <div className="mb-20">
        <h2 className="text-3xl font-extrabold border-b pb-4 mb-10 text-foreground">Phase 3: Advanced Pro Features</h2>
        <div className="space-y-12">
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center text-xl font-bold">6</div>
            <div>
              <h3 className="text-2xl font-semibold mb-3">Live Multiplayer Co-Editing</h3>
              <p className="text-muted-foreground leading-relaxed">
                If your team members open the same workflow, you will see their cursors moving in real-time. You can build, edit, and troubleshoot logic simultaneously, just like working together in Google Docs.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center text-xl font-bold">7</div>
            <div>
              <h3 className="text-2xl font-semibold mb-3">Inject Autonomous AI Agents</h3>
              <p className="text-muted-foreground leading-relaxed">
                Need the browser to make dynamic decisions? Drag an <strong>AI Agent Node</strong> into your flow. Connect extracted text into the AI node, write a custom prompt (e.g., <em>"Analyze this text and tell me if it is positive or negative"</em>), and the AI will make decisions on the fly.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* PHASE 4: EXECUTION */}
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold border-b pb-4 mb-10 text-foreground">Phase 4: Execution & Monitoring</h2>
        <div className="space-y-12">
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center text-xl font-bold">8</div>
            <div>
              <h3 className="text-2xl font-semibold mb-3">Execute in the Background</h3>
              <p className="text-muted-foreground leading-relaxed">
                Click the <strong>"Run Workflow"</strong> button. Your automation is immediately sent to our durable cloud engine. You can safely close the tab—our servers will handle the headless browser orchestration securely in the background.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center text-xl font-bold">9</div>
            <div>
              <h3 className="text-2xl font-semibold mb-3">Watch Video Session Replays</h3>
              <p className="text-muted-foreground leading-relaxed">
                Once a run completes, go to the <strong>Executions</strong> tab. You can click on any past run to watch a pixel-perfect <strong>Video Replay</strong>. You will see exactly what the robot saw and clicked on, making debugging incredibly simple!
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
