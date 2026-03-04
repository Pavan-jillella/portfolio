"use client";
import { EnrichedSubscription } from "@/types";
import { formatCurrency } from "@/lib/finance-utils";
import { motion } from "framer-motion";

interface SubscriptionCardProps {
  subscription: EnrichedSubscription;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  index: number;
}

export function SubscriptionCard({ subscription: sub, onToggle, onDelete, index }: SubscriptionCardProps) {
  const now = new Date();
  const billing = new Date(sub.next_billing_date);
  const daysUntil = Math.ceil((billing.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const renewalColor =
    daysUntil < 0 ? "bg-red-500/20 text-red-400" :
    daysUntil <= 3 ? "bg-red-500/20 text-red-400" :
    daysUntil <= 7 ? "bg-amber-500/20 text-amber-400" :
    "bg-blue-500/20 text-blue-400";

  const renewalLabel =
    daysUntil < 0 ? "Overdue" :
    daysUntil === 0 ? "Today" :
    daysUntil === 1 ? "Tomorrow" :
    `${daysUntil}d`;

  const logoUrl = sub.service.logo_url;
  const serviceName = sub.service.name;
  const planName = sub.plan?.name;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.03 }}
      className={`glass-card rounded-2xl p-4 group ${!sub.active ? "opacity-50" : ""}`}
    >
      <div className="flex items-center gap-3">
        {/* Logo */}
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center shrink-0 overflow-hidden">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt=""
              className="w-6 h-6 rounded-md object-contain"
              onError={(e) => {
                const el = e.target as HTMLImageElement;
                el.style.display = "none";
                const fallback = document.createElement("span");
                fallback.className = "font-display text-sm text-white/40";
                fallback.textContent = serviceName.charAt(0).toUpperCase();
                el.parentElement?.appendChild(fallback);
              }}
            />
          ) : (
            <span className="font-display text-sm text-white/40">
              {serviceName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-body text-sm text-white truncate">{serviceName}</p>
            {planName && (
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/30">
                {planName}
              </span>
            )}
            {sub.active && (
              <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded-full ${renewalColor}`}>
                {renewalLabel}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-body text-xs text-white/30 capitalize">{sub.billing_cycle}</span>
            <span className="text-white/10">|</span>
            <span className="font-body text-xs text-white/30">{sub.service.category}</span>
            {sub.card_last4 && (
              <>
                <span className="text-white/10">|</span>
                <span className="font-mono text-[10px] text-white/20">****{sub.card_last4}</span>
              </>
            )}
          </div>
        </div>

        {/* Amount + Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-mono text-sm text-white">{formatCurrency(sub.price)}</span>
          {sub.service.website && (
            <a
              href={sub.service.website}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-blue-400 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
          <button
            onClick={() => onToggle(sub.id)}
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
              sub.active ? "border-emerald-500 bg-emerald-500/20" : "border-white/20"
            }`}
          >
            {sub.active && (
              <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          <button
            onClick={() => onDelete(sub.id)}
            className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
