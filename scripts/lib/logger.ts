export class Logger {
  private startTime: number;

  constructor() {
    this.startTime = Date.now();
  }

  private timestamp(): string {
    const elapsed = Date.now() - this.startTime;
    const s = Math.floor(elapsed / 1000) % 60;
    const m = Math.floor(elapsed / 60000) % 60;
    const h = Math.floor(elapsed / 3600000);
    return `[${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}]`;
  }

  log(message: string): void {
    console.log(`${this.timestamp()} ${message}`);
  }

  progress(current: number, total: number, label: string): void {
    const pct = Math.round((current / total) * 100);
    const barLen = 20;
    const filled = Math.round((current / total) * barLen);
    const bar = "=".repeat(filled) + " ".repeat(barLen - filled);
    process.stdout.write(
      `\r${this.timestamp()} [${bar}] ${current}/${total} (${pct}%) ${label}`
    );
    if (current === total) process.stdout.write("\n");
  }

  error(message: string, err?: unknown): void {
    const detail = err instanceof Error ? err.message : String(err ?? "");
    console.error(`${this.timestamp()} ERROR: ${message}${detail ? ` — ${detail}` : ""}`);
  }

  summary(stats: Record<string, number>): void {
    console.log("\n" + "=".repeat(50));
    console.log("  PIPELINE SUMMARY");
    console.log("=".repeat(50));
    for (const [key, value] of Object.entries(stats)) {
      console.log(`  ${key.padEnd(25)} ${value}`);
    }
    console.log("=".repeat(50) + "\n");
  }
}
