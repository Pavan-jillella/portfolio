// Email template: Notification sent to Pavan when someone submits contact form

import { COLORS, BASE_STYLES, EMAIL_CONFIG, formatDate } from "./shared";

interface ContactNotificationProps {
  senderName: string;
  senderEmail: string;
  message: string;
}

export function generateContactNotificationEmail({
  senderName,
  senderEmail,
  message,
}: ContactNotificationProps): string {
  const timestamp = formatDate();
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
  <style>${BASE_STYLES}</style>
</head>
<body>
  <div class="container">
    <!-- Header Badge -->
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="
        display: inline-block;
        padding: 8px 20px;
        background: linear-gradient(135deg, ${COLORS.accentGold}20 0%, ${COLORS.accentGold}10 100%);
        border: 1px solid ${COLORS.accentGold}40;
        border-radius: 20px;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        color: ${COLORS.accentGold};
      ">📬 New Message</span>
    </div>

    <!-- Main Card -->
    <div class="card">
      <!-- Sender Info -->
      <div style="
        background: linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(59,130,246,0.05) 100%);
        border: 1px solid rgba(59,130,246,0.2);
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 24px;
      ">
        <div style="display: flex; align-items: center;">
          <div style="
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, ${COLORS.accentBlue} 0%, ${COLORS.accentPurple} 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: 600;
            color: white;
            margin-right: 16px;
          ">${senderName.charAt(0).toUpperCase()}</div>
          <div>
            <div style="font-size: 18px; font-weight: 600; color: ${COLORS.textPrimary}; margin-bottom: 4px;">
              ${senderName}
            </div>
            <a href="mailto:${senderEmail}" style="
              font-size: 14px;
              color: ${COLORS.accentBlue};
              text-decoration: none;
            ">${senderEmail}</a>
          </div>
        </div>
      </div>

      <!-- Message -->
      <div class="label">Message</div>
      <div class="message-box">
        <p style="margin: 0; color: ${COLORS.textPrimary}; white-space: pre-wrap;">${message}</p>
      </div>

      <!-- Timestamp -->
      <div class="timestamp">
        📅 ${timestamp}
      </div>

      <div class="divider"></div>

      <!-- Quick Actions -->
      <div style="text-align: center;">
        <a href="mailto:${senderEmail}?subject=Re: Your message on my portfolio" class="btn">
          ↩️ Reply Now
        </a>
        <a href="mailto:${senderEmail}" class="btn btn-outline">
          📧 Open in Mail
        </a>
      </div>
    </div>

    <!-- Quick Stats Card -->
    <div class="glass-card" style="display: flex; justify-content: space-around; text-align: center;">
      <div>
        <div style="font-size: 11px; color: ${COLORS.textMuted}; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">From</div>
        <div style="font-size: 14px; color: ${COLORS.textPrimary};">${senderName.split(' ')[0]}</div>
      </div>
      <div style="width: 1px; background: ${COLORS.border};"></div>
      <div>
        <div style="font-size: 11px; color: ${COLORS.textMuted}; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Source</div>
        <div style="font-size: 14px; color: ${COLORS.textPrimary};">Portfolio</div>
      </div>
      <div style="width: 1px; background: ${COLORS.border};"></div>
      <div>
        <div style="font-size: 11px; color: ${COLORS.textMuted}; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Priority</div>
        <div style="font-size: 14px; color: ${COLORS.accentGreen};">● Normal</div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p class="footer-text">This message was sent via your portfolio contact form</p>
      <p class="footer-text" style="color: ${COLORS.accentGold};">${EMAIL_CONFIG.portfolioUrl}</p>
    </div>
  </div>
</body>
</html>
`;
}
