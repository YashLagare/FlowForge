export default function RefundPage() {
  return (
    <div className="container mx-auto px-4 sm:px-8 py-24 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Refund & Cancellation Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
      </p>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-8 text-foreground/90 leading-relaxed">
        <p>
          At <strong>FlowForge</strong>, we want to ensure you have a transparent and seamless experience with our visual workflow automation platform. This Refund Policy outlines your rights and our guidelines regarding subscription billing, cancellations, and refunds.
        </p>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">1. 14-Day Money-Back Guarantee</h2>
          <p>
            We offer a <strong>14-day money-back guarantee</strong> on all initial paid subscriptions (such as our Pro plan). If you are not satisfied with FlowForge for any reason within the first 14 calendar days of your initial purchase, you are eligible for a full refund of your subscription fee.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">2. Subscription Cancellations</h2>
          <p className="mb-3">
            You may cancel your FlowForge subscription at any time:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>You can cancel directly through your account dashboard under Billing settings.</li>
            <li>Alternatively, send a cancellation request via email to <a href="mailto:yashlagare77@gmail.com" className="text-primary hover:underline font-medium">yashlagare77@gmail.com</a>.</li>
            <li>Once cancelled, your subscription will remain active until the end of your current paid billing period, and you will not be charged for future billing cycles.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">3. Non-Refundable Situations</h2>
          <p className="mb-3">
            Except as explicitly provided in Section 1 (14-day guarantee), payments are non-refundable. Specifically:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>Refund requests submitted after 14 days from the date of the initial subscription purchase.</li>
            <li>Partial-month or partial-year usage fees during an active billing cycle.</li>
            <li>Accounts suspended or terminated due to a violation of our Acceptable Use Policy or Terms of Service.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">4. How to Request a Refund</h2>
          <p className="mb-3">
            To request a refund under our 14-day guarantee, please follow these steps:
          </p>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li>Send an email to <a href="mailto:yashlagare77@gmail.com" className="text-primary hover:underline font-medium">yashlagare77@gmail.com</a> using the email address registered with your FlowForge account.</li>
            <li>Include your account name, Organization ID, and a brief description of your refund request.</li>
          </ol>
          <p className="mt-3">
            Approved refunds will be processed back to your original payment method within 5 to 10 business days, depending on your card issuer.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">5. Contact Information</h2>
          <p>
            For any billing questions, cancellation assistance, or refund inquiries, please contact:
          </p>
          <div className="p-4 mt-3 bg-muted/50 border border-border rounded-lg">
            <p className="font-semibold">FlowForge Billing Support</p>
            <p className="text-muted-foreground">Email: <a href="mailto:yashlagare77@gmail.com" className="text-primary hover:underline">yashlagare77@gmail.com</a></p>
          </div>
        </section>
      </div>
    </div>
  )
}

