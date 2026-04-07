// Email template: Confirmation sent to the person who submitted the contact form
// Uses table-based layout for maximum email client compatibility

import { COLORS, EMAIL_CONFIG } from "./shared";

interface ContactConfirmationProps {
  senderName: string;
}

export function generateContactConfirmationEmail({
  senderName,
}: ContactConfirmationProps): string {
  const firstName = senderName.split(' ')[0];
  const year = new Date().getFullYear();
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Thanks for reaching out!</title>
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
          
          <!-- Header with Photo -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <img 
                src="${EMAIL_CONFIG.photoUrl}" 
                alt="${EMAIL_CONFIG.name}"
                width="100"
                height="100"
                style="width: 100px; height: 100px; border-radius: 50%; border: 3px solid ${COLORS.accentGold}; display: block;"
              />
              <h1 style="margin: 16px 0 4px 0; font-size: 24px; font-weight: 600; color: ${COLORS.textPrimary};">${EMAIL_CONFIG.name}</h1>
              <p style="margin: 0; font-size: 14px; color: ${COLORS.accentGold}; letter-spacing: 0.5px;">${EMAIL_CONFIG.title} @ ${EMAIL_CONFIG.company}</p>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background-color: ${COLORS.bgCard}; border: 1px solid ${COLORS.border}; border-radius: 16px; padding: 32px;">
              
              <!-- Greeting -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 32px;">
                    <span style="font-size: 48px; display: block; margin-bottom: 16px;">👋</span>
                    <h2 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 600; color: ${COLORS.textPrimary};">Thanks for reaching out, ${firstName}!</h2>
                    <p style="margin: 0; font-size: 16px; color: ${COLORS.textSecondary};">I've received your message and will get back to you soon.</p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td style="height: 1px; background-color: ${COLORS.border};"></td>
                </tr>
              </table>

              <!-- Response Time -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: rgba(201, 169, 110, 0.1); border: 1px solid rgba(201, 169, 110, 0.25); border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td align="center" style="padding: 20px;">
                    <p style="margin: 0 0 8px 0; font-size: 12px; color: ${COLORS.textMuted}; text-transform: uppercase; letter-spacing: 1.5px;">⏱️ Expected Response Time</p>
                    <p style="margin: 0; font-size: 24px; font-weight: 600; color: ${COLORS.accentGold};">${EMAIL_CONFIG.responseTime}</p>
                  </td>
                </tr>
              </table>

              <!-- About Me -->
              <p style="margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: ${COLORS.textMuted};">A Little About Me</p>
              <p style="margin: 0 0 24px 0; color: ${COLORS.textSecondary}; font-size: 14px; line-height: 1.7;">
                I'm a ${EMAIL_CONFIG.title} at ${EMAIL_CONFIG.company}, passionate about transforming 
                complex data into actionable insights. I specialize in Python, SQL, Machine Learning, 
                and cloud technologies. I love connecting with like-minded professionals and exploring 
                new opportunities.
              </p>

              <!-- Divider -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td style="height: 1px; background-color: ${COLORS.border};"></td>
                </tr>
              </table>

              <!-- Contact Info -->
              <p style="margin: 0 0 16px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: ${COLORS.textMuted};">Let's Connect</p>
              
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding: 12px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 32px; height: 32px; background-color: ${COLORS.bgDark}; border: 1px solid ${COLORS.border}; border-radius: 8px; text-align: center; vertical-align: middle;">🌐</td>
                        <td style="padding-left: 12px;">
                          <a href="${EMAIL_CONFIG.portfolioUrl}" style="color: ${COLORS.accentBlue}; text-decoration: none; font-size: 14px;">${EMAIL_CONFIG.portfolioUrl.replace('https://', '')}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 32px; height: 32px; background-color: ${COLORS.bgDark}; border: 1px solid ${COLORS.border}; border-radius: 8px; text-align: center; vertical-align: middle;">💼</td>
                        <td style="padding-left: 12px;">
                          <a href="${EMAIL_CONFIG.linkedInUrl}" style="color: ${COLORS.accentBlue}; text-decoration: none; font-size: 14px;">LinkedIn Profile</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 32px; height: 32px; background-color: ${COLORS.bgDark}; border: 1px solid ${COLORS.border}; border-radius: 8px; text-align: center; vertical-align: middle;">💻</td>
                        <td style="padding-left: 12px;">
                          <a href="${EMAIL_CONFIG.githubUrl}" style="color: ${COLORS.accentBlue}; text-decoration: none; font-size: 14px;">GitHub Profile</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Card -->
          <tr>
            <td style="padding-top: 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${COLORS.bgCard}; border: 1px solid ${COLORS.border}; border-radius: 16px;">
                <tr>
                  <td align="center" style="padding: 24px;">
                    <p style="margin: 0 0 16px 0; color: ${COLORS.textSecondary}; font-size: 14px;">In the meantime, feel free to explore my work</p>
                    <a href="${EMAIL_CONFIG.portfolioUrl}/projects" style="display: inline-block; padding: 14px 32px; background-color: ${COLORS.accentBlue}; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 14px;">🚀 View My Projects</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Social Links -->
          <tr>
            <td align="center" style="padding: 32px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 0 8px;">
                    <a href="${EMAIL_CONFIG.linkedInUrl}" style="display: inline-block; width: 40px; height: 40px; line-height: 40px; background-color: ${COLORS.bgCard}; border: 1px solid ${COLORS.border}; border-radius: 20px; text-align: center; color: ${COLORS.textSecondary}; text-decoration: none; font-size: 14px;">in</a>
                  </td>
                  <td style="padding: 0 8px;">
                    <a href="${EMAIL_CONFIG.githubUrl}" style="display: inline-block; width: 40px; height: 40px; line-height: 40px; background-color: ${COLORS.bgCard}; border: 1px solid ${COLORS.border}; border-radius: 20px; text-align: center; color: ${COLORS.textSecondary}; text-decoration: none; font-size: 14px;">GH</a>
                  </td>
                  <td style="padding: 0 8px;">
                    <a href="${EMAIL_CONFIG.portfolioUrl}" style="display: inline-block; width: 40px; height: 40px; line-height: 40px; background-color: ${COLORS.bgCard}; border: 1px solid ${COLORS.border}; border-radius: 20px; text-align: center; color: ${COLORS.textSecondary}; text-decoration: none; font-size: 14px;">🌐</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top: 24px; border-top: 1px solid ${COLORS.border};">
              <p style="margin: 0 0 4px 0; font-size: 14px; color: ${COLORS.textPrimary}; font-weight: 500;">${EMAIL_CONFIG.name}</p>
              <p style="margin: 0 0 16px 0; font-size: 12px; color: ${COLORS.textMuted};">${EMAIL_CONFIG.title} @ ${EMAIL_CONFIG.company}</p>
              <p style="margin: 0 0 24px 0; font-size: 12px; color: ${COLORS.textMuted};">📍 ${EMAIL_CONFIG.location}</p>
              
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid ${COLORS.border}; padding-top: 24px;">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 4px 0; font-size: 11px; color: ${COLORS.textMuted};">This is an automated confirmation. Please don't reply to this email.</p>
                    <p style="margin: 0; font-size: 11px; color: ${COLORS.accentGold};">© ${year} ${EMAIL_CONFIG.name}. All rights reserved.</p>
                  </td>
                </tr>
              </table>
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
