// Email template: Confirmation sent to the person who submitted the contact form

import { COLORS, BASE_STYLES, EMAIL_CONFIG } from "./shared";

interface ContactConfirmationProps {
  senderName: string;
}

export function generateContactConfirmationEmail({
  senderName,
}: ContactConfirmationProps): string {
  const firstName = senderName.split(' ')[0];
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thanks for reaching out!</title>
  <style>${BASE_STYLES}</style>
</head>
<body>
  <div class="container">
    <!-- Header with Photo -->
    <div class="header">
      <img 
        src="${EMAIL_CONFIG.photoUrl}" 
        alt="${EMAIL_CONFIG.name}"
        class="avatar"
        style="width: 100px; height: 100px;"
      />
      <h1 class="name">${EMAIL_CONFIG.name}</h1>
      <p class="title">${EMAIL_CONFIG.title} @ ${EMAIL_CONFIG.company}</p>
    </div>

    <!-- Main Card -->
    <div class="card">
      <!-- Greeting -->
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="
          display: inline-block;
          font-size: 48px;
          margin-bottom: 16px;
        ">👋</div>
        <h2 style="
          font-size: 28px;
          font-weight: 600;
          color: ${COLORS.textPrimary};
          margin: 0 0 8px 0;
        ">Thanks for reaching out, ${firstName}!</h2>
        <p style="
          font-size: 16px;
          color: ${COLORS.textSecondary};
          margin: 0;
        ">I've received your message and will get back to you soon.</p>
      </div>

      <div class="divider"></div>

      <!-- Response Time -->
      <div style="
        background: linear-gradient(135deg, ${COLORS.accentGold}15 0%, ${COLORS.accentGold}05 100%);
        border: 1px solid ${COLORS.accentGold}30;
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        margin-bottom: 24px;
      ">
        <div style="font-size: 12px; color: ${COLORS.textMuted}; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
          ⏱️ Expected Response Time
        </div>
        <div style="font-size: 24px; font-weight: 600; color: ${COLORS.accentGold};">
          ${EMAIL_CONFIG.responseTime}
        </div>
      </div>

      <!-- About Me Section -->
      <div class="label">A Little About Me</div>
      <p style="color: ${COLORS.textSecondary}; margin: 8px 0 24px 0; font-size: 14px; line-height: 1.7;">
        I'm a ${EMAIL_CONFIG.title} at ${EMAIL_CONFIG.company}, passionate about transforming 
        complex data into actionable insights. I specialize in Python, SQL, Machine Learning, 
        and cloud technologies. I love connecting with like-minded professionals and exploring 
        new opportunities.
      </p>

      <div class="divider"></div>

      <!-- Contact Info -->
      <div class="label">Let's Connect</div>
      <div style="margin-top: 16px;">
        <div style="display: flex; align-items: center; margin-bottom: 12px;">
          <span style="width: 32px; height: 32px; background: ${COLORS.bgCard}; border: 1px solid ${COLORS.border}; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 14px;">🌐</span>
          <a href="${EMAIL_CONFIG.portfolioUrl}" style="color: ${COLORS.accentBlue}; text-decoration: none; font-size: 14px;">${EMAIL_CONFIG.portfolioUrl.replace('https://', '')}</a>
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 12px;">
          <span style="width: 32px; height: 32px; background: ${COLORS.bgCard}; border: 1px solid ${COLORS.border}; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 14px;">💼</span>
          <a href="${EMAIL_CONFIG.linkedInUrl}" style="color: ${COLORS.accentBlue}; text-decoration: none; font-size: 14px;">LinkedIn Profile</a>
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 12px;">
          <span style="width: 32px; height: 32px; background: ${COLORS.bgCard}; border: 1px solid ${COLORS.border}; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 14px;">💻</span>
          <a href="${EMAIL_CONFIG.githubUrl}" style="color: ${COLORS.accentBlue}; text-decoration: none; font-size: 14px;">GitHub Profile</a>
        </div>
      </div>
    </div>

    <!-- CTA Card -->
    <div class="glass-card" style="text-align: center;">
      <p style="color: ${COLORS.textSecondary}; margin: 0 0 16px 0; font-size: 14px;">
        In the meantime, feel free to explore my work
      </p>
      <a href="${EMAIL_CONFIG.portfolioUrl}/projects" class="btn" style="margin: 0;">
        🚀 View My Projects
      </a>
    </div>

    <!-- Social Links -->
    <div class="social-links" style="margin-top: 32px;">
      <a href="${EMAIL_CONFIG.linkedInUrl}" class="social-link" title="LinkedIn">in</a>
      <a href="${EMAIL_CONFIG.githubUrl}" class="social-link" title="GitHub">GH</a>
      <a href="${EMAIL_CONFIG.portfolioUrl}" class="social-link" title="Portfolio">🌐</a>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p style="font-size: 14px; color: ${COLORS.textPrimary}; margin: 0 0 4px 0; font-weight: 500;">
        ${EMAIL_CONFIG.name}
      </p>
      <p class="footer-text">${EMAIL_CONFIG.title} @ ${EMAIL_CONFIG.company}</p>
      <p class="footer-text" style="margin-top: 16px;">
        📍 ${EMAIL_CONFIG.location}
      </p>
      <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid ${COLORS.border};">
        <p class="footer-text" style="font-size: 11px;">
          This is an automated confirmation. Please don't reply to this email.
        </p>
        <p class="footer-text" style="font-size: 11px; color: ${COLORS.accentGold};">
          © ${new Date().getFullYear()} ${EMAIL_CONFIG.name}. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;
}
