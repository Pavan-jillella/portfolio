// Email template: Notification sent to Pavan when someone submits contact form
// Uses table-based layout for maximum email client compatibility

import { COLORS, EMAIL_CONFIG, formatDate } from "./shared";

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
  const initial = senderName.charAt(0).toUpperCase();
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>New Contact Form Submission</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: ${COLORS.bgDark}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${COLORS.bgDark};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <!-- Container -->
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px;">
          
          <!-- Badge -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color: rgba(201, 169, 110, 0.15); border: 1px solid rgba(201, 169, 110, 0.3); border-radius: 20px; padding: 8px 20px;">
                    <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: ${COLORS.accentGold};">📬 New Message</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background-color: ${COLORS.bgCard}; border: 1px solid ${COLORS.border}; border-radius: 16px; padding: 32px;">
              
              <!-- Sender Info -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="vertical-align: middle; padding-right: 16px;">
                          <table role="presentation" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width: 56px; height: 56px; background: linear-gradient(135deg, ${COLORS.accentBlue}, #8b5cf6); border-radius: 28px; text-align: center; vertical-align: middle;">
                                <span style="font-size: 24px; font-weight: 600; color: white;">${initial}</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td style="vertical-align: middle;">
                          <p style="margin: 0 0 4px 0; font-size: 18px; font-weight: 600; color: ${COLORS.textPrimary};">${senderName}</p>
                          <a href="mailto:${senderEmail}" style="font-size: 14px; color: ${COLORS.accentBlue}; text-decoration: none;">${senderEmail}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message Label -->
              <p style="margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: ${COLORS.textMuted};">Message</p>
              
              <!-- Message Box -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td style="background-color: rgba(255, 255, 255, 0.03); border-left: 3px solid ${COLORS.accentGold}; padding: 20px; border-radius: 0 12px 12px 0;">
                    <p style="margin: 0; color: ${COLORS.textPrimary}; font-size: 15px; line-height: 1.6;">${message}</p>
                  </td>
                </tr>
              </table>

              <!-- Timestamp -->
              <p style="margin: 0; font-size: 12px; color: ${COLORS.textMuted}; text-align: right;">📅 ${timestamp}</p>

              <!-- Divider -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0;">
                <tr>
                  <td style="height: 1px; background-color: ${COLORS.border};"></td>
                </tr>
              </table>

              <!-- Actions -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="mailto:${senderEmail}?subject=Re: Your message on my portfolio" style="display: inline-block; padding: 14px 32px; background-color: ${COLORS.accentBlue}; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 14px; margin-right: 8px;">↩️ Reply Now</a>
                    <a href="mailto:${senderEmail}" style="display: inline-block; padding: 14px 32px; background-color: transparent; border: 1px solid ${COLORS.border}; color: ${COLORS.textSecondary}; text-decoration: none; border-radius: 8px; font-size: 14px;">📧 Open in Mail</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Stats Card -->
          <tr>
            <td style="padding-top: 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${COLORS.bgCard}; border: 1px solid ${COLORS.border}; border-radius: 16px;">
                <tr>
                  <td align="center" style="padding: 20px; border-right: 1px solid ${COLORS.border};">
                    <p style="margin: 0 0 4px 0; font-size: 11px; color: ${COLORS.textMuted}; text-transform: uppercase; letter-spacing: 1px;">From</p>
                    <p style="margin: 0; font-size: 14px; color: ${COLORS.textPrimary};">${senderName.split(' ')[0]}</p>
                  </td>
                  <td align="center" style="padding: 20px; border-right: 1px solid ${COLORS.border};">
                    <p style="margin: 0 0 4px 0; font-size: 11px; color: ${COLORS.textMuted}; text-transform: uppercase; letter-spacing: 1px;">Source</p>
                    <p style="margin: 0; font-size: 14px; color: ${COLORS.textPrimary};">Portfolio</p>
                  </td>
                  <td align="center" style="padding: 20px;">
                    <p style="margin: 0 0 4px 0; font-size: 11px; color: ${COLORS.textMuted}; text-transform: uppercase; letter-spacing: 1px;">Priority</p>
                    <p style="margin: 0; font-size: 14px; color: ${COLORS.accentGreen};">● Normal</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top: 32px; border-top: 1px solid ${COLORS.border}; margin-top: 32px;">
              <p style="margin: 0 0 4px 0; font-size: 12px; color: ${COLORS.textMuted};">This message was sent via your portfolio contact form</p>
              <p style="margin: 0; font-size: 12px; color: ${COLORS.accentGold};">${EMAIL_CONFIG.portfolioUrl}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}
