export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
  topics: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  read_time: string;
  published: boolean;
  tags: string[];
  created_at: string;
}

export interface Vlog {
  id: string;
  title: string;
  youtube_id: string;
  category: string;
  duration: string;
  published_at: string;
  description: string;
}

export interface UserProject {
  id: string;
  name: string;
  description: string;
  language: string;
  url: string;
  stars: number;
  forks: number;
  topics: string[];
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  html_url: string;
  topics: string[];
}

export interface LeetCodeStats {
  solved: number;
  easy: number;
  medium: number;
  hard: number;
  totalQuestions: number;
  totalEasy: number;
  totalMedium: number;
  totalHard: number;
}

export interface Stats {
  github: {
    repos: number;
    stars: number;
    followers: number;
    contributions: number;
  };
  leetcode: LeetCodeStats;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  honeypot?: string;
}

export interface Comment {
  id: string;
  blog_slug: string;
  author_name: string;
  content: string;
  parent_id: string | null;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
}

export interface PageView {
  id: string;
  path: string;
  visited_at: string;
  referrer: string | null;
}

// ===== Finance Tracker Types =====

export type TransactionType = "income" | "expense";

export type TransactionCategory = string;

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description: string;
  date: string;
  created_at: string;
}

export interface Budget {
  id: string;
  category: TransactionCategory;
  monthly_limit: number;
  month: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  created_at: string;
}

export interface MonthlySpending {
  category: TransactionCategory;
  total: number;
}

export interface MonthlySummary {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

export interface SpendingRecommendation {
  category: TransactionCategory;
  message: string;
  severity: "info" | "warning" | "danger";
}

// ===== Education Course Tracker Types =====

export type CourseStatus = "planned" | "in-progress" | "completed";

export type CoursePlatform =
  | "Udemy"
  | "Coursera"
  | "YouTube"
  | "Pluralsight"
  | "edX"
  | "LinkedIn Learning"
  | "FreeCodeCamp"
  | "Other";

export type CourseCategory =
  | "Python"
  | "Web Dev"
  | "Finance"
  | "Data Science"
  | "Machine Learning"
  | "DevOps"
  | "Mobile"
  | "Design"
  | "DSA"
  | "System Design"
  | "Other";

export interface Course {
  id: string;
  name: string;
  platform: CoursePlatform;
  url: string;
  progress: number;
  status: CourseStatus;
  category: CourseCategory;
  total_hours: number;
  created_at: string;
}

export interface CourseMaterial {
  id: string;
  course_id: string;
  title: string;
  type: "note" | "link" | "file";
  content: string;
  created_at: string;
}

export interface CourseUpdate {
  id: string;
  course_id: string;
  description: string;
  date: string;
  created_at: string;
}

// ===== Investment Tracker Types =====

export type InvestmentType = "stock" | "crypto" | "commodity" | "index" | "forex" | "sip" | "real-estate" | "other";

export type MarketRegion = "indian" | "us" | "crypto" | "commodity" | "other";

export type PriceHistoryRange = "1D" | "1W" | "1M" | "1Y";

export interface PriceHistoryPoint {
  timestamp: number;
  price: number;
}

export interface Investment {
  id: string;
  name: string;
  type: InvestmentType;
  ticker?: string;
  exchange?: string;
  market?: MarketRegion;
  quantity?: number;
  purchase_price: number;
  current_value: number;
  currency: string;
  last_updated: string;
  created_at: string;
}

// ===== Net Worth Types =====

export type NetWorthEntryType = "asset" | "liability";

export interface NetWorthEntry {
  id: string;
  name: string;
  type: NetWorthEntryType;
  category: string;
  value: number;
  currency: string;
  created_at: string;
}

// ===== Subscription Types =====

export type SubscriptionFrequency = "weekly" | "monthly" | "yearly";

// Legacy flat subscription type (kept for backward compat during migration)
export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  frequency: SubscriptionFrequency;
  category: string;
  next_billing_date: string;
  reminder_days: number;
  active: boolean;
  created_at: string;
  website?: string;
  logo_url?: string;
  card_last4?: string;
  notes?: string;
  service_id?: string;
}

// ===== Normalized Subscription Architecture =====

export interface SubscriptionService {
  id: string;
  name: string;
  slug: string;
  domain: string;
  category: string;
  website: string | null;
  logo_url: string | null;
  created_at: string;
}

