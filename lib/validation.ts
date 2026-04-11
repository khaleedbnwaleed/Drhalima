// Utility functions for ID generation, validation, and formatting

/**
 * Generate unique Supporter ID in format: SUP-YYYY-XXXXXX
 * Example: SUP-2025-001234
 */
export function generateSupporterID(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
  return `SUP-${year}-${randomNum}`;
}

/**
 * Validate Nigerian phone number
 */
export function validateNigerianPhone(phone: string): boolean {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Nigerian numbers should be 11 digits (starting with 234 or 0)
  // or 10 digits (starting with 7, 8, 9)
  return cleaned.length === 11 || cleaned.length === 10;
}

/**
 * Validate PVC (Permanent Voter's Card) number format
 * PVC format: NNNNNNNNNNNNNN (14 digits)
 */
export function validatePVCNumber(pvC: string): boolean {
  const cleaned = pvC.replace(/\D/g, '');
  return cleaned.length === 14;
}

/**
 * Format Nigerian phone number to standard format
 */
export function formatPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  
  // Convert 10-digit number starting with 7,8,9 to 11-digit format
  if (cleaned.length === 10 && ['7', '8', '9'].includes(cleaned[0])) {
    cleaned = '234' + cleaned;
  }
  
  // Convert 0234 to 234
  if (cleaned.startsWith('0234')) {
    cleaned = cleaned.substring(1);
  }
  
  return cleaned;
}

/**
 * Sanitize input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Get Nigerian state by LGA
 * This is a mapping for common LGAs to states
 */
export function getStateByLGA(lga: string): string {
  // This should be expanded with a complete LGA-State mapping
  const lga_state_map: Record<string, string> = {
    // Lagos
    'Alimosho': 'Lagos',
    'Ajeromi-Ifelodun': 'Lagos',
    'Badagry': 'Lagos',
    'Somolu': 'Lagos',
    'Ikeja': 'Lagos',
    
    // Kano
    'Fagge': 'Kano',
    'Dawakin Kudu': 'Kano',
    'Gwale': 'Kano',
    
    // Add more LGAs as needed
  };
  
  return lga_state_map[lga] || '';
}

/**
 * Generate ward report statistics
 */
export function calculateWardStats(supporters: any[]) {
  const stats = {
    total: supporters.length,
    by_support_status: {
      strong_supporter: 0,
      undecided: 0,
      opponent: 0,
    },
    by_occupations: {} as Record<string, number>,
    by_gender: {
      male: 0,
      female: 0,
    },
  };

  supporters.forEach((supporter) => {
    // Count by support status
    if (stats.by_support_status.hasOwnProperty(supporter.support_status)) {
      stats.by_support_status[supporter.support_status as keyof typeof stats.by_support_status]++;
    }

    // Count by occupation
    if (supporter.occupation) {
      stats.by_occupations[supporter.occupation] =
        (stats.by_occupations[supporter.occupation] || 0) + 1;
    }
  });

  return stats;
}

/**
 * Check if user has admin role
 */
export function isAdmin(role: string): boolean {
  return role === 'admin' || role === 'super_admin';
}

/**
 * Generate timestamp in ISO format
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}
