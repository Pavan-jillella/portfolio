import { CoursePlatform, CourseCategory, CourseStatus, InvestmentType, MarketRegion, PriceHistoryRange, SubscriptionFrequency, SubscriptionService, SubscriptionPlan, ProjectStatus, PayType, TaxConfig, Employer, HabitCategory, HabitDifficulty } from "@/types";

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
  { value: "sip", label: "SIP / Mutual Fund" },
  { value: "forex", label: "Forex" },
  { value: "real-estate", label: "Real Estate" },
  { value: "other", label: "Other" },
];

/** Asset types that support live price fetching */
export const LIVE_PRICE_TYPES: InvestmentType[] = [
  "stock", "crypto", "commodity", "index", "forex", "sip",
];

export const DEFAULT_REFRESH_INTERVAL_MINUTES = 5;

export const INVESTMENT_TYPE_COLORS: Record<InvestmentType, string> = {
  stock: "bg-blue-500",
  crypto: "bg-amber-500",
  commodity: "bg-yellow-500",
  index: "bg-cyan-500",
  sip: "bg-indigo-500",
  forex: "bg-green-500",
  "real-estate": "bg-purple-500",
  other: "bg-gray-500",
};

export const MARKET_GROUPS: { key: MarketRegion; label: string }[] = [
  { key: "indian", label: "Indian Market" },
  { key: "us", label: "US Market" },
  { key: "crypto", label: "Crypto" },
  { key: "commodity", label: "Gold & Silver" },
  { key: "other", label: "Other" },
];

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
    { symbol: "SBIN.NS", name: "SBI (NSE)" },
  ],
  sip: [
    { symbol: "0P0000XVAA.BO", name: "SBI Blue Chip" },
    { symbol: "0P0001BAO7.BO", name: "HDFC Mid-Cap" },
    { symbol: "0P00009VDL.BO", name: "Axis Long Term" },
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

export const SUBSCRIPTION_CATEGORY_OPTIONS: string[] = [
  "Streaming", "Music", "Gaming", "Software", "AI Tools", "Cloud",
  "Education", "Fitness", "News", "Storage", "VPN", "Developer Tools",
  "Design Tools", "Business SaaS", "Productivity", "Other",
];

export const SUBSCRIPTION_CATEGORY_COLORS: Record<string, string> = {
  Streaming: "#e879f9",
  Music: "#818cf8",
  Gaming: "#34d399",
  Software: "#60a5fa",
  "AI Tools": "#a78bfa",
  Cloud: "#38bdf8",
  Education: "#22d3ee",
  Fitness: "#f472b6",
  News: "#fbbf24",
  Storage: "#fb923c",
  VPN: "#4ade80",
  "Developer Tools": "#2dd4bf",
  "Design Tools": "#c084fc",
  "Business SaaS": "#f97316",
  Productivity: "#67e8f9",
  Other: "#6b7280",
};

// ===== Fallback Subscription Catalog =====
// Used when the Supabase catalog tables are unavailable

// Helper to generate favicon URL from domain
const favicon = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

export const FALLBACK_SUBSCRIPTION_SERVICES: SubscriptionService[] = [
  { id: "fb-netflix", name: "Netflix", slug: "netflix", domain: "netflix.com", category: "Streaming", website: "https://netflix.com", logo_url: favicon("netflix.com"), created_at: "" },
  { id: "fb-spotify", name: "Spotify", slug: "spotify", domain: "spotify.com", category: "Music", website: "https://spotify.com", logo_url: favicon("spotify.com"), created_at: "" },
  { id: "fb-youtube-premium", name: "YouTube Premium", slug: "youtube-premium", domain: "youtube.com", category: "Streaming", website: "https://youtube.com/premium", logo_url: favicon("youtube.com"), created_at: "" },
  { id: "fb-disney-plus", name: "Disney+", slug: "disney-plus", domain: "disneyplus.com", category: "Streaming", website: "https://disneyplus.com", logo_url: favicon("disneyplus.com"), created_at: "" },
  { id: "fb-hulu", name: "Hulu", slug: "hulu", domain: "hulu.com", category: "Streaming", website: "https://hulu.com", logo_url: favicon("hulu.com"), created_at: "" },
  { id: "fb-hbo-max", name: "Max (HBO)", slug: "hbo-max", domain: "max.com", category: "Streaming", website: "https://max.com", logo_url: favicon("max.com"), created_at: "" },
  { id: "fb-apple-tv", name: "Apple TV+", slug: "apple-tv", domain: "tv.apple.com", category: "Streaming", website: "https://tv.apple.com", logo_url: favicon("tv.apple.com"), created_at: "" },
  { id: "fb-amazon-prime", name: "Amazon Prime", slug: "amazon-prime", domain: "amazon.com", category: "Streaming", website: "https://amazon.com/prime", logo_url: favicon("amazon.com"), created_at: "" },
  { id: "fb-peacock", name: "Peacock", slug: "peacock", domain: "peacocktv.com", category: "Streaming", website: "https://peacocktv.com", logo_url: favicon("peacocktv.com"), created_at: "" },
  { id: "fb-paramount-plus", name: "Paramount+", slug: "paramount-plus", domain: "paramountplus.com", category: "Streaming", website: "https://paramountplus.com", logo_url: favicon("paramountplus.com"), created_at: "" },
  { id: "fb-apple-music", name: "Apple Music", slug: "apple-music", domain: "music.apple.com", category: "Music", website: "https://music.apple.com", logo_url: favicon("music.apple.com"), created_at: "" },
  { id: "fb-tidal", name: "Tidal", slug: "tidal", domain: "tidal.com", category: "Music", website: "https://tidal.com", logo_url: favicon("tidal.com"), created_at: "" },
  { id: "fb-chatgpt", name: "ChatGPT Plus", slug: "chatgpt", domain: "openai.com", category: "AI Tools", website: "https://chat.openai.com", logo_url: favicon("openai.com"), created_at: "" },
  { id: "fb-claude", name: "Claude Pro", slug: "claude", domain: "anthropic.com", category: "AI Tools", website: "https://claude.ai", logo_url: favicon("claude.ai"), created_at: "" },
  { id: "fb-midjourney", name: "Midjourney", slug: "midjourney", domain: "midjourney.com", category: "AI Tools", website: "https://midjourney.com", logo_url: favicon("midjourney.com"), created_at: "" },
  { id: "fb-github-copilot", name: "GitHub Copilot", slug: "github-copilot", domain: "github.com", category: "Developer Tools", website: "https://github.com/features/copilot", logo_url: favicon("github.com"), created_at: "" },
  { id: "fb-notion", name: "Notion", slug: "notion", domain: "notion.so", category: "Productivity", website: "https://notion.so", logo_url: favicon("notion.so"), created_at: "" },
  { id: "fb-figma", name: "Figma", slug: "figma", domain: "figma.com", category: "Design Tools", website: "https://figma.com", logo_url: favicon("figma.com"), created_at: "" },
  { id: "fb-adobe-cc", name: "Adobe Creative Cloud", slug: "adobe-cc", domain: "adobe.com", category: "Design Tools", website: "https://adobe.com/creativecloud", logo_url: favicon("adobe.com"), created_at: "" },
  { id: "fb-canva", name: "Canva Pro", slug: "canva", domain: "canva.com", category: "Design Tools", website: "https://canva.com", logo_url: favicon("canva.com"), created_at: "" },
  { id: "fb-dropbox", name: "Dropbox", slug: "dropbox", domain: "dropbox.com", category: "Storage", website: "https://dropbox.com", logo_url: favicon("dropbox.com"), created_at: "" },
  { id: "fb-google-one", name: "Google One", slug: "google-one", domain: "one.google.com", category: "Cloud", website: "https://one.google.com", logo_url: favicon("one.google.com"), created_at: "" },
  { id: "fb-icloud", name: "iCloud+", slug: "icloud", domain: "icloud.com", category: "Cloud", website: "https://icloud.com", logo_url: favicon("icloud.com"), created_at: "" },
  { id: "fb-microsoft-365", name: "Microsoft 365", slug: "microsoft-365", domain: "microsoft.com", category: "Productivity", website: "https://microsoft.com/microsoft-365", logo_url: favicon("microsoft.com"), created_at: "" },
  { id: "fb-xbox-gamepass", name: "Xbox Game Pass", slug: "xbox-gamepass", domain: "xbox.com", category: "Gaming", website: "https://xbox.com/gamepass", logo_url: favicon("xbox.com"), created_at: "" },
  { id: "fb-playstation-plus", name: "PlayStation Plus", slug: "playstation-plus", domain: "playstation.com", category: "Gaming", website: "https://playstation.com", logo_url: favicon("playstation.com"), created_at: "" },
  { id: "fb-nintendo-online", name: "Nintendo Switch Online", slug: "nintendo-online", domain: "nintendo.com", category: "Gaming", website: "https://nintendo.com/switch/online", logo_url: favicon("nintendo.com"), created_at: "" },
  { id: "fb-nordvpn", name: "NordVPN", slug: "nordvpn", domain: "nordvpn.com", category: "VPN", website: "https://nordvpn.com", logo_url: favicon("nordvpn.com"), created_at: "" },
  { id: "fb-expressvpn", name: "ExpressVPN", slug: "expressvpn", domain: "expressvpn.com", category: "VPN", website: "https://expressvpn.com", logo_url: favicon("expressvpn.com"), created_at: "" },
  { id: "fb-nyt", name: "New York Times", slug: "nyt", domain: "nytimes.com", category: "News", website: "https://nytimes.com", logo_url: favicon("nytimes.com"), created_at: "" },
  { id: "fb-wsj", name: "Wall Street Journal", slug: "wsj", domain: "wsj.com", category: "News", website: "https://wsj.com", logo_url: favicon("wsj.com"), created_at: "" },
  { id: "fb-linkedin-premium", name: "LinkedIn Premium", slug: "linkedin-premium", domain: "linkedin.com", category: "Business SaaS", website: "https://linkedin.com/premium", logo_url: favicon("linkedin.com"), created_at: "" },
  { id: "fb-slack", name: "Slack", slug: "slack", domain: "slack.com", category: "Productivity", website: "https://slack.com", logo_url: favicon("slack.com"), created_at: "" },
  { id: "fb-zoom", name: "Zoom", slug: "zoom", domain: "zoom.us", category: "Productivity", website: "https://zoom.us", logo_url: favicon("zoom.us"), created_at: "" },
  { id: "fb-crunchyroll", name: "Crunchyroll", slug: "crunchyroll", domain: "crunchyroll.com", category: "Streaming", website: "https://crunchyroll.com", logo_url: favicon("crunchyroll.com"), created_at: "" },
  { id: "fb-audible", name: "Audible", slug: "audible", domain: "audible.com", category: "Education", website: "https://audible.com", logo_url: favicon("audible.com"), created_at: "" },
  { id: "fb-duolingo", name: "Duolingo Plus", slug: "duolingo", domain: "duolingo.com", category: "Education", website: "https://duolingo.com", logo_url: favicon("duolingo.com"), created_at: "" },
  { id: "fb-peloton", name: "Peloton", slug: "peloton", domain: "onepeloton.com", category: "Fitness", website: "https://onepeloton.com", logo_url: favicon("onepeloton.com"), created_at: "" },
  { id: "fb-strava", name: "Strava", slug: "strava", domain: "strava.com", category: "Fitness", website: "https://strava.com", logo_url: favicon("strava.com"), created_at: "" },
  { id: "fb-github-pro", name: "GitHub Pro", slug: "github-pro", domain: "github.com", category: "Developer Tools", website: "https://github.com", logo_url: favicon("github.com"), created_at: "" },
  { id: "fb-vercel", name: "Vercel Pro", slug: "vercel", domain: "vercel.com", category: "Developer Tools", website: "https://vercel.com", logo_url: favicon("vercel.com"), created_at: "" },
  { id: "fb-1password", name: "1Password", slug: "1password", domain: "1password.com", category: "Software", website: "https://1password.com", logo_url: favicon("1password.com"), created_at: "" },
  { id: "fb-grammarly", name: "Grammarly", slug: "grammarly", domain: "grammarly.com", category: "Productivity", website: "https://grammarly.com", logo_url: favicon("grammarly.com"), created_at: "" },
];

export const FALLBACK_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  // Netflix
  { id: "fp-netflix-ads", service_id: "fb-netflix", name: "Standard with Ads", price: 6.99, currency: "USD", billing_cycle: "monthly", description: null, created_at: "" },
  { id: "fp-netflix-standard", service_id: "fb-netflix", name: "Standard", price: 15.49, currency: "USD", billing_cycle: "monthly", description: null, created_at: "" },
  { id: "fp-netflix-premium", service_id: "fb-netflix", name: "Premium", price: 22.99, currency: "USD", billing_cycle: "monthly", description: null, created_at: "" },
  // Spotify
  { id: "fp-spotify-individual", service_id: "fb-spotify", name: "Individual", price: 11.99, currency: "USD", billing_cycle: "monthly", description: null, created_at: "" },
  { id: "fp-spotify-duo", service_id: "fb-spotify", name: "Duo", price: 16.99, currency: "USD", billing_cycle: "monthly", description: null, created_at: "" },
  { id: "fp-spotify-family", service_id: "fb-spotify", name: "Family", price: 19.99, currency: "USD", billing_cycle: "monthly", description: null, created_at: "" },
  // YouTube Premium
  { id: "fp-youtube-individual", service_id: "fb-youtube-premium", name: "Individual", price: 13.99, currency: "USD", billing_cycle: "monthly", description: null, created_at: "" },
  { id: "fp-youtube-family", service_id: "fb-youtube-premium", name: "Family", price: 22.99, currency: "USD", billing_cycle: "monthly", description: null, created_at: "" },
  // Disney+
  { id: "fp-disney-basic", service_id: "fb-disney-plus", name: "Basic", price: 7.99, currency: "USD", billing_cycle: "monthly", description: null, created_at: "" },
  { id: "fp-disney-premium", service_id: "fb-disney-plus", name: "Premium", price: 13.99, currency: "USD", billing_cycle: "monthly", description: null, created_at: "" },
  // ChatGPT
  { id: "fp-chatgpt-plus", service_id: "fb-chatgpt", name: "Plus", price: 20.00, currency: "USD", billing_cycle: "monthly", description: null, created_at: "" },
  { id: "fp-chatgpt-pro", service_id: "fb-chatgpt", name: "Pro", price: 200.00, currency: "USD", billing_cycle: "monthly", description: null, created_at: "" },
  // Claude
  { id: "fp-claude-pro", service_id: "fb-claude", name: "Pro", price: 20.00, currency: "USD", billing_cycle: "monthly", description: null, created_at: "" },
  // GitHub Copilot
  { id: "fp-copilot-ind", service_id: "fb-github-copilot", name: "Individual", price: 10.00, currency: "USD", billing_cycle: "monthly", description: null, created_at: "" },
  // Apple Music
  { id: "fp-apple-music-ind", service_id: "fb-apple-music", name: "Individual", price: 10.99, currency: "USD", billing_cycle: "monthly", description: null, created_at: "" },
  { id: "fp-apple-music-family", service_id: "fb-apple-music", name: "Family", price: 16.99, currency: "USD", billing_cycle: "monthly", description: null, created_at: "" },
  // Amazon Prime
  { id: "fp-prime-monthly", service_id: "fb-amazon-prime", name: "Monthly", price: 14.99, currency: "USD", billing_cycle: "monthly", description: null, created_at: "" },
  { id: "fp-prime-yearly", service_id: "fb-amazon-prime", name: "Annual", price: 139.00, currency: "USD", billing_cycle: "yearly", description: null, created_at: "" },
  // Xbox Game Pass
  { id: "fp-xbox-core", service_id: "fb-xbox-gamepass", name: "Core", price: 9.99, currency: "USD", billing_cycle: "monthly", description: null, created_at: "" },
  { id: "fp-xbox-ultimate", service_id: "fb-xbox-gamepass", name: "Ultimate", price: 19.99, currency: "USD", billing_cycle: "monthly", description: null, created_at: "" },
  // Notion
  { id: "fp-notion-plus", service_id: "fb-notion", name: "Plus", price: 10.00, currency: "USD", billing_cycle: "monthly", description: null, created_at: "" },
  // Microsoft 365
  { id: "fp-ms365-personal", service_id: "fb-microsoft-365", name: "Personal", price: 6.99, currency: "USD", billing_cycle: "monthly", description: null, created_at: "" },
  { id: "fp-ms365-family", service_id: "fb-microsoft-365", name: "Family", price: 9.99, currency: "USD", billing_cycle: "monthly", description: null, created_at: "" },
  // Adobe CC
  { id: "fp-adobe-all-apps", service_id: "fb-adobe-cc", name: "All Apps", price: 59.99, currency: "USD", billing_cycle: "monthly", description: null, created_at: "" },
  { id: "fp-adobe-photography", service_id: "fb-adobe-cc", name: "Photography", price: 9.99, currency: "USD", billing_cycle: "monthly", description: null, created_at: "" },
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
  { id: "skills", label: "Skills" },
  { id: "quiz", label: "Quiz" },
  { id: "planner", label: "Planner" },
  { id: "github", label: "GitHub" },
  { id: "leetcode", label: "LeetCode" },
  { id: "files", label: "Files" },
] as const;

