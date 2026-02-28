import { z } from "zod";

export const employerSchema = z.object({
  name: z.string().min(1, "Employer name is required").max(100),
  pay_type: z.enum(["hourly", "salary", "commission", "fixed_weekly", "per_shift"]),
  hourly_rate: z.number().min(0).default(0),
  fixed_amount: z.number().min(0).default(0),
  commission_rate: z.number().min(0).max(100).default(0),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color"),
  overtime_enabled: z.boolean().default(false),
  overtime_multiplier: z.number().min(1).max(3).default(1.5),
  overtime_threshold: z.number().min(0).max(168).default(40),
  holiday_multiplier: z.number().min(1).max(3).default(1.5),
  active: z.boolean().default(true),
});

export type EmployerFormData = z.infer<typeof employerSchema>;

export const shiftTimeSchema = z.string().refine(
  (val) => {
    if (!val) return true;
    return /^(\d{1,2}(:\d{2})?\s*(AM|PM)?|\d{1,2}(:\d{2}))$/i.test(val);
  },
  { message: "Invalid time format (e.g. 10:00, 4PM, 4:30 PM)" }
);

export const scheduleImportUrlSchema = z.object({
  url: z
    .string()
    .url("Must be a valid URL")
    .refine(
      (url) =>
        url.includes("script.google.com") ||
        url.includes("script.googleusercontent.com") ||
        url.includes("docs.google.com/spreadsheets") ||
        url.includes("spreadsheets.google.com"),
      { message: "URL must be a Google Apps Script or Google Sheets link" }
    ),
});

export const taxConfigSchema = z.object({
  filing_status: z.enum(["single", "married_jointly", "married_separately", "head_of_household"]),
  federal_standard_deduction: z.number().min(0),
  fica_rate: z.number().min(0).max(0.2),
  fica_wage_cap: z.number().min(0),
  medicare_rate: z.number().min(0).max(0.1),
  state: z.literal("VA"),
  custom_deductions: z.array(
    z.object({
      label: z.string().min(1),
      amount: z.number().min(0),
      is_percentage: z.boolean(),
    })
  ),
});

export const payStubGenerateSchema = z.object({
  employer_name: z.string().min(1, "Employer name is required"),
  employer_id: z.string().optional(),
  pay_period_start: z.string().min(1, "Pay period start is required"),
  pay_period_end: z.string().min(1, "Pay period end is required"),
  pay_date: z.string().min(1, "Pay date is required"),
  regular_hours: z.number().min(0),
  overtime_hours: z.number().min(0).default(0),
  hourly_rate: z.number().min(0),
  gross_pay: z.number().min(0),
});

export type PayStubFormData = z.infer<typeof payStubGenerateSchema>;

export const incomeGoalSchema = z.object({
  year: z.number().int().min(2020).max(2100),
  target_amount: z.number().min(0),
});
