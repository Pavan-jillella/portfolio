import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Pavan Jillella",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display font-bold text-3xl text-white mb-2">Privacy Policy</h1>
        <p className="font-mono text-xs text-white/20 mb-10">Last updated: March 11, 2026</p>

        <div className="prose-custom space-y-8">
          <Section title="1. Information We Collect">
            <strong className="text-white/50">Account Information:</strong> When you create an account, we collect your
            email address and name (from Google OAuth or manual entry).
            <br /><br />
            <strong className="text-white/50">User Content:</strong> Data you create within the platform — study sessions,
            notes, financial records, blog posts, projects, and uploaded files.
            <br /><br />
            <strong className="text-white/50">Usage Data:</strong> We collect anonymized analytics data including page
            views, feature usage, and performance metrics via PostHog and Vercel Analytics.
            <br /><br />
            <strong className="text-white/50">Cookies:</strong> We use essential cookies for authentication and session
            management. Analytics cookies are used for understanding usage patterns.
          </Section>

          <Section title="2. How We Use Your Information">
            We use your information to: provide and maintain the Service; authenticate your identity; sync your data
            across devices; send password reset emails when requested; improve the Service through anonymized analytics;
            and respond to support requests.
          </Section>

          <Section title="3. Data Storage">
            Your data is stored securely using Supabase (backed by PostgreSQL) with row-level security policies.
            Files are stored in Supabase Storage with access controls. All data is encrypted in transit (TLS) and
            at rest.
          </Section>

          <Section title="4. Data Sharing">
            We do not sell, trade, or share your personal data with third parties except: when required by law;
            with service providers necessary to operate the platform (Supabase, Vercel, PostHog — all with their
            own privacy policies); or with your explicit consent.
          </Section>

          <Section title="5. Your Rights (GDPR / CCPA)">
            You have the right to:
            <br /><br />
            &bull; <strong className="text-white/50">Access</strong> — View all data associated with your account<br />
            &bull; <strong className="text-white/50">Export</strong> — Download your data as JSON from Settings<br />
            &bull; <strong className="text-white/50">Rectify</strong> — Update or correct your personal information<br />
            &bull; <strong className="text-white/50">Delete</strong> — Delete your account and all associated data<br />
            &bull; <strong className="text-white/50">Portability</strong> — Export your data in a machine-readable format<br />
            &bull; <strong className="text-white/50">Withdraw Consent</strong> — Opt out of analytics tracking
          </Section>

          <Section title="6. Cookies">
            <strong className="text-white/50">Essential:</strong> Authentication session cookies (required for the Service to function).
            <br /><br />
            <strong className="text-white/50">Analytics:</strong> PostHog and Vercel Analytics cookies for understanding usage patterns.
            You can opt out of analytics cookies through the cookie consent banner.
          </Section>

          <Section title="7. Data Retention">
            We retain your data as long as your account is active. When you delete your account, all associated data
            is permanently deleted within 30 days. Anonymized analytics data may be retained indefinitely.
          </Section>

          <Section title="8. Security">
            We implement security measures including: encrypted data transmission (HTTPS/TLS); row-level security
            in the database; secure authentication via Supabase Auth; rate limiting on API endpoints; and regular
            security monitoring via Sentry.
          </Section>

          <Section title="9. Children&apos;s Privacy">
            The Service is not directed to children under 13. We do not knowingly collect personal information from
            children under 13. If you believe a child has provided us personal information, please contact us.
          </Section>

          <Section title="10. Changes to This Policy">
            We may update this Privacy Policy from time to time. We will notify you of material changes by posting
            the new policy on this page with an updated date.
          </Section>

          <Section title="11. Contact">
            For privacy-related inquiries, please use the contact form on our website.
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
      <div className="font-body text-sm text-white/40 leading-relaxed">{children}</div>
    </div>
  );
}
