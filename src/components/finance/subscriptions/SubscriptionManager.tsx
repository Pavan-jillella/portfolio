"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import { SubscriptionService, SubscriptionPlan, UserSubscription, EnrichedSubscription, SubscriptionFrequency } from "@/types";
import { SUBSCRIPTION_FREQUENCIES, SUBSCRIPTION_CATEGORY_OPTIONS, FALLBACK_SUBSCRIPTION_SERVICES, FALLBACK_SUBSCRIPTION_PLANS } from "@/lib/constants";
import { generateId, formatCurrency, getUserSubscriptionMonthlyTotal } from "@/lib/finance-utils";
import { SubscriptionSearch } from "./SubscriptionSearch";
import { SubscriptionPlanSelector } from "./SubscriptionPlanSelector";
import { SubscriptionCard } from "./SubscriptionCard";
import { SubscriptionAnalytics } from "./SubscriptionAnalytics";
import { ViewToggle, ViewMode } from "@/components/ui/ViewToggle";
import { motion, AnimatePresence } from "framer-motion";

interface SubscriptionManagerProps {
  userSubscriptions: UserSubscription[];
  onAdd: (sub: UserSubscription) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

type SubTab = "subscriptions" | "analytics";

export function SubscriptionManager({ userSubscriptions, onAdd, onToggle, onDelete }: SubscriptionManagerProps) {
  const [subTab, setSubTab] = useState<SubTab>("subscriptions");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [filterFrequency, setFilterFrequency] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);

  // Catalog state (fetched from API)
  const [services, setServices] = useState<SubscriptionService[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);

