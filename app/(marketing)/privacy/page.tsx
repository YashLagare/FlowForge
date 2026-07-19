export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 sm:px-8 py-24 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>
          At FlowForge, we take your privacy seriously. This Privacy Policy explains how we collect,
          use, disclose, and safeguard your information when you visit our website and use our service.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
        <p>
          We collect information that you provide directly to us when you register for an account,
          create or modify your profile, set preferences, sign-up for or make purchases through the
          Services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
        <p>
          We use the information we collect to provide, maintain, and improve our services, to
          process your transactions, and to communicate with you.
        </p>
        
        {/* Placeholder professional content */}
        <div className="p-4 mt-8 bg-muted rounded-lg text-muted-foreground text-sm">
          This is a placeholder for your official Privacy Policy. Please consult with legal counsel
          to ensure this document meets your specific regulatory requirements (e.g., GDPR, CCPA).
        </div>
      </div>
    </div>
  )
}
