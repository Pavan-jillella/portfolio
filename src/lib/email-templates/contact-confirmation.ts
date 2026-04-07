// Email template: Confirmation sent to the person who submitted the contact form
// Matches website's elegant editorial dark theme

import { COLORS, EMAIL_CONFIG, FONTS } from "./shared";

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
<body style="margin: 0; padding: 0; background-color: ${COLORS.bgDark}; font-family: ${FONTS.body};">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${COLORS.bgDark};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <!-- Container -->
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px;">
          
          <!-- Header with Photo -->
          <tr>
            <td align="center" style="padding-bottom: 40px;">
              <img 
                src="${EMAIL_CONFIG.photoUrl}" 
                alt="${EMAIL_CONFIG.name}"
                width="100"
                height="100"
                style="width: 100px; height: 100px; border-radius: 50%; border: 3px solid ${COLORS.accentGold}; display: block;"
              />
              <h1 style="margin: 20px 0 6px 0; font-family: ${FONTS.display}; font-size: 28px; font-weight: 400; color: ${COLORS.textPrimary}; letter-spacing: -0.5px;">${EMAIL_CONFIG.name}</h1>
              <p style="margin: 0; font-size: 13px; color: ${COLORS.accentGold}; letter-spacing: 2px; text-transform: uppercase;">${EMAIL_CONFIG.title} · ${EMAIL_CONFIG.company}</p>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background-color: ${COLORS.bgCard}; border: 1px solid ${COLORS.borderSolid}; border-radius: 12px; padding: 40px;">
              
              <!-- Greeting -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 32px;">
                    <h2 style="margin: 0 0 12px 0; font-family: ${FONTS.display}; font-size: 32px; font-weight: 400; color: ${COLORS.textPrimary}; line-height: 1.3;">Thank you for<br/>reaching out, ${firstName}.</h2>
                    <p style="margin: 0; font-size: 16px; color: ${COLORS.textSecondary}; line-height: 1.6;">I've received your message and will get back to you soon.</p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 32px;">
                <tr>
                  <td style="height: 1px; background-color: ${COLORS.borderSolid};"></td>
                </tr>
              </table>

              <!-- Response Time -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${COLORS.bgCardLight}; border: 1px solid ${COLORS.borderSolid}; border-radius: 10px; margin-bottom: 32px;">
                <tr>
                  <td align="center" style="padding: 28px;">
                    <p style="margin: 0 0 8px 0; font-size: 11px; color: ${COLORS.accentTaupe}; text-transform: uppercase; letter-spacing: 2px;">Expected Response</p>
                    <p style="margin: 0; font-family: ${FONTS.display}; font-size: 28px; font-weight: 400; color: ${COLORS.accentGold};">${EMAIL_CONFIG.responseTime}</p>
                  </td>
                </tr>
              </table>

              <!-- About Me -->
              <p style="margin: 0 0 16px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: ${COLORS.accentTaupe};">About Me</p>
              <p style="margin: 0 0 32px 0; color: ${COLORS.textSecondary}; font-size: 15px; line-height: 1.8;">
                I'm a ${EMAIL_CONFIG.title} at ${EMAIL_CONFIG.company}, passionate about transforming 
                complex data into actionable insights. I specialize in Python, SQL, Machine Learning, 
                and cloud technologies.
              </p>

              <!-- Divider -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 32px;">
                <tr>
                  <td style="height: 1px; background-color: ${COLORS.borderSolid};"></td>
                </tr>
              </table>

              <!-- Links -->
              <p style="margin: 0 0 20px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: ${COLORS.accentTaupe};">Connect</p>
              
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding: 14px 0; border-bottom: 1px solid ${COLORS.borderSolid};">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="width: 40px;">
                          <span style="font-size: 18px;">🌐</span>
                        </td>
                        <td>
                          <a href="${EMAIL_CONFIG.portfolioUrl}" style="color: ${COLORS.accentGold}; text-decoration: none; font-size: 15px;">Portfolio</a>
                          <p style="margin: 4px 0 0 0; font-size: 13px; color: ${COLORS.textMuted};">${EMAIL_CONFIG.portfolioUrl.replace('https://', '')}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 0; border-bottom: 1px solid ${COLORS.borderSolid};">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="width: 40px;">
                          <span style="font-size: 18px;">💼</span>
                        </td>
                        <td>
                          <a href="${EMAIL_CONFIG.linkedInUrl}" style="color: ${COLORS.accentGold}; text-decoration: none; font-size: 15px;">LinkedIn</a>
                          <p style="margin: 4px 0 0 0; font-size: 13px; color: ${COLORS.textMuted};">Professional network</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="width: 40px;">
                          <span style="font-size: 18px;">💻</span>
                        </td>
                        <td>
                          <a href="${EMAIL_CONFIG.githubUrl}" style="color: ${COLORS.accentGold}; text-decoration: none; font-size: 15px;">GitHub</a>
                          <p style="margin: 4px 0 0 0; font-size: 13px; color: ${COLORS.textMuted};">Open source projects</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding-top: 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${COLORS.bgCard}; border: 1px solid ${COLORS.borderSolid}; border-radius: 12px;">
                <tr>
                  <td align="center" style="padding: 32px;">
                    <p style="margin: 0 0 20px 0; font-family: ${FONTS.display}; font-size: 18px; color: ${COLORS.textPrimary};">Explore my work while you wait</p>
                    <a href="${EMAIL_CONFIG.portfolioUrl}/projects" style="display: inline-block; padding: 16px 40px; background-color: ${COLORS.accentGold}; color: ${COLORS.bgDark}; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 14px; letter-spacing: 0.5px;">View Projects</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 40px 0 0 0;">
              <p style="margin: 0 0 8px 0; font-family: ${FONTS.display}; font-size: 20px; color: ${COLORS.textPrimary};">${EMAIL_CONFIG.name}</p>
              <p style="margin: 0 0 4px 0; font-size: 13px; color: ${COLORS.textMuted};">${EMAIL_CONFIG.title} @ ${EMAIL_CONFIG.company}</p>
              <p style="margin: 0 0 24px 0; font-size: 13px; color: ${COLORS.textMuted};">${EMAIL_CONFIG.location}</p>
              
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid ${COLORS.borderSolid}; padding-top: 24px;">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 8px 0; font-size: 11px; color: ${COLORS.textMuted};">This is an automated confirmation.</p>
                    <p style="margin: 0; font-size: 11px; color: ${COLORS.accentTaupe};">© ${year} ${EMAIL_CONFIG.name}</p>
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