// ===== Skill Tree Constants =====

export const SKILL_CATEGORIES: string[] = [
  "Programming", "Data", "AI/ML", "DevOps", "Design", "Math", "Domain",
];

export const SKILL_LEVELS: string[] = [
  "Beginner", "Elementary", "Intermediate", "Advanced", "Expert",
];

export const XP_PER_LEVEL: number[] = [0, 100, 300, 600, 1000];

export const SKILL_CATEGORY_COLORS: Record<string, string> = {
  Programming: "#3b82f6",
  Data: "#06b6d4",
  "AI/ML": "#a855f7",
  DevOps: "#f97316",
  Design: "#ec4899",
  Math: "#22c55e",
  Domain: "#eab308",
};

export const SUBJECT_TO_SKILL_CATEGORY: Record<string, string> = {
  Python: "Programming",
  JavaScript: "Programming",
  TypeScript: "Programming",
  React: "Programming",
  "Next.js": "Programming",
  "Data Science": "Data",
  "Machine Learning": "AI/ML",
  "System Design": "Programming",
  DSA: "Programming",
  DevOps: "DevOps",
  Databases: "Data",
  Math: "Math",
  Finance: "Domain",
  Other: "Domain",
};

export const RESOURCE_TYPE_ICONS: Record<string, string> = {
  video: "V",
  article: "A",
  code: "C",
  dataset: "D",
  pdf: "P",
  other: "O",
};

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

