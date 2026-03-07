import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../..");

export const CONFIG = {
  // File paths
  STATE_FILE: path.join(ROOT, "scripts/data/state.json"),
  OUTPUT_TS: path.join(ROOT, "src/lib/generated/subscription-catalog.ts"),
  OUTPUT_SQL: path.join(ROOT, "supabase/seed/subscription-catalog-seed.sql"),

  // LLM settings — use OpenAI directly (gpt-4o-mini is fast, cheap, high rate limits)
  BASE_URL: "https://api.openai.com/v1",
  MODEL: "gpt-4o-mini",
  API_KEY_ENV: "OPENAI_API_KEY",
  CLASSIFY_BATCH_SIZE: 20,
  PLAN_BATCH_SIZE: 5,

  // Rate limiting (gpt-4o-mini has generous limits — 1s delay is sufficient)
  OPENAI_DELAY_MS: 1000,
  MAX_RETRIES: 5,
  RETRY_BASE_DELAY_MS: 5000,

  // Validation
  MIN_CONFIDENCE: 0.6,
  MAX_PLAN_PRICE: 10000,

  // Logo URL pattern (Google S2 Favicons)
  FAVICON_URL: (domain: string) =>
    `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
};
