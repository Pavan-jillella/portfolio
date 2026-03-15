"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { BentoGrid, bentoItem } from "@/components/bento/BentoGrid";

const cards = [
  {
    title: "Life Index",
    description: "Composite score across finance, learning, coding, and growth.",
    href: "/dashboard/life-index",
    color: "bento-card-blue",
    span: "md:col-span-2",
    icon: (
      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Habits",
    description: "Track streaks, build routines, level up.",
    href: "/dashboard/habits",
    color: "bento-card-emerald",
    span: "",
    icon: (
      <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Finance",
    description: "Budget, transactions, investments, net worth.",
    href: "/finance/tracker",
    color: "bento-card-emerald",
    span: "",
    icon: (
      <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Education",
    description: "Study sessions, courses, notes, skills, and AI assistant.",
    href: "/education/dashboard",
    color: "bento-card-blue",
    span: "md:col-span-2",
    icon: (
      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    title: "Roadmap",
    description: "Google SDE preparation mission control.",
    href: "/roadmap",
    color: "bento-card-orange",
    span: "",
    icon: (
      <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
  {
    title: "Settings",
    description: "Account, profile, and preferences.",
    href: "/settings",
    color: "",
    span: "",
    icon: (
      <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        compact
        label="Command Center"
        title="Dashboard"
        description="Your personal mission control. Everything in one place."
      />

      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <BentoGrid>
            {cards.map((card) => (
              <motion.div key={card.href} variants={bentoItem}>
                <Link
                  href={card.href}
                  className={`bento-card bento-card-shine ${card.color} ${card.span} block h-full group`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    {card.icon}
                    <h3 className="font-display font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {card.title}
                    </h3>
                  </div>
                  <p className="font-body text-sm text-white/40 group-hover:text-white/50 transition-colors">
                    {card.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1 font-body text-xs text-white/20 group-hover:text-blue-400/60 transition-colors">
                    Open <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </BentoGrid>
        </div>
      </section>
    </>
  );
}
