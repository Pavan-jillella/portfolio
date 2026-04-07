// Email template utilities and shared styles
// Matches the website's elegant editorial theme

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

// Matches website's dark mode colors
export const COLORS = {
  // Backgrounds
  bgDark: "#1a1a18",
  bgCard: "#232320",
  bgCardLight: "#2d2d2a",
  
  // Borders
  border: "rgba(255, 255, 255, 0.08)",
  borderSolid: "#3a3a36",
  
  // Text
  textPrimary: "#f8f5f0",
  textSecondary: "#a8a5a0",
  textMuted: "#6b6b68",
  
  // Accents (matching website)
  accentGold: "#c9a96e",
  accentTaupe: "#8b7355",
  accentSage: "#7a9e7a",
  accentBlue: "#6b9bd1",
};

// Web-safe fonts that match website feel
export const FONTS = {
  display: "Georgia, 'Times New Roman', serif", // Similar to Cormorant Garamond
  body: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", // Similar to Outfit
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
