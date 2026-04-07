// Email template utilities and shared styles

export const EMAIL_CONFIG = {
  name: "Pavan Jillella",
  title: "Data Analyst",
  company: "Morgan Stanley",
  email: "pavan.jillella@example.com",
  location: "United States",
  photoUrl: "https://avatars.githubusercontent.com/Pavan-jillella",
  portfolioUrl: "https://pavanjillella.com",
  linkedInUrl: "https://linkedin.com/in/pavanjillella",
  githubUrl: "https://github.com/Pavan-jillella",
  responseTime: "24-48 hours",
};

export const COLORS = {
  bgDark: "#0a0c12",
  bgCard: "#12141a",
  border: "#1e2028",
  textPrimary: "#ffffff",
  textSecondary: "#9ca3af",
  textMuted: "#6b7280",
  accentBlue: "#3b82f6",
  accentGold: "#c9a96e",
  accentGreen: "#34d399",
};

export function formatDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
}
