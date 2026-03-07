import { z } from "zod";

// ===== Subscription Categories =====

export const CATEGORIES = [
  "Streaming", "Music", "Gaming", "Software", "AI Tools",
  "Cloud", "Education", "Fitness", "News", "Storage",
  "VPN", "Developer Tools", "Design Tools", "Business SaaS",
  "Productivity", "Other",
] as const;

export type SubscriptionCategory = (typeof CATEGORIES)[number];

// ===== Pipeline Types =====

export interface RawService {
  name: string;
  domain: string;
  website?: string;
  category_hint?: string;
}

export interface ClassifiedService {
  id: string;
  name: string;
  slug: string;
  domain: string;
  category: SubscriptionCategory;
  website: string;
  logo_url: string;
  confidence: number;
}

export interface ExtractedPlan {
  id: string;
  service_id: string;
  name: string;
  price: number;
  currency: string;
  billing_cycle: "weekly" | "monthly" | "yearly";
  description: string | null;
}

export interface PipelineState {
  phase: "seed" | "classify" | "extract" | "output" | "complete";
  raw_services: RawService[];
  classified_services: ClassifiedService[];
  extracted_plans: ExtractedPlan[];
  errors: { service: string; phase: string; error: string }[];
  last_processed_index: number;
  started_at: string;
  updated_at: string;
}

// ===== Zod Schemas for AI Response Validation =====

export const ClassificationItemSchema = z.object({
  name: z.string(),
  category: z.enum(CATEGORIES),
  is_subscription: z.boolean(),
  confidence: z.number().min(0).max(1),
});

export const ClassificationBatchSchema = z.object({
  results: z.array(ClassificationItemSchema),
});

export const PlanItemSchema = z.object({
  name: z.string(),
  price: z.number().nonnegative(),
  billing_cycle: z.enum(["weekly", "monthly", "yearly"]),
  description: z.string().nullable().optional(),
});

export const PlanExtractionBatchSchema = z.object({
  services: z.array(z.object({
    service_slug: z.string(),
    plans: z.array(PlanItemSchema),
  })),
});