export interface SubscriptionPlan {
  id: string;
  service_id: string;
  name: string;
  price: number;
  currency: string;
  billing_cycle: SubscriptionFrequency;
  description: string | null;
  created_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  service_id: string;
  plan_id: string | null;
  price: number;
  currency: string;
  billing_cycle: SubscriptionFrequency;
  next_billing_date: string;
  card_last4: string | null;
  reminder_days: number;
  active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Enriched type for UI (user subscription + joined service + plan data)
export interface EnrichedSubscription extends UserSubscription {
  service: SubscriptionService;
  plan: SubscriptionPlan | null;
}

// ===== Currency Types =====

export interface CurrencyRate {
  code: string;
  rate: number;
}

// ===== Monthly Report Types =====

export interface MonthlyReport {
  month: string;
  income: number;
  expenses: number;
  savings: number;
  savingsRate: number;
  topCategories: { category: string; total: number }[];
  recommendations: string[];
}

// ===== Education Dashboard Types =====

export interface StudySession {
  id: string;
  subject: string;
  duration_minutes: number;
  date: string;
  notes: string;
  created_at: string;
}

export interface StudyGoal {
  id: string;
  subject: string;
  target_hours_per_week: number;
  created_at: string;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  order: number;
  completed: boolean;
  created_at: string;
}

export interface CourseNote {
  id: string;
  course_id: string;
  content_html: string;
  updated_at: string;
  created_at: string;
}

export interface CourseFile {
  id: string;
  course_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  created_at: string;
}

export interface Note {
  id: string;
  title: string;
  content_html: string;
  linked_course_id: string | null;
  linked_project_id: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface NoteVersion {
  id: string;
  note_id: string;
  content_html: string;
  saved_at: string;
}

export interface UploadedFile {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  linked_entity_type: "course" | "project" | "note" | "standalone";
  linked_entity_id: string | null;
  created_at: string;
}

export type ProjectStatus = "planned" | "in-progress" | "completed" | "on-hold";

export interface DashboardProject {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  github_url: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  due_date: string | null;
  completed: boolean;
  created_at: string;
}

export interface ProjectFile {
  id: string;
  project_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  created_at: string;
}

export interface ProjectNote {
  id: string;
  project_id: string;
  content_html: string;
  updated_at: string;
  created_at: string;
}

export interface GitHubLanguageBreakdown {
  language: string;
  count: number;
  color: string;
}

export interface LeetCodeSubmission {
  title: string;
  titleSlug: string;
  timestamp: string;
  statusDisplay: string;
  lang: string;
}

export interface LeetCodeDashboardData {
  solved: number;
  easy: number;
  medium: number;
  hard: number;
  totalQuestions: number;
  totalEasy: number;
  totalMedium: number;
  totalHard: number;
  ranking: number;
  contributionPoints: number;
  recentSubmissions: LeetCodeSubmission[];
  submissionCalendar: Record<string, number>;
}

export interface DashboardOverviewStats {
  studyHoursThisWeek: number;
  coursesCompleted: number;
  coursesTotal: number;
  githubRepos: number;
  githubStars: number;
  leetcodeSolved: number;
  activeProjects: number;
  notesCount: number;
}

export interface RecentActivity {
  id: string;
  type: "study" | "course" | "note" | "project" | "milestone";
  description: string;
  timestamp: string;
}

// ===== Payroll & Part-Time Jobs Types =====

export type PayFrequency = "weekly" | "biweekly" | "semimonthly" | "monthly";

export type PayType = "hourly" | "salary" | "commission" | "fixed_weekly" | "per_shift";

export interface Employer {
  id: string;
  name: string;
  pay_type: PayType;
  hourly_rate: number;
  fixed_amount: number;
  commission_rate: number;
  color: string;
  overtime_enabled: boolean;
  overtime_multiplier: number;
  overtime_threshold: number;
  holiday_multiplier: number;
  active: boolean;
  created_at: string;
}

export interface PayStubDeductions {
  federal_tax: number;
  state_tax: number;
  social_security: number;
  medicare: number;
  other_deductions: number;
  other_deductions_label: string;
}

export interface PayStub {
  id: string;
  employer_name: string;
  employer_id?: string;
  pay_period_start: string;
  pay_period_end: string;
  pay_date: string;
  regular_hours: number;
  overtime_hours: number;
  hourly_rate: number;
  gross_pay: number;
  deductions: PayStubDeductions;
  net_pay: number;
  source: "manual" | "google-sheets" | "auto-calculated";
  created_at: string;
}

export interface PartTimeJob {
  id: string;
  name: string;
  hourly_rate: number;
  color: string;
  active: boolean;
  created_at: string;
}

export interface PartTimeHourEntry {
  id: string;
  job_id: string;
  date: string;
  hours: number;
  notes: string;
  start_time?: string;
  end_time?: string;
  created_at: string;
}

export interface PayrollSettings {
  pay_frequency: PayFrequency;
  google_sheets_url: string;
  default_employer: string;
  schedule_name: string;
  hourly_rate: number;
}

export interface ScheduleShift {
  day: string;
  start_time: string;
  end_time: string;
  hours: number;
}

export interface EnhancedShift {
  id: string;
  schedule_id: string;
  date: string;
  day: string;
  start_time: string;
  end_time: string;
  hours: number;
  is_holiday: boolean;
}

export interface WorkSchedule {
  id: string;
  period_label: string;
  period_start: string;
  period_end: string;
  shifts: ScheduleShift[];
  total_hours: number;
  hourly_rate: number;
  created_at: string;
}

export interface EnhancedWorkSchedule {
  id: string;
  employer_id: string;
  period_label: string;
  start_date: string;
  end_date: string;
  shifts: EnhancedShift[];
  total_hours: number;
  gross_amount: number;
  created_at: string;
}

export interface CustomDeduction {
  label: string;
  amount: number;
  is_percentage: boolean;
}

export interface TaxConfig {
  filing_status: "single" | "married_jointly" | "married_separately" | "head_of_household";
  federal_standard_deduction: number;
  fica_rate: number;
  fica_wage_cap: number;
  medicare_rate: number;
  state: "VA";
  custom_deductions: CustomDeduction[];
}

export interface TaxBreakdown {
  gross: number;
  federal_tax: number;
  state_tax: number;
  fica: number;
  medicare: number;
  custom_deductions_total: number;
  total_deductions: number;
  net_pay: number;
  effective_rate: number;
}

export interface IncomeGoal {
  id: string;
  year: number;
  target_amount: number;
}

export interface EmployerIncome {
  employer_id: string;
  employer_name: string;
  color: string;
  gross: number;
  hours: number;
}

export interface WeeklyTrendEntry {
  week_label: string;
  gross: number;
  net: number;
  hours: number;
}

export interface MonthlyTrendEntry {
  month: string;
  gross: number;
  net: number;
  hours: number;
}

export interface PayrollDashboardStats {
  total_hours_month: number;
  gross_month: number;
  net_month: number;
  taxes_month: number;
  effective_hourly_rate: number;
  income_by_employer: EmployerIncome[];
  weekly_trend: WeeklyTrendEntry[];
  monthly_trend: MonthlyTrendEntry[];
}

export interface ShiftConflict {
  shift_a: EnhancedShift;
  shift_b: EnhancedShift;
  employer_a: string;
  employer_b: string;
  overlap_minutes: number;
}

export interface EnhancedPayrollSettings extends PayrollSettings {
  tax_config: TaxConfig;
  employers: Employer[];
  income_goals: IncomeGoal[];
  auto_send_to_income: boolean;
  auto_sync_enabled: boolean;
  auto_sync_interval_minutes: number;
  last_synced_at: string | null;
}

// ===== Apps Script Response Types =====

export interface AppsScriptShift {
  day: string;
  start: string;
  end: string;
  hours: number;
}

export interface AppsScriptWeek {
  weekLabel: string;
  totalHours: number;
  change: number;
  trend: string;
  status: string;
  totalPay: number;
  prettyLabel: string;
}

export interface AppsScriptData {
  employee: string;
  current: AppsScriptShift[];
  history: AppsScriptWeek[];
  payPeriod: {
    hours: number;
    pay: number;
    period: { label: string };
    weeksDetails: string[];
  } | null;
  updatedAt: string;
}

// ===== Activity Timeline Types =====

export type ActivityType = "study" | "blog" | "code" | "project" | "note" | "course";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// ===== AI Education Types =====

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number; // 1-5
  xp: number;
  max_xp: number;
  created_at: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  source_type: "course" | "note" | "subject";
  source_id: string;
  source_label: string;
  questions: QuizQuestion[];
  answers?: number[];
  score?: number;
  total?: number;
  completed_at?: string;
  created_at: string;
}

export interface PlanWeek {
  week: number;
  topic: string;
  tasks: string[];
  completed: boolean;
}

export interface LearningPlan {
  id: string;
  goal: string;
  duration_weeks: number;
  level: string;
  weeks: PlanWeek[];
  created_at: string;
}

export interface AIInsight {
  id: string;
  type: "insights" | "mentor" | "recommendations";
  content: string;
  created_at: string;
}

export interface CourseRecommendation {
  name: string;
  reason: string;
  category: string;
  difficulty: string;
}

export interface CourseResource {
  id: string;
  course_id: string;
  title: string;
  url: string;
  type: "video" | "article" | "code" | "dataset" | "pdf" | "other";
  created_at: string;
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface NoteAIResult {
  summary?: string;
  flashcards?: Flashcard[];
  key_concepts?: { term: string; definition: string }[];
  generated_at: string;
}

// ===== Analytics Types =====

export interface CommitDay {
  date: string;
  count: number;
}

export interface GrowthData {
  month: string;
  score: number;
}
