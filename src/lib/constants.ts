import { CoursePlatform, CourseCategory, CourseStatus, InvestmentType, PriceHistoryRange, SubscriptionFrequency, ProjectStatus, PayType, TaxConfig, Employer } from "@/types";

export const DEFAULT_EXPENSE_CATEGORIES: string[] = [
  "Rent", "Groceries", "Dining", "Travel", "Subscriptions",
  "Investment", "Shopping", "Health", "Entertainment", "Utilities",
  "Education", "Other",
];

export const DEFAULT_INCOME_CATEGORIES: string[] = [
  "Salary", "Freelance", "Investment", "Other",
];

export const CATEGORY_COLORS: Record<string, string> = {
  Rent: "bg-purple-500",
  Groceries: "bg-orange-500",
  Dining: "bg-amber-500",
  Travel: "bg-blue-500",
  Subscriptions: "bg-pink-500",
  Investment: "bg-indigo-500",
  Shopping: "bg-emerald-500",
  Health: "bg-red-500",
  Entertainment: "bg-fuchsia-500",
  Utilities: "bg-yellow-500",
  Education: "bg-cyan-500",
  Salary: "bg-green-500",
  Freelance: "bg-teal-500",
  Other: "bg-gray-500",
};

export const CATEGORY_TEXT_COLORS: Record<string, string> = {
  Rent: "text-purple-400",
  Groceries: "text-orange-400",
  Dining: "text-amber-400",
  Travel: "text-blue-400",
  Subscriptions: "text-pink-400",
  Investment: "text-indigo-400",
  Shopping: "text-emerald-400",
  Health: "text-red-400",
  Entertainment: "text-fuchsia-400",
  Utilities: "text-yellow-400",
  Education: "text-cyan-400",
  Salary: "text-green-400",
  Freelance: "text-teal-400",
  Other: "text-gray-400",
};

export const CATEGORY_HEX_COLORS: Record<string, string> = {
  Rent: "#a855f7",
  Groceries: "#f97316",
  Dining: "#f59e0b",
  Travel: "#3b82f6",
  Subscriptions: "#ec4899",
  Investment: "#6366f1",
  Shopping: "#10b981",
  Health: "#ef4444",
  Entertainment: "#d946ef",
  Utilities: "#eab308",
  Education: "#06b6d4",
  Salary: "#22c55e",
  Freelance: "#14b8a6",
  Other: "#6b7280",
};

export const COURSE_PLATFORMS: CoursePlatform[] = [
  "Udemy", "Coursera", "YouTube", "Pluralsight",
  "edX", "LinkedIn Learning", "FreeCodeCamp", "Other",
];

export const COURSE_CATEGORIES: CourseCategory[] = [
  "Python", "Web Dev", "Finance", "Data Science",
  "Machine Learning", "DevOps", "Mobile", "Design",
  "DSA", "System Design", "Other",
];

export const COURSE_STATUS_CONFIG: Record<CourseStatus, { label: string; color: string; bgColor: string }> = {
  planned: { label: "Planned", color: "text-white/40", bgColor: "bg-white/4" },
  "in-progress": { label: "In Progress", color: "text-blue-400", bgColor: "bg-blue-500/10" },
  completed: { label: "Completed", color: "text-emerald-400", bgColor: "bg-emerald-500/10" },
};

// ===== Investment Constants =====

export const INVESTMENT_TYPES: { value: InvestmentType; label: string }[] = [
  { value: "stock", label: "Stock" },
  { value: "crypto", label: "Crypto" },
  { value: "commodity", label: "Commodity" },
  { value: "index", label: "Index" },
  { value: "forex", label: "Forex" },
  { value: "real-estate", label: "Real Estate" },
  { value: "other", label: "Other" },
];

/** Asset types that support live Yahoo Finance price fetching */
export const LIVE_PRICE_TYPES: InvestmentType[] = [
  "stock", "crypto", "commodity", "index", "forex",
];

export const DEFAULT_REFRESH_INTERVAL_MINUTES = 5;

export const INVESTMENT_TYPE_COLORS: Record<InvestmentType, string> = {
  stock: "bg-blue-500",
  crypto: "bg-amber-500",
  commodity: "bg-yellow-500",
  index: "bg-cyan-500",
  forex: "bg-green-500",
  "real-estate": "bg-purple-500",
  other: "bg-gray-500",
};

export const PRICE_HISTORY_CONFIG: Record<PriceHistoryRange, { range: string; interval: string }> = {
  "1D": { range: "1d", interval: "5m" },
  "1W": { range: "5d", interval: "15m" },
  "1M": { range: "1mo", interval: "1d" },
  "1Y": { range: "1y", interval: "1wk" },
};

