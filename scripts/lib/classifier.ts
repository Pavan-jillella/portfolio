import { CATEGORIES, ClassifiedService, ClassificationBatchSchema, RawService } from "./types";
import { CONFIG } from "./config";
import { OpenAIClient } from "./openai-client";
import { StateManager } from "./state-manager";
import { Logger } from "./logger";
import { slugify, normalizeDomain, faviconUrl, generateServiceId } from "./utils";

const CLASSIFY_SYSTEM_PROMPT = `You are a subscription service classifier. You will receive a numbered list of software/service names with their domains.

For EACH service, determine:
1. "is_subscription" (boolean): Does this product offer paid subscription plans? (true = yes, has recurring paid plans)
2. "category" (string): The best-fit category from this EXACT list: ${CATEGORIES.join(", ")}
3. "name" (string): The correct official product name (fix capitalization if needed)
4. "confidence" (number 0-1): How confident you are in the classification

Return a JSON object with this exact structure:
{
  "results": [
    { "index": 0, "name": "...", "category": "...", "is_subscription": true/false, "confidence": 0.95 },
    ...
  ]
}

Rules:
- Include ALL services from the input (one result per input service)
- Only set is_subscription=true if the product actually has paid recurring subscription plans
- Use the exact category names from the list above
- Set confidence < 0.5 if you're unsure about the service`;

export async function classifyBatch(
  client: OpenAIClient,
  services: RawService[],
  startIndex: number
): Promise<ClassifiedService[]> {
  const userPrompt = services
    .map((s, i) => `${startIndex + i}. ${s.name} (${s.domain})${s.category_hint ? ` [hint: ${s.category_hint}]` : ""}`)
    .join("\n");

  const response = await client.chatJSON({
    systemPrompt: CLASSIFY_SYSTEM_PROMPT,
    userPrompt: `Classify these subscription services:\n\n${userPrompt}`,
    schema: ClassificationBatchSchema,
    maxTokens: 4096,
  });

  const classified: ClassifiedService[] = [];

  for (const result of response.results) {
    if (!result.is_subscription) continue;
    if (result.confidence < CONFIG.MIN_CONFIDENCE) continue;

    // Find the original service to get the domain
    const originalIndex = (result as { index?: number }).index;
    const original = typeof originalIndex === "number"
      ? services[originalIndex - startIndex]
      : services.find((s) => s.name.toLowerCase() === result.name.toLowerCase())
        ?? services.find((s) => result.name.toLowerCase().includes(s.name.toLowerCase().split(" ")[0]));

    if (!original) continue;

    const domain = normalizeDomain(original.domain);
    const slug = slugify(result.name);
    const website = original.website ?? `https://${domain}`;

    classified.push({
      id: generateServiceId(slug),
      name: result.name,
      slug,
      domain,
      category: result.category,
      website,
      logo_url: faviconUrl(domain),
      confidence: result.confidence,
    });
  }

  return classified;
}

export async function classifyAll(
  client: OpenAIClient,
  services: RawService[],
  stateManager: StateManager,
  logger: Logger
): Promise<ClassifiedService[]> {
  const state = stateManager.getState();
  const batchSize = CONFIG.CLASSIFY_BATCH_SIZE;
  const startFrom = state.last_processed_index;
  const total = services.length;
  const totalBatches = Math.ceil((total - startFrom) / batchSize);

  let batchNum = 0;

  for (let i = startFrom; i < total; i += batchSize) {
    batchNum++;
    const batch = services.slice(i, i + batchSize);
    const batchLabel = `Batch ${batchNum}/${totalBatches} (services ${i + 1}-${Math.min(i + batchSize, total)})`;

    try {
      logger.progress(i, total, `Classifying: ${batchLabel}`);
      const classified = await classifyBatch(client, batch, i);
      stateManager.appendClassified(classified);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      logger.error(`Classification failed for ${batchLabel}`, err);
      for (const s of batch) {
        stateManager.recordError(s.name, "classify", errMsg);
      }
    }

    stateManager.setLastProcessedIndex(i + batchSize);
    stateManager.save();
  }

  logger.progress(total, total, "Classification complete");

  // Deduplicate by ID (in case of overlapping results)
  const seen = new Map<string, ClassifiedService>();
  for (const s of state.classified_services) {
    if (!seen.has(s.id)) seen.set(s.id, s);
  }

  const deduped = Array.from(seen.values());
  stateManager.setClassifiedServices(deduped);
  stateManager.save();

  return deduped;
}