// ===== Habit Tracker Constants =====

export const HABIT_CATEGORIES: HabitCategory[] = [
  "Health", "Learning", "Productivity", "Personal",
];

export const HABIT_CATEGORY_COLORS: Record<HabitCategory, string> = {
  Health: "#10b981",
  Learning: "#3b82f6",
  Productivity: "#f59e0b",
  Personal: "#8b5cf6",
};

export const HABIT_CATEGORY_ICONS: Record<HabitCategory, string> = {
  Health: "Heart",
  Learning: "BookOpen",
  Productivity: "Target",
  Personal: "Star",
};

export const HABIT_DIFFICULTY_XP: Record<HabitDifficulty, number> = {
  easy: 10,
  medium: 25,
  hard: 50,
};

export const HABIT_DIFFICULTY_LABELS: Record<HabitDifficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export const HABIT_STREAK_BADGES = [
  { days: 7, type: "bronze" as const, label: "7-Day Streak", color: "#cd7f32" },
  { days: 30, type: "silver" as const, label: "30-Day Streak", color: "#c0c0c0" },
  { days: 100, type: "gold" as const, label: "100-Day Streak", color: "#ffd700" },
];

export const HABIT_XP_PER_LEVEL: number[] = [0, 100, 300, 600, 1000];

export const HABIT_TABS = [
  { id: "overview", label: "Overview" },
  { id: "daily", label: "Daily Tracker" },
  { id: "weekly", label: "Weekly Goals" },
  { id: "chains", label: "Routines" },
  { id: "calendar", label: "Calendar" },
  { id: "analytics", label: "Analytics" },
  { id: "xp", label: "XP & Levels" },
  { id: "coach", label: "AI Coach" },
] as const;

export type HabitTabId = (typeof HABIT_TABS)[number]["id"];

