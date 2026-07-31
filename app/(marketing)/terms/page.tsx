export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-8 py-24 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
      </p>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-8 text-foreground/90 leading-relaxed">
        <p>
          Welcome to <strong>FlowForge</strong> ("Platform", "we", "us", or "our"). By accessing or using our website, visual workflow builder, API services, and browser automation features (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms").
        </p>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">1. Acceptance of Terms</h2>
          <p>
            By creating an account, accessing, or using FlowForge, you confirm that you are at least 18 years old (or the legal age of majority in your jurisdiction) and have the legal authority to enter into these Terms on behalf of yourself or your organization. If you do not agree to these Terms, you may not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">2. Description of Service</h2>
          <p>
            FlowForge provides a cloud-hosted, collaborative visual workflow automation platform. Users can design node-based automations, execute headless browser sessions, extract web content, integrate third-party tools (such as Google Sheets), and schedule background tasks.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">3. User Accounts & Organization Security</h2>
          <p className="mb-3">
            To access certain features, you must register for an account and create or join an Organization. Authentication is securely managed via our auth provider (Clerk).
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
            <li>You are fully responsible for all activities that occur under your account and organization workspace.</li>
            <li>You must immediately notify us at <a href="mailto:yashlagare77@gmail.com" className="text-primary hover:underline font-medium">yashlagare77@gmail.com</a> of any unauthorized use or security breach.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">4. Subscriptions, Fees & Billing</h2>
          <p className="mb-3">
            FlowForge offers both Free and paid Subscription Plans (such as Pro).
          </p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li><strong>Billing Cycle:</strong> Paid subscriptions are billed in advance on a recurring periodic basis (monthly or annually).</li>
            <li><strong>Automatic Renewal:</strong> Unless cancelled prior to your billing date, your subscription will automatically renew under the same terms.</li>
            <li><strong>Plan Limitations:</strong> Free plans are subject to workflow execution caps (max 2 active workflows) and restricted node access. Pro features are strictly governed by active seat subscriptions.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">5. Acceptable Use Policy</h2>
          <p className="mb-3">
            You agree to use FlowForge strictly for lawful purposes. You agree <strong>NOT</strong> to:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>Use the Service to bypass authentication systems, launch DDoS attacks, or scrape web targets in violation of applicable laws or third-party Terms of Service.</li>
            <li>Distribute malware, spam, phishing schemes, or execute unauthorized automated actions.</li>
            <li>Attempt to reverse-engineer, decompile, or overload our execution infrastructure.</li>
          </ul>
          <p className="mt-3">
            We reserve the right to suspend or terminate accounts that violate our Acceptable Use Policy without prior notice.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">6. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, FlowForge shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, data, or goodwill resulting from your use or inability to use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">7. Termination</h2>
          <p>
            You may terminate your account at any time via your account settings or by contacting support. Upon termination, your right to use the Service will immediately cease, and stored workflow graphs may be permanently deleted.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">8. Contact Us</h2>
          <p>
            If you have any questions or concerns regarding these Terms of Service, please reach out to our team at:
          </p>
          <div className="p-4 mt-3 bg-muted/50 border border-border rounded-lg">
            <p className="font-semibold">FlowForge Support</p>
            <p className="text-muted-foreground">Email: <a href="mailto:yashlagare77@gmail.com" className="text-primary hover:underline">yashlagare77@gmail.com</a></p>
          </div>
        </section>
      </div>
    </div>
  )
}

