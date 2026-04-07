// Email template: Notification sent to Pavan when someone submits contact form
// Matches website's elegant editorial dark theme

import { COLORS, EMAIL_CONFIG, FONTS, formatDate } from "./shared";

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
<body style="margin: 0; padding: 0; background-color: ${COLORS.bgDark}; font-family: ${FONTS.body};">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${COLORS.bgDark};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <!-- Container -->
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <h1 style="margin: 0; font-family: ${FONTS.display}; font-size: 28px; font-weight: 400; color: ${COLORS.textPrimary}; letter-spacing: -0.5px;">New Message</h1>
              <p style="margin: 8px 0 0 0; font-size: 13px; color: ${COLORS.accentGold}; letter-spacing: 2px; text-transform: uppercase;">Portfolio Contact</p>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background-color: ${COLORS.bgCard}; border: 1px solid ${COLORS.borderSolid}; border-radius: 12px; padding: 32px;">
              
              <!-- Sender Info -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${COLORS.bgCardLight}; border: 1px solid ${COLORS.borderSolid}; border-radius: 10px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 24px;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="vertical-align: middle; padding-right: 20px;">
                          <table role="presentation" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width: 60px; height: 60px; background-color: ${COLORS.accentGold}; border-radius: 30px; text-align: center; vertical-align: middle;">
                                <span style="font-family: ${FONTS.display}; font-size: 26px; font-weight: 500; color: ${COLORS.bgDark};">${initial}</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td style="vertical-align: middle;">
                          <p style="margin: 0 0 6px 0; font-family: ${FONTS.display}; font-size: 22px; font-weight: 400; color: ${COLORS.textPrimary};">${senderName}</p>
                          <a href="mailto:${senderEmail}" style="font-size: 14px; color: ${COLORS.accentGold}; text-decoration: none;">${senderEmail}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message Label -->
              <p style="margin: 0 0 12px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: ${COLORS.accentTaupe};">Message</p>
              
              <!-- Message Box -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px;">
                <tr>
                  <td style="background-color: ${COLORS.bgCardLight}; border-left: 3px solid ${COLORS.accentGold}; padding: 24px; border-radius: 0 10px 10px 0;">
                    <p style="margin: 0; font-family: ${FONTS.display}; font-size: 16px; line-height: 1.8; color: ${COLORS.textPrimary}; font-style: italic;">${message}</p>
                  </td>
                </tr>
              </table>

              <!-- Timestamp -->
              <p style="margin: 0; font-size: 12px; color: ${COLORS.textMuted}; text-align: right;">${timestamp}</p>

              <!-- Divider -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 28px 0;">
                <tr>
                  <td style="height: 1px; background-color: ${COLORS.borderSolid};"></td>
                </tr>
              </table>

              <!-- Actions -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="mailto:${senderEmail}?subject=Re: Your message on my portfolio" style="display: inline-block; padding: 16px 36px; background-color: ${COLORS.accentGold}; color: ${COLORS.bgDark}; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 14px; letter-spacing: 0.5px;">Reply to ${senderName.split(' ')[0]}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top: 32px;">
              <p style="margin: 0 0 8px 0; font-family: ${FONTS.display}; font-size: 18px; color: ${COLORS.textPrimary};">${EMAIL_CONFIG.name}</p>
              <p style="margin: 0; font-size: 12px; color: ${COLORS.textMuted};">Sent via portfolio contact form</p>
              <p style="margin: 12px 0 0 0; font-size: 12px; color: ${COLORS.accentTaupe};">${EMAIL_CONFIG.portfolioUrl.replace('https://', '')}</p>
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
