import { PageHeader } from "@/components/ui/PageHeader";
import { ContactForm } from "@/components/ui/ContactForm";
import { FadeIn } from "@/components/ui/FadeIn";

export const metadata = {
  title: "Contact | Pavan Jillella",
  description: "Get in touch with Pavan Jillella.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        label="Contact"
        title="Let's connect."
        description="Have a question, want to collaborate, or just want to say hi? Drop me a message."
      />

      <section className="px-6 pb-20">
        <div className="max-w-lg mx-auto">
          <FadeIn>
            <ContactForm />
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="mt-10 text-center">
              <p className="font-body text-sm text-white/30 mb-4">Or find me on</p>
              <div className="flex items-center justify-center gap-3">
                <a
                  href="https://github.com/pavanjillella"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card px-4 py-2 rounded-full font-mono text-xs text-white/40 hover:text-white transition-all hover:border-white/15"
                >
                  GitHub
                </a>
                <a
                  href="https://linkedin.com/in/pavanjillella"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card px-4 py-2 rounded-full font-mono text-xs text-white/40 hover:text-white transition-all hover:border-white/15"
                >
                  LinkedIn
                </a>
                <a
                  href="https://youtube.com/@pavanjillella"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card px-4 py-2 rounded-full font-mono text-xs text-white/40 hover:text-white transition-all hover:border-white/15"
                >
                  YouTube
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