  // Form state
  const [selectedService, setSelectedService] = useState<SubscriptionService | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isCustomPlan, setIsCustomPlan] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [customName, setCustomName] = useState("");
  const [price, setPrice] = useState("");
  const [billingCycle, setBillingCycle] = useState<SubscriptionFrequency>("monthly");
  const [nextDate, setNextDate] = useState("");
  const [reminderDays, setReminderDays] = useState("3");
  const [cardLast4, setCardLast4] = useState("");
  const [notes, setNotes] = useState("");

  // Fetch catalog on mount, fall back to static catalog if API unavailable
  useEffect(() => {
    async function fetchCatalog() {
      try {
        const res = await fetch("/api/finance/subscription-catalog");
        if (res.ok) {
          const data = await res.json();
          const apiServices = data.services || [];
          const apiPlans = data.plans || [];
          if (apiServices.length > 0) {
            setServices(apiServices);
            setPlans(apiPlans);
          } else {
            setServices(FALLBACK_SUBSCRIPTION_SERVICES);
            setPlans(FALLBACK_SUBSCRIPTION_PLANS);
          }
        } else {
          setServices(FALLBACK_SUBSCRIPTION_SERVICES);
          setPlans(FALLBACK_SUBSCRIPTION_PLANS);
        }
      } catch {
        // Catalog API unavailable — use fallback static catalog
        setServices(FALLBACK_SUBSCRIPTION_SERVICES);
        setPlans(FALLBACK_SUBSCRIPTION_PLANS);
      } finally {
        setCatalogLoading(false);
      }
    }
    fetchCatalog();
  }, []);

  // Plans for selected service
  const servicePlans = useMemo(() => {
    if (!selectedService) return [];
    return plans.filter((p) => p.service_id === selectedService.id);
  }, [plans, selectedService]);

  // Enrich user subscriptions with service + plan data (client-side join)
  const enriched: EnrichedSubscription[] = useMemo(() => {
    const serviceMap = new Map(services.map((s) => [s.id, s]));
    const planMap = new Map(plans.map((p) => [p.id, p]));

    return userSubscriptions.map((us) => {
      const service = serviceMap.get(us.service_id) || {
        id: us.service_id,
        name: us.service_id,
        slug: us.service_id,
        domain: "",
        category: "Other",
        website: null,
        logo_url: null,
        created_at: "",
      };
      const plan = us.plan_id ? planMap.get(us.plan_id) || null : null;
      return { ...us, service, plan };
    });
  }, [userSubscriptions, services, plans]);

  const monthlyTotal = getUserSubscriptionMonthlyTotal(enriched);
  const yearlyTotal = monthlyTotal * 12;

  // Available categories from enriched subscriptions
  const categoryOptions = useMemo(() => {
    const cats = new Set(enriched.map((s) => s.service.category));
    return Array.from(cats).sort();
  }, [enriched]);

  const frequencyOptions = useMemo(
    () => Array.from(new Set(userSubscriptions.map((s) => s.billing_cycle))).sort(),
    [userSubscriptions]
  );

  const filteredSubs = useMemo(() => {
    return enriched.filter((s) => {
      if (filterStatus === "active" && !s.active) return false;
      if (filterStatus === "inactive" && s.active) return false;
      if (filterFrequency !== "all" && s.billing_cycle !== filterFrequency) return false;
      if (filterCategory !== "all" && s.service.category !== filterCategory) return false;
      return true;
    });
  }, [enriched, filterStatus, filterFrequency, filterCategory]);

  // Upcoming renewal alerts
  const alerts = useMemo(() => {
    const now = new Date();
    return enriched
      .filter((s) => s.active)
      .filter((s) => {
        const billing = new Date(s.next_billing_date);
        const diffDays = Math.ceil((billing.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= s.reminder_days;
      })
      .sort((a, b) => a.next_billing_date.localeCompare(b.next_billing_date));
  }, [enriched]);

  const resetForm = useCallback(() => {
    setSelectedService(null);
    setSelectedPlan(null);
    setIsCustomPlan(false);
    setCustomMode(false);
    setCustomName("");
    setPrice("");
    setBillingCycle("monthly");
    setNextDate("");
    setReminderDays("3");
    setCardLast4("");
    setNotes("");
  }, []);

  function handleServiceSelect(service: SubscriptionService) {
    setSelectedService(service);
    setSelectedPlan(null);
    setIsCustomPlan(false);
    setCustomMode(false);
    setCustomName("");
  }

  function handleCustomService(name: string) {
    setCustomMode(true);
    setCustomName(name);
    setSelectedService(null);
    setSelectedPlan(null);
  }

  function handlePlanSelect(plan: SubscriptionPlan) {
    setSelectedPlan(plan);
    setIsCustomPlan(false);
    setPrice(String(plan.price));
    setBillingCycle(plan.billing_cycle);
  }

  function handleCustomPlan() {
    setSelectedPlan(null);
    setIsCustomPlan(true);
    setPrice("");
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!price || !nextDate) return;
    if (!selectedService && !customName.trim()) return;

    const serviceId = selectedService?.id || `custom-${generateId()}`;
    const serviceName = selectedService?.name || customName.trim();

    // If custom service, add a temporary service record
    if (!selectedService && customName.trim()) {
      const tempService: SubscriptionService = {
        id: serviceId,
        name: customName.trim(),
        slug: customName.trim().toLowerCase().replace(/\s+/g, "-"),
        domain: "",
        category: "Other",
        website: null,
        logo_url: null,
        created_at: new Date().toISOString(),
      };
      setServices((prev) => [...prev, tempService]);
    }

    const sub: UserSubscription = {
      id: generateId(),
      user_id: "", // Will be set by sync API
      service_id: serviceId,
      plan_id: selectedPlan?.id || null,
      price: parseFloat(price),
      currency: "USD",
      billing_cycle: billingCycle,
      next_billing_date: nextDate,
      card_last4: cardLast4 || null,
      reminder_days: parseInt(reminderDays) || 3,
      active: true,
      notes: notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onAdd(sub);
    resetForm();
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {([
            { id: "subscriptions" as SubTab, label: "My Subscriptions" },
            { id: "analytics" as SubTab, label: "Analytics" },
          ]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-body transition-all duration-200 ${
                subTab === tab.id
                  ? "glass-card text-blue-400"
                  : "text-white/40 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {subTab === "subscriptions" && (
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="glass-card px-4 py-2 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30"
          >
            {showForm ? "Cancel" : "+ Add Subscription"}
          </button>
        )}
      </div>

      {/* Analytics Tab */}
      {subTab === "analytics" && (
        <SubscriptionAnalytics subscriptions={enriched} />
      )}

      {/* Subscriptions Tab */}
      {subTab === "subscriptions" && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card rounded-2xl p-4 text-center">
              <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Monthly Cost</p>
              <p className="font-mono text-xl text-white">{formatCurrency(monthlyTotal)}</p>
            </div>
            <div className="glass-card rounded-2xl p-4 text-center">
              <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Yearly Cost</p>
              <p className="font-mono text-xl text-white/60">{formatCurrency(yearlyTotal)}</p>
            </div>
            <div className="glass-card rounded-2xl p-4 text-center">
              <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Active</p>
              <p className="font-mono text-xl text-blue-400">{userSubscriptions.filter((s) => s.active).length}</p>
            </div>
          </div>

          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="glass-card rounded-2xl p-5 border-yellow-500/20">
              <h4 className="font-display font-semibold text-sm text-yellow-400 mb-3">
                Upcoming Renewals
              </h4>
              <div className="space-y-2">
                {alerts.map((sub) => {
                  const now = new Date();
                  const days = Math.ceil((new Date(sub.next_billing_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={sub.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {sub.service.logo_url ? (
                          <img src={sub.service.logo_url} alt={sub.service.name} className="w-4 h-4 rounded-sm" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        ) : (
                          <span className="w-4 h-4 rounded-sm bg-white/10 flex items-center justify-center font-display text-[8px] text-white/40">{sub.service.name.charAt(0).toUpperCase()}</span>
                        )}
                        <span className="font-body text-sm text-white">{sub.service.name}</span>
                        {sub.plan && <span className="font-mono text-[10px] text-white/20">{sub.plan.name}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-white/60">{formatCurrency(sub.price)}</span>
                        <span className={`font-mono text-xs px-2 py-0.5 rounded-full ${
                          days <= 1 ? "bg-red-500/20 text-red-400" :
                          days <= 3 ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-blue-500/20 text-blue-400"
                        }`}>
                          {days === 0 ? "Today" : days === 1 ? "Tomorrow" : `${days}d`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add Subscription Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
              <form
                onSubmit={handleAdd}
                className="glass-card rounded-2xl p-5 space-y-4"
              >
                <h4 className="font-display font-semibold text-sm text-white">Add Subscription</h4>

                {/* Step 1: Search service */}
                <div className="relative z-30">
                  <SubscriptionSearch
                    services={services}
                    onSelect={handleServiceSelect}
                    onCustom={handleCustomService}
                  />
                </div>

                {/* Show selected service info */}
                {selectedService && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                    {selectedService.logo_url ? (
                      <img
                        src={selectedService.logo_url}
                        alt={selectedService.name}
                        className="w-8 h-8 rounded-lg bg-white/10"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-display text-sm text-white/40">
                        {selectedService.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <div>
                      <p className="font-body text-sm text-white">{selectedService.name}</p>
                      <p className="font-mono text-[10px] text-white/30">{selectedService.category} &middot; {selectedService.domain}</p>
                    </div>
                  </div>
                )}

                {customMode && (
                  <div>
                    <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Custom Service Name</label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="My Custom Service"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
                    />
                  </div>
                )}

                {/* Step 2: Select plan (if service has plans) */}
                {selectedService && servicePlans.length > 0 && (
                  <SubscriptionPlanSelector
                    plans={servicePlans}
                    selectedPlanId={selectedPlan?.id || null}
                    isCustom={isCustomPlan}
                    onSelect={handlePlanSelect}
                    onCustom={handleCustomPlan}
                  />
                )}

                {/* Step 3: Billing details */}
                {(selectedService || customMode) && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Price</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="15.99"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Billing Cycle</label>
                      <select
                        value={billingCycle}
                        onChange={(e) => setBillingCycle(e.target.value as SubscriptionFrequency)}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 font-body text-sm text-white focus:outline-none focus:border-blue-500/40 transition-all appearance-none"
                      >
                        {SUBSCRIPTION_FREQUENCIES.map((f) => (
                          <option key={f.value} value={f.value} className="bg-[#0a0c12]">{f.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Next Billing</label>
                      <input
                        type="date"
                        value={nextDate}
                        onChange={(e) => setNextDate(e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 font-body text-sm text-white focus:outline-none focus:border-blue-500/40 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Remind (days)</label>
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={reminderDays}
                        onChange={(e) => setReminderDays(e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Card Last 4</label>
                      <input
                        type="text"
                        maxLength={4}
                        value={cardLast4}
                        onChange={(e) => setCardLast4(e.target.value.replace(/\D/g, ""))}
                        placeholder="1234"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Notes</label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Family plan, shared with..."
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
                      />
                    </div>
                  </div>
                )}

                {(selectedService || customMode) && (
                  <button
                    type="submit"
                    disabled={!price || !nextDate || (!selectedService && !customName.trim())}
                    className="glass-card px-5 py-2.5 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    + Add Subscription
                  </button>
                )}

                {catalogLoading && (
                  <p className="font-body text-xs text-white/20">Loading catalog...</p>
                )}
              </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Subscription List */}
          {enriched.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <p className="font-body text-sm text-white/30">No subscriptions tracked yet</p>
              <p className="font-body text-xs text-white/20 mt-1">
                {services.length > 0 ? `${services.length} services available in catalog` : ""}
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-3 glass-card px-4 py-2 rounded-xl text-sm font-body text-blue-400 hover:text-white transition-all hover:border-blue-500/30"
              >
                Add your first subscription
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Header with view toggle and filters */}
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-lg text-white">
                  Subscriptions
                  <span className="ml-2 font-mono text-xs text-white/30">({filteredSubs.length})</span>
                </h3>
                <ViewToggle viewMode={viewMode} onChange={setViewMode} />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {(["all", "active", "inactive"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 rounded-full border font-mono text-xs transition-all capitalize ${
                      filterStatus === status
                        ? "border-blue-500/30 bg-blue-500/[0.12] text-blue-400"
                        : "border-white/8 bg-white/4 text-white/40 hover:border-white/15"
                    }`}
                  >
                    {status}
                  </button>
                ))}
                {frequencyOptions.length > 1 && (
                  <>
                    <span className="text-white/10">|</span>
                    <button
                      onClick={() => setFilterFrequency("all")}
                      className={`px-3 py-1.5 rounded-full border font-mono text-xs transition-all ${
                        filterFrequency === "all"
                          ? "border-blue-500/30 bg-blue-500/[0.12] text-blue-400"
                          : "border-white/8 bg-white/4 text-white/40 hover:border-white/15"
                      }`}
                    >
                      All freq
                    </button>
                    {frequencyOptions.map((freq) => (
                      <button
                        key={freq}
                        onClick={() => setFilterFrequency(freq)}
                        className={`px-3 py-1.5 rounded-full border font-mono text-xs transition-all capitalize ${
                          filterFrequency === freq
                            ? "border-blue-500/30 bg-blue-500/[0.12] text-blue-400"
                            : "border-white/8 bg-white/4 text-white/40 hover:border-white/15"
                        }`}
                      >
                        {freq}
                      </button>
                    ))}
                  </>
                )}
                {categoryOptions.length > 1 && (
                  <>
                    <span className="text-white/10">|</span>
                    <button
                      onClick={() => setFilterCategory("all")}
                      className={`px-3 py-1.5 rounded-full border font-mono text-xs transition-all ${
                        filterCategory === "all"
                          ? "border-blue-500/30 bg-blue-500/[0.12] text-blue-400"
                          : "border-white/8 bg-white/4 text-white/40 hover:border-white/15"
                      }`}
                    >
                      All cats
                    </button>
                    {categoryOptions.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`px-3 py-1.5 rounded-full border font-mono text-xs transition-all ${
                          filterCategory === cat
                            ? "border-blue-500/30 bg-blue-500/[0.12] text-blue-400"
                            : "border-white/8 bg-white/4 text-white/40 hover:border-white/15"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </>
                )}
              </div>

              {/* List View */}
              {viewMode === "list" && (
                <AnimatePresence>
                  {filteredSubs.map((sub, i) => (
                    <SubscriptionCard
                      key={sub.id}
                      subscription={sub}
                      onToggle={onToggle}
                      onDelete={onDelete}
                      index={i}
                    />
                  ))}
                </AnimatePresence>
              )}

              {/* Grid View */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSubs.map((sub, i) => {
                    return (
                      <motion.div
                        key={sub.id}
                        className={`glass-card rounded-2xl p-5 flex flex-col justify-between group ${!sub.active ? "opacity-50" : ""}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.3 }}
                      >
                        <div>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {sub.service.logo_url ? (
                                <img
                                  src={sub.service.logo_url}
                                  alt={sub.service.name}
                                  className="w-5 h-5 rounded-md"
                                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                />
                              ) : (
                                <span className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center font-display text-[10px] text-white/40">
                                  {sub.service.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                              <span className="font-body text-sm text-white font-medium">{sub.service.name}</span>
                            </div>
                            <button
                              onClick={() => onToggle(sub.id)}
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                                sub.active ? "border-emerald-500 bg-emerald-500/20" : "border-white/20"
                              }`}
                            >
                              {sub.active && (
                                <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </button>
                          </div>
                          {sub.plan && (
                            <p className="font-mono text-[10px] text-white/25 mb-1">{sub.plan.name} Plan</p>
                          )}
                          <p className="font-mono text-xl text-white mb-2">{formatCurrency(sub.price)}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-body text-xs text-white/30 capitalize">{sub.billing_cycle}</span>
                            <span className="text-white/10">|</span>
                            <span className="font-body text-xs text-white/30">{sub.service.category}</span>
                          </div>
                          {sub.card_last4 && (
                            <p className="font-mono text-[10px] text-white/15 mt-1">****{sub.card_last4}</p>
                          )}
                          <p className="font-mono text-[10px] text-white/20 mt-1">Next: {sub.next_billing_date}</p>
                        </div>
                        <div className="flex items-center pt-3 border-t border-white/5 mt-3">
                          {sub.service.website && (
                            <a
                              href={sub.service.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 rounded-lg text-[10px] font-body text-white/30 hover:text-blue-400 hover:bg-white/5 transition-all opacity-0 group-hover:opacity-100"
                            >
                              Website
                            </a>
                          )}
                          <button
                            onClick={() => onDelete(sub.id)}
                            className="px-2 py-1 rounded-lg text-[10px] font-body text-white/30 hover:text-red-400 hover:bg-white/5 transition-all ml-auto opacity-0 group-hover:opacity-100"
                          >
                            Delete
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Table View */}
              {viewMode === "table" && (
                <div className="glass-card rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Service</th>
                          <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Plan</th>
                          <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider text-right">Price</th>
                          <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Cycle</th>
                          <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Category</th>
                          <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Next Billing</th>
                          <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Card</th>
                          <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSubs.map((sub) => (
                          <tr key={sub.id} className={`border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors ${!sub.active ? "opacity-50" : ""}`}>
                            <td className="px-4 py-2.5">
                              <button
                                onClick={() => onToggle(sub.id)}
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                                  sub.active ? "border-emerald-500 bg-emerald-500/20" : "border-white/20"
                                }`}
                              >
                                {sub.active && (
                                  <svg className="w-2.5 h-2.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </button>
                            </td>
                            <td className="px-4 py-2.5">
                              <div className="flex items-center gap-2">
                                {sub.service.logo_url ? (
                                  <img src={sub.service.logo_url} alt={sub.service.name} className="w-4 h-4 rounded-sm" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                                ) : (
                                  <span className="w-4 h-4 rounded-sm bg-white/10 flex items-center justify-center font-display text-[8px] text-white/40">{sub.service.name.charAt(0).toUpperCase()}</span>
                                )}
                                <span className="font-body text-xs text-white/70">{sub.service.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-2.5">
                              <span className="font-mono text-[10px] text-white/30">{sub.plan?.name || "—"}</span>
                            </td>
                            <td className="px-4 py-2.5 text-right">
                              <span className="font-mono text-xs text-white">{formatCurrency(sub.price)}</span>
                            </td>
                            <td className="px-4 py-2.5">
                              <span className="font-body text-xs text-white/40 capitalize">{sub.billing_cycle}</span>
                            </td>
                            <td className="px-4 py-2.5">
                              <span className="font-body text-xs text-white/40">{sub.service.category}</span>
                            </td>
                            <td className="px-4 py-2.5">
                              <span className="font-mono text-xs text-white/40">{sub.next_billing_date}</span>
                            </td>
                            <td className="px-4 py-2.5">
                              <span className="font-mono text-[10px] text-white/20">{sub.card_last4 ? `****${sub.card_last4}` : "—"}</span>
                            </td>
                            <td className="px-4 py-2.5 text-right">
                              <button
                                onClick={() => onDelete(sub.id)}
                                className="px-1.5 py-0.5 rounded text-[10px] font-mono text-white/25 hover:text-red-400 transition-colors"
                              >
                                Del
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
