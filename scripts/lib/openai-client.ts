import OpenAI from "openai";
import { z } from "zod";
import { sleep } from "./utils";
import { CONFIG } from "./config";
import { Logger } from "./logger";

export class OpenAIClient {
  private client: OpenAI;
  private lastCallTime: number = 0;
  private minDelayMs: number;
  private logger: Logger;

  constructor(apiKey: string, logger: Logger, minDelayMs: number = CONFIG.OPENAI_DELAY_MS) {
    this.client = new OpenAI({ apiKey, baseURL: CONFIG.BASE_URL });
    this.minDelayMs = minDelayMs;
    this.logger = logger;
  }

  async chatJSON<T>(params: {
    systemPrompt: string;
    userPrompt: string;
    schema: z.ZodSchema<T>;
    maxTokens?: number;
    temperature?: number;
  }): Promise<T> {
    const maxRetries = CONFIG.MAX_RETRIES;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Enforce rate limit
        const now = Date.now();
        const elapsed = now - this.lastCallTime;
        if (elapsed < this.minDelayMs) {
          await sleep(this.minDelayMs - elapsed);
        }
        this.lastCallTime = Date.now();

        const response = await this.client.chat.completions.create({
          model: CONFIG.MODEL,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: params.systemPrompt },
            { role: "user", content: params.userPrompt },
          ],
          max_tokens: params.maxTokens ?? 4096,
          temperature: params.temperature ?? 0.3,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) throw new Error("Empty response from OpenAI");

        // Try parsing JSON directly
        let parsed: unknown;
        try {
          parsed = JSON.parse(content);
        } catch {
          // Try extracting JSON from markdown code blocks
          const match = content.match(/```(?:json)?\s*([\s\S]*?)```/);
          if (match) {
            parsed = JSON.parse(match[1].trim());
          } else {
            // Try finding JSON object/array pattern
            const jsonMatch = content.match(/[\[{][\s\S]*[\]}]/);
            if (jsonMatch) {
              parsed = JSON.parse(jsonMatch[0]);
            } else {
              throw new Error(`Cannot parse JSON from response: ${content.slice(0, 200)}`);
            }
          }
        }

        // Validate with Zod
        const result = params.schema.parse(parsed);
        return result;
      } catch (err) {
        const isLast = attempt === maxRetries;
        const errMsg = err instanceof Error ? err.message : String(err);

        if (isLast) {
          throw new Error(`OpenAI call failed after ${maxRetries + 1} attempts: ${errMsg}`);
        }

        // For rate limit errors, wait longer
        const is429 = errMsg.includes("429") || errMsg.toLowerCase().includes("rate limit");
        const baseDelay = is429 ? CONFIG.RETRY_BASE_DELAY_MS * 2 : CONFIG.RETRY_BASE_DELAY_MS;
        const delay = baseDelay * Math.pow(2, attempt);
        this.logger.error(`Attempt ${attempt + 1} failed${is429 ? " (rate limited)" : ""}, retrying in ${delay / 1000}s`, err);
        await sleep(delay);
      }
    }

    // Unreachable, but TypeScript needs it
    throw new Error("Unreachable");
  }
}
