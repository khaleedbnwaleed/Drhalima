// Messaging service for email notifications
import { Resend } from 'resend';

function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY || '')
}

/**
 * Send confirmation email after registration
 */
export async function sendRegistrationConfirmationEmail(
  email: string,
  supporterId: string,
  supporterName: string,
  qrCodeUrl?: string
): Promise<boolean> {
  try {
    await getResendClient().emails.send({
      from: 'campaign@drhalimasulaiman.ng',
      to: email,
      subject: 'Welcome to Dr. Halima Sulaiman Campaign - Registration Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to the Campaign!</h2>
          <p>Dear ${supporterName},</p>
          <p>Thank you for registering as a supporter of Dr. Halima Sulaiman's candacy.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Your Supporter ID:</strong> ${supporterId}</p>
            <p>Please save this ID for your records.</p>
            ${qrCodeUrl ? `<p><strong>Your QR Code:</strong></p><img src="${qrCodeUrl}" alt="Supporter QR Code" style="max-width: 200px;"/>` : ''}
          </div>
          
          <p>You can now:</p>
          <ul>
            <li>Track your support status</li>
            <li>Receive campaign updates</li>
            <li>Participate in campaign activities</li>
            <li>Share with other supporters</li>
          </ul>
          
          <p>For more information, visit our website or contact us via WhatsApp.</p>
          
          <p>Best regards,<br/>Dr. Halima Sulaiman Campaign Team</p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return false;
  }
}
