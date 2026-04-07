// Email template utilities and shared styles

export const EMAIL_CONFIG = {
  name: "Pavan Jillella",
  title: "Data Analyst",
  company: "Morgan Stanley",
  email: "pavan.jillella@example.com",
  phone: "+1 (XXX) XXX-XXXX",
  location: "United States",
  photoUrl: "https://avatars.githubusercontent.com/u/your-github-id", // Replace with actual
  portfolioUrl: "https://pavanjillella.com",
  linkedInUrl: "https://linkedin.com/in/pavanjillella",
  githubUrl: "https://github.com/Pavan-jillella",
  responseTime: "24-48 hours",
};

export const COLORS = {
  // Dark theme
  bgDark: "#0a0c12",
  bgCard: "#12141a",
  bgCardHover: "#1a1d24",
  border: "rgba(255, 255, 255, 0.08)",
  borderLight: "rgba(255, 255, 255, 0.12)",
  
  // Text
  textPrimary: "#ffffff",
  textSecondary: "#a0a0a0",
  textMuted: "#6b7280",
  
  // Accents
  accentBlue: "#3b82f6",
  accentGold: "#c9a96e",
  accentGreen: "#34d399",
  accentPurple: "#a78bfa",
};

export const BASE_STYLES = `
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: ${COLORS.bgDark};
    color: ${COLORS.textPrimary};
    line-height: 1.6;
  }
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 40px 20px;
  }
  .card {
    background: ${COLORS.bgCard};
    border: 1px solid ${COLORS.border};
    border-radius: 16px;
    padding: 32px;
    margin-bottom: 24px;
  }
  .glass-card {
    background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
    border: 1px solid ${COLORS.border};
    border-radius: 16px;
    padding: 24px;
    backdrop-filter: blur(10px);
  }
  .header {
    text-align: center;
    margin-bottom: 32px;
  }
  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 3px solid ${COLORS.accentGold};
    margin-bottom: 16px;
  }
  .name {
    font-size: 24px;
    font-weight: 600;
    color: ${COLORS.textPrimary};
    margin: 0 0 4px 0;
  }
  .title {
    font-size: 14px;
    color: ${COLORS.accentGold};
    margin: 0;
    letter-spacing: 0.5px;
  }
  .label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: ${COLORS.textMuted};
    margin-bottom: 8px;
  }
  .value {
    font-size: 16px;
    color: ${COLORS.textPrimary};
  }
  .message-box {
    background: rgba(255,255,255,0.03);
    border-left: 3px solid ${COLORS.accentGold};
    padding: 20px;
    border-radius: 0 12px 12px 0;
    margin: 24px 0;
  }
  .btn {
    display: inline-block;
    padding: 14px 32px;
    background: linear-gradient(135deg, ${COLORS.accentBlue} 0%, #2563eb 100%);
    color: #ffffff;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 500;
    font-size: 14px;
    margin: 8px 8px 8px 0;
  }
  .btn-outline {
    background: transparent;
    border: 1px solid ${COLORS.border};
    color: ${COLORS.textSecondary};
  }
  .social-links {
    text-align: center;
    margin-top: 24px;
  }
  .social-link {
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    margin: 0 8px;
    background: ${COLORS.bgCard};
    border: 1px solid ${COLORS.border};
    border-radius: 50%;
    color: ${COLORS.textSecondary};
    text-decoration: none;
    font-size: 18px;
  }
  .footer {
    text-align: center;
    padding-top: 32px;
    border-top: 1px solid ${COLORS.border};
    margin-top: 32px;
  }
  .footer-text {
    font-size: 12px;
    color: ${COLORS.textMuted};
    margin: 4px 0;
  }
  .divider {
    height: 1px;
    background: ${COLORS.border};
    margin: 24px 0;
  }
  .info-row {
    display: flex;
    margin-bottom: 16px;
  }
  .info-icon {
    width: 20px;
    margin-right: 12px;
    color: ${COLORS.accentGold};
  }
  .timestamp {
    font-size: 12px;
    color: ${COLORS.textMuted};
    text-align: right;
    margin-top: 16px;
  }
`;

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
