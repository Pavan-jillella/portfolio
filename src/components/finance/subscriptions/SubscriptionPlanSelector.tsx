"use client";
import { SubscriptionPlan } from "@/types";
import { formatCurrency } from "@/lib/finance-utils";
import { motion } from "framer-motion";

interface SubscriptionPlanSelectorProps {
  plans: SubscriptionPlan[];
  selectedPlanId: string | null;
  onSelect: (plan: SubscriptionPlan) => void;
  onCustom: () => void;
}

export function SubscriptionPlanSelector({ plans, selectedPlanId, onSelect, onCustom }: SubscriptionPlanSelectorProps) {
  if (plans.length === 0) {
    return (
      <div className="col-span-full">
        <p className="font-body text-xs text-white/30">No plans available. Enter custom pricing below.</p>
      </div>
    );
  }

  return (
    <div className="col-span-full">
      <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">
        Select Plan
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {plans.map((plan, i) => {
          const isSelected = selectedPlanId === plan.id;
          return (
            <motion.button
              key={plan.id}
              type="button"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => onSelect(plan)}
              className={`text-left p-3 rounded-xl border transition-all ${
                isSelected
                  ? "border-blue-500/40 bg-blue-500/[0.08]"
                  : "border-white/8 bg-white/4 hover:border-white/15"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-body text-sm text-white">{plan.name}</span>
                <span className={`font-mono text-sm ${isSelected ? "text-blue-400" : "text-white/60"}`}>
                  {formatCurrency(plan.price)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-white/30 capitalize">/{plan.billing_cycle === "yearly" ? "yr" : plan.billing_cycle === "weekly" ? "wk" : "mo"}</span>
                {plan.description && (
                  <span className="font-body text-[10px] text-white/20 truncate">{plan.description}</span>
                )}
              </div>
            </motion.button>
          );
        })}
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: plans.length * 0.03 }}
          onClick={onCustom}
          className={`text-left p-3 rounded-xl border transition-all ${
            selectedPlanId === null
              ? "border-blue-500/40 bg-blue-500/[0.08]"
              : "border-white/8 border-dashed bg-white/[0.02] hover:border-white/15"
          }`}
        >
          <span className="font-body text-sm text-white/40">Custom Amount</span>
          <p className="font-body text-[10px] text-white/20 mt-1">Enter your own price</p>
        </motion.button>
      </div>
    </div>
  );
}
