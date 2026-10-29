import { describe, it, expect } from 'vitest';
import {
  isWhatsAppAvailable,
  generateWhatsAppUrl,
  buildProductEnquiryMessage,
  buildBulkQuotationMessage,
} from '@/utils/whatsapp';

describe('WhatsApp Integration Utilities', () => {
  it('correctly checks WhatsApp number availability', () => {
    expect(isWhatsAppAvailable('')).toBe(false);
    expect(isWhatsAppAvailable(undefined)).toBe(false);
    expect(isWhatsAppAvailable('12345')).toBe(false);
    expect(isWhatsAppAvailable('9876543210')).toBe(true);
    expect(isWhatsAppAvailable('+919876543210')).toBe(true);
  });

  it('generates standard wa.me URL with clean digits and encoded text', () => {
    const url = generateWhatsAppUrl('+919876543210', 'Hello world & test');
    expect(url).toBe('https://wa.me/919876543210?text=Hello%20world%20%26%20test');
  });

  it('builds comprehensive product enquiry message', () => {
    const message = buildProductEnquiryMessage({
      productName: 'Finolex FR Cable 2.5 sq mm',
      brand: 'Finolex',
      size: '2.5 sq mm',
      unit: 'coil',
      productUrl: 'https://example.com/products/finolex-fr-cable',
    });

    expect(message).toContain('*Product:* Finolex FR Cable 2.5 sq mm');
    expect(message).toContain('*Brand:* Finolex');
    expect(message).toContain('*Size / Dimensions:* 2.5 sq mm');
    expect(message).toContain('*Unit:* coil');
    expect(message).toContain('*Link:* https://example.com/products/finolex-fr-cable');
  });

  it('builds comprehensive bulk quotation message', () => {
    const message = buildBulkQuotationMessage({
      customerName: 'Suresh Kumar',
      companyName: 'Kumar Electricals',
      requiredProducts: '50 coils 2.5mm wire, 200 lengths 20mm CPVC pipe',
      quantity: 'Bulk Site Supply',
      deliveryPreference: 'Site Delivery in Tamil Nadu',
    });

    expect(message).toContain('*Name:* Suresh Kumar');
    expect(message).toContain('*Company / Contractor:* Kumar Electricals');
    expect(message).toContain('50 coils 2.5mm wire');
    expect(message).toContain('Site Delivery in Tamil Nadu');
  });
});
