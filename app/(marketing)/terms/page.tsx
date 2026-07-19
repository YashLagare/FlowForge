export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-8 py-24 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>
          Please read these terms and conditions carefully before using our service.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
        <p>
          By accessing or using FlowForge, you agree to be bound by these Terms. If you disagree
          with any part of the terms, you may not access the service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Subscriptions and Billing</h2>
        <p>
          Some parts of the Service are billed on a subscription basis. You will be billed in advance
          on a recurring and periodic basis (such as monthly or annually), depending on the type of
          subscription plan you select.
        </p>
        
        {/* Placeholder professional content */}
        <div className="p-4 mt-8 bg-muted rounded-lg text-muted-foreground text-sm">
          This is a placeholder for your official Terms & Conditions. Please consult with legal counsel
          to ensure this document covers your specific business operations.
        </div>
      </div>
    </div>
  )
}
