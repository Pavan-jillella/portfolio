import { ClassifiedService, ExtractedPlan, PlanExtractionBatchSchema } from "./types";
import { CONFIG } from "./config";
import { OpenAIClient } from "./openai-client";
import { StateManager } from "./state-manager";
import { Logger } from "./logger";
import { generatePlanId } from "./utils";

const EXTRACT_PLANS_SYSTEM_PROMPT = `You are a subscription pricing expert. You will receive a list of subscription services.

For EACH service, provide the known PAID subscription plans (skip free tiers).

Return a JSON object with this exact structure:
{
  "services": [
    {
      "service_slug": "netflix",
      "plans": [
        { "name": "Standard with Ads", "price": 6.99, "billing_cycle": "monthly", "description": "1080p, ads" },
        { "name": "Standard", "price": 15.49, "billing_cycle": "monthly", "description": "1080p, no ads" },
        { "name": "Premium", "price": 22.99, "billing_cycle": "monthly", "description": "4K HDR, 4 screens" }
      ]
    }
  ]
}

Rules:
- Prices in USD
- billing_cycle must be "weekly", "monthly", or "yearly"
- Do NOT include free/freemium tiers
- Include 1-5 plans per service (the most popular tiers)
- If a service has both monthly and yearly options, prefer the monthly price. Include yearly only if it's a distinctly different plan.
- If you're unsure about exact pricing, give your best estimate
- description can be null if no concise description fits`;

export async function extractPlansBatch(
  client: OpenAIClient,
  services: ClassifiedService[]
): Promise<ExtractedPlan[]> {
  const userPrompt = services
    .map((s) => `- ${s.name} (slug: ${s.slug}, domain: ${s.domain}, category: ${s.category})`)
    .join("\n");

  const response = await client.chatJSON({
    systemPrompt: EXTRACT_PLANS_SYSTEM_PROMPT,
    userPrompt: `Extract subscription plans for these services:\n\n${userPrompt}`,
    schema: PlanExtractionBatchSchema,
    maxTokens: 4096,
  });

  const plans: ExtractedPlan[] = [];

  for (const svc of response.services) {
    const service = services.find((s) => s.slug === svc.service_slug);
    if (!service) continue;

    for (const plan of svc.plans) {
      // Validate price range
      if (plan.price <= 0 || plan.price > CONFIG.MAX_PLAN_PRICE) continue;

      plans.push({
        id: generatePlanId(service.slug, plan.name),
        service_id: service.id,
        name: plan.name,
        price: Math.round(plan.price * 100) / 100, // Round to 2 decimals
        currency: "USD",
        billing_cycle: plan.billing_cycle,
        description: plan.description ?? null,
      });
    }
  }

  return plans;
}

export async function extractAllPlans(
  client: OpenAIClient,
  services: ClassifiedService[],
  stateManager: StateManager,
  logger: Logger
): Promise<ExtractedPlan[]> {
  const state = stateManager.getState();
  const batchSize = CONFIG.PLAN_BATCH_SIZE;
  const startFrom = state.last_processed_index;
  const total = services.length;
  const totalBatches = Math.ceil((total - startFrom) / batchSize);

  let batchNum = 0;

  for (let i = startFrom; i < total; i += batchSize) {
    batchNum++;
    const batch = services.slice(i, i + batchSize);
    const batchLabel = `Batch ${batchNum}/${totalBatches} (${batch.map((s) => s.slug).join(", ")})`;

    try {
      logger.progress(i, total, `Extracting plans: ${batchLabel}`);
      const plans = await extractPlansBatch(client, batch);
      stateManager.appendPlans(plans);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      logger.error(`Plan extraction failed for ${batchLabel}`, err);
      for (const s of batch) {
        stateManager.recordError(s.name, "extract", errMsg);
      }
    }

    stateManager.setLastProcessedIndex(i + batchSize);
    stateManager.save();
  }

  logger.progress(total, total, "Plan extraction complete");

  // Deduplicate plans by ID
  const seen = new Map<string, ExtractedPlan>();
  for (const p of state.extracted_plans) {
    if (!seen.has(p.id)) seen.set(p.id, p);
  }

  const deduped = Array.from(seen.values());
  stateManager.setExtractedPlans(deduped);
  stateManager.save();

  return deduped;
}
