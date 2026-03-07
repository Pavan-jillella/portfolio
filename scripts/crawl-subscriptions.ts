import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { SEED_SERVICES, deduplicateSeedList } from "./lib/seed-list";
import { OpenAIClient } from "./lib/openai-client";
import { classifyAll } from "./lib/classifier";
import { extractAllPlans } from "./lib/plan-extractor";
import { StateManager } from "./lib/state-manager";
import { generateTypeScriptCatalog } from "./lib/output-typescript";
import { generateSQLSeed } from "./lib/output-supabase";
import { Logger } from "./lib/logger";
import { CATEGORIES } from "./lib/types";
import { CONFIG } from "./lib/config";

async function main() {
  const logger = new Logger();
  const args = process.argv.slice(2);
  const flags = {
    reset: args.includes("--reset"),
    dryRun: args.includes("--dry-run"),
    skipPlans: args.includes("--skip-plans"),
  };

  logger.log("Subscription Catalog Crawler Pipeline");
  logger.log("=====================================\n");

  // Validate env - check OPENAI_API_KEY first, fallback to OPENROUTER_API_KEY
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    logger.error("No API key found. Set OPENROUTER_API_KEY or OPENAI_API_KEY in .env.local");
    process.exit(1);
  }

  const stateManager = new StateManager(CONFIG.STATE_FILE);
  if (flags.reset) {
    logger.log("Resetting pipeline state...");
    stateManager.reset();
  }

  const client = new OpenAIClient(apiKey, logger);
  const state = stateManager.getState();

  // ── Layer 1: Seed List ──
  if (state.phase === "seed" || state.raw_services.length === 0) {
    logger.log("Layer 1: Loading and deduplicating seed list...");
    const raw = deduplicateSeedList(SEED_SERVICES);
    stateManager.setRawServices(raw);
    stateManager.setPhase("classify");
    logger.log(`  ${raw.length} unique services after dedup (from ${SEED_SERVICES.length} total)`);
  } else {
    logger.log(`Layer 1: Using cached seed list (${state.raw_services.length} services)`);
  }

  // ── Layer 2: AI Classification ──
  if (state.phase === "classify") {
    logger.log("\nLayer 2: Classifying services with AI...");
    logger.log(`  Model: ${CONFIG.MODEL}, Batch size: ${CONFIG.CLASSIFY_BATCH_SIZE}, Min confidence: ${CONFIG.MIN_CONFIDENCE}`);

    state.last_processed_index = state.classified_services.length > 0 ? state.last_processed_index : 0;

    const classified = await classifyAll(client, state.raw_services, stateManager, logger);
    stateManager.setPhase(flags.skipPlans ? "output" : "extract");
    state.last_processed_index = 0; // Reset for plan extraction phase
    stateManager.save();

    logger.log(`\n  ${classified.length} services classified and validated`);

    // Log category distribution
    const catCounts = new Map<string, number>();
    for (const s of classified) {
      catCounts.set(s.category, (catCounts.get(s.category) || 0) + 1);
    }
    logger.log("  Category distribution:");
    for (const cat of CATEGORIES) {
      const count = catCounts.get(cat) || 0;
      if (count > 0) logger.log(`    ${cat}: ${count}`);
    }
  } else if (state.phase !== "seed") {
    logger.log(`Layer 2: Using cached classifications (${state.classified_services.length} services)`);
  }

  // ── Layer 3: Plan Extraction ──
  if (state.phase === "extract") {
    logger.log("\nLayer 3: Extracting pricing plans with AI...");
    logger.log(`  Batch size: ${CONFIG.PLAN_BATCH_SIZE}`);

    const plans = await extractAllPlans(client, state.classified_services, stateManager, logger);
    stateManager.setPhase("output");
    stateManager.save();

    logger.log(`\n  ${plans.length} plans extracted across ${state.classified_services.length} services`);
  } else if (state.phase === "output" || state.phase === "complete") {
    logger.log(`Layer 3: Using cached plans (${state.extracted_plans.length} plans)`);
  }

  // ── Layer 4: Output ──
  if (state.phase === "output" && !flags.dryRun) {
    logger.log("\nLayer 4: Generating outputs...");

    // Validate before output
    const serviceIds = new Set(state.classified_services.map((s) => s.id));
    const validPlans = state.extracted_plans.filter((p) => serviceIds.has(p.service_id));
    const orphanedPlans = state.extracted_plans.length - validPlans.length;
    if (orphanedPlans > 0) {
      logger.log(`  Warning: ${orphanedPlans} orphaned plans removed (missing service_id)`);
    }

    // Check for duplicate IDs
    const planIds = new Set<string>();
    const dedupedPlans = validPlans.filter((p) => {
      if (planIds.has(p.id)) return false;
      planIds.add(p.id);
      return true;
    });

    // 4a: TypeScript constants
    generateTypeScriptCatalog(state.classified_services, dedupedPlans, CONFIG.OUTPUT_TS);
    logger.log(`  TypeScript catalog: ${CONFIG.OUTPUT_TS}`);

    // 4b: SQL seed file
    generateSQLSeed(state.classified_services, dedupedPlans, CONFIG.OUTPUT_SQL);
    logger.log(`  SQL seed: ${CONFIG.OUTPUT_SQL}`);

    stateManager.setPhase("complete");
    stateManager.save();
  } else if (flags.dryRun) {
    logger.log("\nLayer 4: Skipped (dry run mode)");
  }

  // ── Summary ──
  logger.summary({
    "Seed services": state.raw_services.length,
    "Classified (valid)": state.classified_services.length,
    "Plans extracted": state.extracted_plans.length,
    "Errors": state.errors.length,
  });

  if (state.errors.length > 0) {
    logger.log(`Errors (showing first 10 of ${state.errors.length}):`);
    for (const e of state.errors.slice(0, 10)) {
      logger.error(`  [${e.phase}] ${e.service}: ${e.error}`);
    }
    if (state.errors.length > 10) {
      logger.log(`  ... and ${state.errors.length - 10} more`);
    }
  }

  logger.log("Done.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
