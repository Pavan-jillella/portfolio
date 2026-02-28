import { TaxConfig, TaxBreakdown } from "@/types";

// 2024 Federal Tax Brackets (Single)
const FEDERAL_BRACKETS_SINGLE = [
  { min: 0, max: 11600, rate: 0.10 },
  { min: 11600, max: 47150, rate: 0.12 },
  { min: 47150, max: 100525, rate: 0.22 },
  { min: 100525, max: 191950, rate: 0.24 },
  { min: 191950, max: 243725, rate: 0.32 },
  { min: 243725, max: 609350, rate: 0.35 },
  { min: 609350, max: Infinity, rate: 0.37 },
];

const FEDERAL_BRACKETS_MARRIED_JOINTLY = [
  { min: 0, max: 23200, rate: 0.10 },
  { min: 23200, max: 94300, rate: 0.12 },
  { min: 94300, max: 201050, rate: 0.22 },
  { min: 201050, max: 383900, rate: 0.24 },
  { min: 383900, max: 487450, rate: 0.32 },
  { min: 487450, max: 731200, rate: 0.35 },
  { min: 731200, max: Infinity, rate: 0.37 },
];

const FEDERAL_BRACKETS_MARRIED_SEPARATELY = [
  { min: 0, max: 11600, rate: 0.10 },
  { min: 11600, max: 47150, rate: 0.12 },
  { min: 47150, max: 100525, rate: 0.22 },
  { min: 100525, max: 191950, rate: 0.24 },
  { min: 191950, max: 243725, rate: 0.32 },
  { min: 243725, max: 365600, rate: 0.35 },
  { min: 365600, max: Infinity, rate: 0.37 },
];

const FEDERAL_BRACKETS_HEAD_OF_HOUSEHOLD = [
  { min: 0, max: 16550, rate: 0.10 },
  { min: 16550, max: 63100, rate: 0.12 },
  { min: 63100, max: 100500, rate: 0.22 },
  { min: 100500, max: 191950, rate: 0.24 },
  { min: 191950, max: 243700, rate: 0.32 },
  { min: 243700, max: 609350, rate: 0.35 },
  { min: 609350, max: Infinity, rate: 0.37 },
];

// Virginia State Tax Brackets (2024)
const VA_BRACKETS = [
  { min: 0, max: 3000, rate: 0.02 },
  { min: 3000, max: 5000, rate: 0.03 },
  { min: 5000, max: 17000, rate: 0.05 },
  { min: 17000, max: Infinity, rate: 0.0575 },
];

function getFederalBrackets(filingStatus: TaxConfig["filing_status"]) {
  switch (filingStatus) {
    case "married_jointly":
      return FEDERAL_BRACKETS_MARRIED_JOINTLY;
    case "married_separately":
      return FEDERAL_BRACKETS_MARRIED_SEPARATELY;
    case "head_of_household":
      return FEDERAL_BRACKETS_HEAD_OF_HOUSEHOLD;
    default:
      return FEDERAL_BRACKETS_SINGLE;
  }
}

function calculateBracketTax(
  taxableIncome: number,
  brackets: { min: number; max: number; rate: number }[]
): number {
  let tax = 0;
  for (const bracket of brackets) {
    if (taxableIncome <= bracket.min) break;
    const taxable = Math.min(taxableIncome, bracket.max) - bracket.min;
    tax += taxable * bracket.rate;
  }
  return tax;
}

export function calculateFederalTax(
  annualTaxableIncome: number,
  filingStatus: TaxConfig["filing_status"] = "single"
): number {
  if (annualTaxableIncome <= 0) return 0;
  const brackets = getFederalBrackets(filingStatus);
  return calculateBracketTax(annualTaxableIncome, brackets);
}

export function calculateVirginiaTax(annualTaxableIncome: number): number {
  if (annualTaxableIncome <= 0) return 0;
  return calculateBracketTax(annualTaxableIncome, VA_BRACKETS);
}

export function calculateTaxBreakdown(
  grossPay: number,
  annualGrossEstimate: number,
  config: TaxConfig
): TaxBreakdown {
  if (grossPay <= 0) {
    return {
      gross: 0,
      federal_tax: 0,
      state_tax: 0,
      fica: 0,
      medicare: 0,
      custom_deductions_total: 0,
      total_deductions: 0,
      net_pay: 0,
      effective_rate: 0,
    };
  }

  const payRatio = annualGrossEstimate > 0 ? grossPay / annualGrossEstimate : 1;

  // Federal tax: calculate annual, then prorate to this pay period
  const annualTaxableIncome = Math.max(0, annualGrossEstimate - config.federal_standard_deduction);
  const annualFederalTax = calculateFederalTax(annualTaxableIncome, config.filing_status);
  const federal_tax = Math.round(annualFederalTax * payRatio * 100) / 100;

  // Virginia state tax: calculate annual, then prorate
  const annualStateTax = calculateVirginiaTax(annualTaxableIncome);
  const state_tax = Math.round(annualStateTax * payRatio * 100) / 100;

  // FICA (Social Security)
  const ficaableIncome = Math.min(grossPay, config.fica_wage_cap * payRatio);
  const fica = Math.round(ficaableIncome * config.fica_rate * 100) / 100;

  // Medicare
  const medicare = Math.round(grossPay * config.medicare_rate * 100) / 100;

  // Custom deductions
  let custom_deductions_total = 0;
  for (const deduction of config.custom_deductions) {
    if (deduction.is_percentage) {
      custom_deductions_total += grossPay * (deduction.amount / 100);
    } else {
      custom_deductions_total += deduction.amount;
    }
  }
  custom_deductions_total = Math.round(custom_deductions_total * 100) / 100;

  const total_deductions = federal_tax + state_tax + fica + medicare + custom_deductions_total;
  const net_pay = Math.round((grossPay - total_deductions) * 100) / 100;
  const effective_rate = grossPay > 0 ? Math.round((total_deductions / grossPay) * 10000) / 100 : 0;

  return {
    gross: grossPay,
    federal_tax,
    state_tax,
    fica,
    medicare,
    custom_deductions_total,
    total_deductions: Math.round(total_deductions * 100) / 100,
    net_pay,
    effective_rate,
  };
}
