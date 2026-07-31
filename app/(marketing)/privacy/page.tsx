export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 sm:px-8 py-24 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
      </p>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-8 text-foreground/90 leading-relaxed">
        <p>
          At <strong>FlowForge</strong> ("we", "us", or "our"), respecting and protecting your privacy is our top priority. This Privacy Policy outlines how we collect, use, store, and safeguard your personal information when you use our website, application, visual workflow builder, and browser automation services.
        </p>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">1. Information We Collect</h2>
          <p className="mb-3">
            We collect information necessary to provide and optimize our automation platform:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li><strong>Account Information:</strong> When you sign up, authentication is handled securely via Clerk. We store basic profile information such as your name, email address, avatar, and active organization membership.</li>
            <li><strong>Workflow Graph State:</strong> Visual workflow nodes, configurations, and connections are stored in our serverless Neon database to enable saved states and real-time collaboration.</li>
            <li><strong>Encrypted Integration Credentials:</strong> Third-party credentials (such as Google Service Accounts) are encrypted at rest using industry-standard <strong>AES-256-CBC</strong> encryption. They are decrypted exclusively at runtime to execute your requested integrations.</li>
            <li><strong>Usage & Execution Logs:</strong> We collect non-sensitive execution metadata (run step status, execution duration, error logs) to display status updates on your dashboard.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">2. How We Use Your Information</h2>
          <p className="mb-3">
            Your data is used strictly to operate, maintain, and improve FlowForge:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>To execute your automated workflows on background worker infrastructure.</li>
            <li>To enable real-time multiplayer co-editing via Liveblocks WebSockets.</li>
            <li>To process subscription payments and manage organization memberships.</li>
            <li>To send transactional notifications (e.g., account updates, workflow failure alerts).</li>
            <li>To monitor platform stability, detect bugs, and track performance using Sentry.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">3. Data Security & Storage</h2>
          <p>
            We implement robust technical and organizational security measures to protect your data against unauthorized access, loss, or misuse:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
            <li>All HTTP traffic is encrypted using standard TLS/SSL (HTTPS).</li>
            <li>Database connections use secure connection pooling managed by Neon Serverless Postgres.</li>
            <li>Sensitive integration secrets are stored in AES-256-CBC encrypted format using dedicated server-side encryption keys.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">4. Third-Party Service Providers</h2>
          <p className="mb-3">
            We partner with reliable third-party infrastructure providers to run our service:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>Clerk:</strong> User authentication, organization, and session management.</li>
            <li><strong>Neon:</strong> Serverless PostgreSQL database hosting.</li>
            <li><strong>Trigger.dev:</strong> Asynchronous background task execution engine.</li>
            <li><strong>Liveblocks:</strong> Real-time multiplayer synchronization and presence.</li>
            <li><strong>Browserbase:</strong> Cloud headless browser orchestration and session replays.</li>
            <li><strong>Resend:</strong> Transactional email delivery.</li>
            <li><strong>Sentry:</strong> Application performance and crash monitoring.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">5. Your Data Rights & Choices</h2>
          <p className="mb-3">
            Depending on your location (e.g., under GDPR or CCPA), you have the right to:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Access, export, or correct the personal data linked to your account.</li>
            <li>Delete your account and associated organization workflows.</li>
            <li>Opt out of marketing communications at any time.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">6. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or wish to exercise your privacy rights, please contact us at:
          </p>
          <div className="p-4 mt-3 bg-muted/50 border border-border rounded-lg">
            <p className="font-semibold">FlowForge Privacy Officer</p>
            <p className="text-muted-foreground">Email: <a href="mailto:yashlagare77@gmail.com" className="text-primary hover:underline">yashlagare77@gmail.com</a></p>
          </div>
        </section>
      </div>
    </div>
  )
}

