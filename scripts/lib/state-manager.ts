import fs from "fs";
import path from "path";
import { PipelineState, ClassifiedService, ExtractedPlan, RawService } from "./types";
import { CONFIG } from "./config";

function freshState(): PipelineState {
  return {
    phase: "seed",
    raw_services: [],
    classified_services: [],
    extracted_plans: [],
    errors: [],
    last_processed_index: 0,
    started_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export class StateManager {
  private filePath: string;
  private state: PipelineState;

  constructor(filePath: string = CONFIG.STATE_FILE) {
    this.filePath = filePath;
    this.state = this.load();
  }

  private load(): PipelineState {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, "utf-8");
        return JSON.parse(raw) as PipelineState;
      }
    } catch {
      // Corrupted state file, start fresh
    }
    return freshState();
  }

  save(): void {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const tmpPath = this.filePath + ".tmp";
    this.state.updated_at = new Date().toISOString();
    fs.writeFileSync(tmpPath, JSON.stringify(this.state, null, 2));
    fs.renameSync(tmpPath, this.filePath);
  }

  getState(): PipelineState {
    return this.state;
  }

  setPhase(phase: PipelineState["phase"]): void {
    this.state.phase = phase;
    this.save();
  }

  setRawServices(services: RawService[]): void {
    this.state.raw_services = services;
  }

  setClassifiedServices(services: ClassifiedService[]): void {
    this.state.classified_services = services;
  }

  appendClassified(services: ClassifiedService[]): void {
    this.state.classified_services.push(...services);
  }

  setExtractedPlans(plans: ExtractedPlan[]): void {
    this.state.extracted_plans = plans;
  }

  appendPlans(plans: ExtractedPlan[]): void {
    this.state.extracted_plans.push(...plans);
  }

  setLastProcessedIndex(index: number): void {
    this.state.last_processed_index = index;
  }

  recordError(service: string, phase: string, error: string): void {
    this.state.errors.push({ service, phase, error });
  }

  reset(): void {
    this.state = freshState();
    try {
      if (fs.existsSync(this.filePath)) fs.unlinkSync(this.filePath);
      const tmpPath = this.filePath + ".tmp";
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    } catch {
      // Ignore cleanup errors
    }
  }
}