export const TICKER_SUGGESTIONS: Partial<Record<InvestmentType, { symbol: string; name: string }[]>> = {
  stock: [
    { symbol: "AAPL", name: "Apple" },
    { symbol: "RELIANCE.NS", name: "Reliance (NSE)" },
    { symbol: "TCS.NS", name: "TCS (NSE)" },
    { symbol: "INFY.NS", name: "Infosys (NSE)" },
  ],
  commodity: [
    { symbol: "GC=F", name: "Gold" },
    { symbol: "SI=F", name: "Silver" },
    { symbol: "CL=F", name: "Crude Oil" },
  ],
  index: [
    { symbol: "SPY", name: "S&P 500 ETF" },
    { symbol: "^GSPC", name: "S&P 500" },
    { symbol: "^NSEI", name: "Nifty 50" },
    { symbol: "^BSESN", name: "Sensex" },
  ],
  forex: [
    { symbol: "EURUSD=X", name: "EUR/USD" },
    { symbol: "GBPUSD=X", name: "GBP/USD" },
    { symbol: "USDINR=X", name: "USD/INR" },
  ],
  crypto: [
    { symbol: "BTC-USD", name: "Bitcoin" },
    { symbol: "ETH-USD", name: "Ethereum" },
  ],
};

// ===== Net Worth Constants =====

export const NET_WORTH_ASSET_CATEGORIES: string[] = [
  "Cash & Savings", "Investments", "Real Estate", "Vehicles", "Retirement Accounts", "Other Assets",
];

export const NET_WORTH_LIABILITY_CATEGORIES: string[] = [
  "Mortgage", "Student Loans", "Car Loans", "Credit Cards", "Personal Loans", "Other Debts",
];

// ===== Subscription Constants =====

export const SUBSCRIPTION_FREQUENCIES: { value: SubscriptionFrequency; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

// ===== Currency Constants =====

export const SUPPORTED_CURRENCIES: { code: string; symbol: string; name: string }[] = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "\u20AC", name: "Euro" },
  { code: "GBP", symbol: "\u00A3", name: "British Pound" },
  { code: "JPY", symbol: "\u00A5", name: "Japanese Yen" },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "INR", symbol: "\u20B9", name: "Indian Rupee" },
  { code: "CNY", symbol: "\u00A5", name: "Chinese Yuan" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
];

// ===== Education Dashboard Constants =====

export const STUDY_SUBJECTS: string[] = [
  "Python", "JavaScript", "TypeScript", "React", "Next.js",
  "Data Science", "Machine Learning", "System Design", "DSA",
  "DevOps", "Databases", "Math", "Finance", "Other",
];

export const SUBJECT_COLORS: Record<string, string> = {
  Python: "#3572A5",
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  React: "#61dafb",
  "Next.js": "#ffffff",
  "Data Science": "#ff6f61",
  "Machine Learning": "#a855f7",
  "System Design": "#06b6d4",
  DSA: "#10b981",
  DevOps: "#f97316",
  Databases: "#6366f1",
  Math: "#ec4899",
  Finance: "#22c55e",
  Other: "#6b7280",
};

export const PROJECT_STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; bgColor: string }> = {
  planned: { label: "Planned", color: "text-white/40", bgColor: "bg-white/4" },
  "in-progress": { label: "In Progress", color: "text-blue-400", bgColor: "bg-blue-500/10" },
  completed: { label: "Completed", color: "text-emerald-400", bgColor: "bg-emerald-500/10" },
  "on-hold": { label: "On Hold", color: "text-amber-400", bgColor: "bg-amber-500/10" },
};

export const GITHUB_LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Other: "#6b7280",
};

export const FILE_TYPE_ICONS: Record<string, string> = {
  "application/pdf": "PDF",
  "image/png": "PNG",
  "image/jpeg": "JPG",
  "image/gif": "GIF",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  "text/plain": "TXT",
  "text/markdown": "MD",
};

export const DASHBOARD_TABS = [
  { id: "overview", label: "Overview" },
  { id: "study", label: "Study Planner" },
  { id: "courses", label: "Courses" },
  { id: "notes", label: "Notes" },
  { id: "projects", label: "Projects" },
  { id: "github", label: "GitHub" },
  { id: "leetcode", label: "LeetCode" },
  { id: "files", label: "Files" },
] as const;

export type DashboardTabId = (typeof DASHBOARD_TABS)[number]["id"];

// ===== Payroll Constants =====

export const EMPLOYER_COLORS: string[] = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ef4444", // red
  "#06b6d4", // cyan
  "#ec4899", // pink
  "#f97316", // orange
  "#14b8a6", // teal
  "#6366f1", // indigo
];

export const PAY_TYPE_LABELS: Record<PayType, string> = {
  hourly: "Hourly",
  salary: "Salary",
  commission: "Commission",
  fixed_weekly: "Fixed Weekly",
  per_shift: "Per Shift",
};

export const DEFAULT_TAX_CONFIG: TaxConfig = {
  filing_status: "single",
  federal_standard_deduction: 14600,
  fica_rate: 0.062,
  fica_wage_cap: 168600,
  medicare_rate: 0.0145,
  state: "VA",
  custom_deductions: [],
};

export const DEFAULT_EMPLOYERS: Employer[] = [
  {
    id: "default-stemtree",
    name: "Stemtree",
    pay_type: "hourly",
    hourly_rate: 14,
    fixed_amount: 0,
    commission_rate: 0,
    color: "#3b82f6",
    overtime_enabled: false,
    overtime_multiplier: 1.5,
    overtime_threshold: 40,
    holiday_multiplier: 1.5,
    active: true,
    created_at: new Date().toISOString(),
  },
];

export const FILING_STATUS_LABELS: Record<TaxConfig["filing_status"], string> = {
  single: "Single",
  married_jointly: "Married Filing Jointly",
  married_separately: "Married Filing Separately",
  head_of_household: "Head of Household",
};

