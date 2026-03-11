import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Pavan Jillella",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display font-bold text-3xl text-white mb-2">Terms of Service</h1>
        <p className="font-mono text-xs text-white/20 mb-10">Last updated: March 11, 2026</p>

        <div className="prose-custom space-y-8">
          <Section title="1. Acceptance of Terms">
            By accessing or using this platform (&quot;Service&quot;), you agree to be bound by these Terms of Service.
            If you do not agree, do not use the Service.
          </Section>

          <Section title="2. Description of Service">
            This platform provides personal productivity tools including education tracking, financial management,
            blog publishing, and project management features. The Service is provided &quot;as is&quot; and may change at
            any time.
          </Section>

          <Section title="3. User Accounts">
            You are responsible for maintaining the confidentiality of your account credentials. You must provide
            accurate information when creating an account. You may not use another person&apos;s account without permission.
          </Section>

          <Section title="4. User Content">
            You retain ownership of all content you create through the Service (notes, blog posts, financial data, etc.).
            By using the Service, you grant us a limited license to store, process, and display your content solely for
            the purpose of providing the Service to you.
          </Section>

          <Section title="5. Acceptable Use">
            You agree not to: use the Service for any illegal purpose; attempt to gain unauthorized access to any part
            of the Service; interfere with or disrupt the Service; upload malicious code or content; or use the Service
            to harass, abuse, or harm others.
          </Section>

          <Section title="6. Privacy">
            Your use of the Service is also governed by our{" "}
            <a href="/privacy" className="text-blue-400/60 hover:text-blue-400 underline transition-colors">
              Privacy Policy
            </a>
            , which describes how we collect, use, and protect your personal information.
          </Section>

          <Section title="7. Data Storage & Security">
            We use industry-standard security measures to protect your data. However, no method of electronic storage
            is 100% secure. We cannot guarantee absolute security of your data. You are responsible for maintaining
            backups of your important data.
          </Section>

          <Section title="8. Termination">
            We may terminate or suspend your access to the Service at any time, with or without notice, for conduct
            that violates these Terms. You may delete your account at any time through the Settings page.
          </Section>

          <Section title="9. Disclaimers">
            The Service is provided &quot;as is&quot; without warranties of any kind, either express or implied. We do not
            warrant that the Service will be uninterrupted, secure, or error-free. Financial tools and data provided
            are for informational purposes only and do not constitute financial advice.
          </Section>

          <Section title="10. Limitation of Liability">
            To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages resulting from your use of the Service.
          </Section>

          <Section title="11. Changes to Terms">
            We reserve the right to modify these Terms at any time. Changes will be effective upon posting. Your
            continued use of the Service after changes constitutes acceptance of the modified Terms.
          </Section>

          <Section title="12. Contact">
            If you have questions about these Terms, please use the contact form on our website.
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display font-semibold text-lg text-white mb-3">{title}</h2>
      <p className="font-body text-sm text-white/40 leading-relaxed">{children}</p>
    </div>
  );
}
