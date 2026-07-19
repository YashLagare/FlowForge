export default function RefundPage() {
  return (
    <div className="container mx-auto px-4 sm:px-8 py-24 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>
          We want you to be completely satisfied with FlowForge. If you are not entirely satisfied with
          your purchase, we're here to help.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Subscriptions</h2>
        <p>
          If you are unsatisfied with your Pro subscription, you can request a full refund within the first 14 days
          of your initial purchase. After 14 days, subscriptions are non-refundable, but you can cancel at any time 
          to prevent future charges.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. How to Request a Refund</h2>
        <p>
          To request a refund, please contact our support team from the email address associated with your account.
          Refunds are typically processed within 5-10 business days.
        </p>
        
        {/* Placeholder professional content */}
        <div className="p-4 mt-8 bg-muted rounded-lg text-muted-foreground text-sm">
          This is a placeholder for your official Refund Policy.
        </div>
      </div>
    </div>
  )
}
