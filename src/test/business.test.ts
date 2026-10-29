import { describe, it, expect } from 'vitest';
import { formatInternationalPhoneNumber, formatINR, BUSINESS_CONFIG } from '@/config/business';

describe('Business Configuration & Helpers', () => {
  it('formats 10-digit Indian phone number to international E.164 format', () => {
    expect(formatInternationalPhoneNumber('9876543210')).toBe('+919876543210');
    expect(formatInternationalPhoneNumber('+919876543210')).toBe('+919876543210');
    expect(formatInternationalPhoneNumber('09876543210')).toBe('+09876543210');
    expect(formatInternationalPhoneNumber('')).toBe('');
  });

  it('formats INR currency correctly and handles empty/null prices with "Contact for Price"', () => {
    expect(formatINR(null)).toBe('Contact for Price');
    expect(formatINR(undefined)).toBe('Contact for Price');
    expect(formatINR(NaN)).toBe('Contact for Price');
    
    const formatted = formatINR(1500);
    expect(formatted).toContain('1,500');
  });

  it('specifies India, Tamil Nadu, and INR currency', () => {
    expect(BUSINESS_CONFIG.country).toBe('India');
    expect(BUSINESS_CONFIG.state).toBe('Tamil Nadu');
    expect(BUSINESS_CONFIG.currency.code).toBe('INR');
  });
});

