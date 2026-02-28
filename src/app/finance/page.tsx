import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { FadeIn } from "@/components/ui/FadeIn";

const principles = [
  {
    title: "Pay Yourself First",
    description: "Automate savings before spending. The money you don't see is the money you don't miss.",
  },
  {
    title: "Index Over Everything",
    description: "Low-cost, broad-market index funds outperform 90% of active managers over time. Keep it simple.",
  },
  {
    title: "Live Below Your Means",
    description: "The gap between income and expenses is the most powerful wealth-building tool.",
  },
  {
    title: "Time in Market > Timing",
    description: "Consistency beats cleverness. Regular contributions compound; market timing doesn't work.",
  },
];

const allocation = [
  { label: "US Total Market (VTSAX)", percentage: 60, color: "bg-blue-500" },
  { label: "International (VXUS)", percentage: 20, color: "bg-cyan-500" },
  { label: "Bonds (BND)", percentage: 10, color: "bg-emerald-500" },
  { label: "REITs (VNQ)", percentage: 10, color: "bg-purple-500" },
];

const metrics = [
  { label: "Savings Rate Target", value: "50%+" },
  { label: "Annual Contributions", value: "Maxed" },
  { label: "FIRE Number", value: "25x Expenses" },
  { label: "Withdrawal Rate", value: "3.5%" },
];

export const metadata = {
  title: "Finance | Pavan Jillella",
  description: "FIRE journey, investment philosophy, and financial independence approach.",
};

export default function FinancePage() {
  return (
    <>
      <PageHeader
        label="Finance"
        title="Building financial freedom."
        description="My approach to FIRE (Financial Independence, Retire Early), investing, and thoughtful wealth building."
      />

      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto space-y-20">
          {/* Core Principles */}
          <div>
            <FadeIn>
              <h2 className="font-display font-bold text-2xl text-white mb-8">Investment Principles</h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {principles.map((p, i) => (
                <FadeIn key={p.title} delay={i * 0.05}>
                  <div className="glass-card rounded-2xl p-6 h-full">
                    <h3 className="font-display font-semibold text-white mb-2">{p.title}</h3>
                    <p className="font-body text-sm text-white/40">{p.description}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Target Allocation */}
          <div>
            <FadeIn>
              <h2 className="font-display font-bold text-2xl text-white mb-8">Target Allocation</h2>
            </FadeIn>
            <FadeIn delay={0.05}>
              <div className="glass-card rounded-3xl p-8">
                <div className="flex rounded-full overflow-hidden h-4 mb-6">
                  {allocation.map((a) => (
                    <div
                      key={a.label}
                      className={`${a.color} h-full`}
                      style={{ width: `${a.percentage}%` }}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {allocation.map((a) => (
                    <div key={a.label} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${a.color}`} />
                      <div>
                        <p className="font-body text-xs text-white/60">{a.label}</p>
                        <p className="font-mono text-sm text-white">{a.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>

          {/* FIRE Metrics */}
          <div>
            <FadeIn>
              <h2 className="font-display font-bold text-2xl text-white mb-8">FIRE Metrics</h2>
            </FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {metrics.map((m, i) => (
                <FadeIn key={m.label} delay={i * 0.05}>
                  <div className="glass-card rounded-2xl p-6 text-center">
                    <p className="font-mono text-xs text-white/30 uppercase tracking-widest mb-2">{m.label}</p>
                    <p className="font-display font-bold text-2xl text-white">{m.value}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Philosophy */}
          <FadeIn>
            <div className="glass-card rounded-3xl p-8 md:p-10">
              <h2 className="font-display font-bold text-2xl text-white mb-6">Philosophy</h2>
              <div className="space-y-4 font-body text-white/50 leading-relaxed">
                <p>
                  FIRE isn&apos;t about deprivation — it&apos;s about intentionality. Every dollar is a vote
                  for the life you want to build. I choose to optimize for freedom, not consumption.
                </p>
                <p>
                  The journey itself is valuable. The discipline of high savings rates, continuous learning
                  about markets, and building automated financial systems are skills that compound regardless
                  of whether you &quot;retire early&quot; or not.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Budget Tracker CTA */}
          <FadeIn>
            <Link href="/finance/tracker">
              <div className="glass-card rounded-3xl p-8 md:p-10 group cursor-pointer hover:border-blue-500/20 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-xs text-blue-400 uppercase tracking-widest mb-2">Tool</p>
                    <h2 className="font-display font-bold text-2xl text-white mb-2 group-hover:text-blue-300 transition-colors">
                      Budget Tracker
                    </h2>
                    <p className="font-body text-sm text-white/40 max-w-lg">
                      Track spending, set budgets, monitor savings goals, and get smart recommendations. All data stays in your browser.
                    </p>
                  </div>
                  <span className="text-white/20 group-hover:text-blue-400 text-3xl transition-colors shrink-0 ml-6">
                    →
                  </span>
                </div>
              </div>
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
