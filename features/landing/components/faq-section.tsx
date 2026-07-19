import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is FlowForge?",
    answer: "FlowForge is a visual node-based workflow builder that allows you to automate tasks, build logic, and integrate AI agents without writing code.",
  },
  {
    question: "Do I need to know how to code?",
    answer: "Not at all. FlowForge is designed to be intuitive and visual. You simply drag and drop nodes and connect them to build your workflows.",
  },
  {
    question: "What are AI Agent Nodes?",
    answer: "AI Agent Nodes are special powerful nodes available on our Pro plan. They use Large Language Models to process unstructured text, make decisions, or generate content dynamically during your workflow execution.",
  },
  {
    question: "How does the browser automation run?",
    answer: "Your workflows are executed asynchronously in the background using our robust cloud infrastructure. You don't need to keep your browser tab open—we handle timeouts, retries, and complex browser orchestration for you.",
  },
  {
    question: "Can I see what happened during an execution?",
    answer: "Yes! We provide full execution session replays. You can watch a video recording of the headless browser executing your workflow to easily debug and verify your automation steps.",
  },
  {
    question: "How do team workspaces function?",
    answer: "You can create an Organization and invite your team members with specific roles. All workflows belong to the workspace, ensuring your entire team can securely access and collaborate on the same automations.",
  },
  {
    question: "How does the pricing work?",
    answer: "We offer a Free plan for individuals and a Pro plan for organizations at $19/month per seat (billed annually). The Pro plan unlocks AI Agents, execution replays, and multiplayer collaboration.",
  },
  {
    question: "Can my team collaborate in real-time?",
    answer: "Yes! On the Pro plan, multiple team members can view and edit the same workflow simultaneously, similar to Figma or Google Docs.",
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-8 max-w-4xl">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about the product and billing.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg font-medium">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
