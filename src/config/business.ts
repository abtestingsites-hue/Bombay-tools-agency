import { BusinessSettings } from '@/types';

export const DEFAULT_BUSINESS_SETTINGS: BusinessSettings = {
  id: 'default-settings',
  shop_name: import.meta.env.VITE_SHOP_NAME || 'Bombay Tools Agency',
  tagline: 'Quality Hardware, Power Tools & Building Materials',
  phone: import.meta.env.VITE_PHONE_NUMBER || '',
  whatsapp_number: import.meta.env.VITE_WHATSAPP_NUMBER || '',
  email: 'contact@bombaytoolsagency.com',
  address: '',
  opening_hours: '',
  google_maps_url:
    import.meta.env.VITE_GOOGLE_MAPS_URL ||
    'https://maps.app.goo.gl/zrJSTZ6aXR7ATsrTA?g_st=aw',
  logo_url: '',
  social_links: {},
  updated_at: new Date().toISOString(),
};

export const BUSINESS_CONFIG = {
  currency: {
    code: 'INR',
    symbol: '₹',
  },
  country: 'India',
  state: 'Tamil Nadu',
  defaultLanguage: 'en' as const,
  supportedLanguages: ['en', 'ta'] as const,
  defaultGoogleMapsUrl: 'https://maps.app.goo.gl/zrJSTZ6aXR7ATsrTA?g_st=aw',
};

/**
 * Validates and formats an Indian or international phone/WhatsApp number.
 * Returns clean E.164 format (e.g. +919876543210) or empty string if invalid.
 */
export function formatInternationalPhoneNumber(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) {
    return digits;
  }
  // If 10 digits typical Indian mobile, prepend +91
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }
  return digits ? `+${digits}` : '';
}

/**
 * Formats currency in Indian numbering format (e.g., ₹1,50,000.00)
 */
export function formatINR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Contact for Price';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}
