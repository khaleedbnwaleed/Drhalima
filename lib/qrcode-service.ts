// QR Code generation service
import QRCode from 'qrcode';

/**
 * Generate QR code for supporter
 * QR code contains supporter ID and basic info for quick reference
 */
export async function generateSupporterQRCode(supporterId: string, email: string): Promise<string> {
  try {
    // Encode supporter info in QR code
    const qrData = `SUP:${supporterId}|EMAIL:${email}`;
    
    // Generate as data URL (PNG image encoded as base64)
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      type: 'image/png',
      margin: 1,
      width: 300,
    });
    
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Generate multiple QR codes for batch registration
 */
export async function generateBatchQRCodes(
  supporters: Array<{ supporterId: string; email: string }>
): Promise<Array<{ supporterId: string; qrCode: string }>> {
  try {
    const qrCodes = await Promise.all(
      supporters.map(async (supporter) => ({
        supporterId: supporter.supporterId,
        qrCode: await generateSupporterQRCode(supporter.supporterId, supporter.email),
      }))
    );
    
    return qrCodes;
  } catch (error) {
    console.error('Error generating batch QR codes:', error);
    throw new Error('Failed to generate batch QR codes');
  }
}

/**
 * Decode QR code data (if scanning with a QR code reader library)
 */
export function decodeSupporterQRCode(qrData: string): { supporterId: string; email: string } | null {
  try {
    const parts = qrData.split('|');
    const supporterId = parts[0]?.replace('SUP:', '');
    const email = parts[1]?.replace('EMAIL:', '');
    
    if (supporterId && email) {
      return { supporterId, email };
    }
    
    return null;
  } catch (error) {
    console.error('Error decoding QR code:', error);
    return null;
  }
}
