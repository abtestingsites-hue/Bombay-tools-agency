import { formatInternationalPhoneNumber } from '@/config/business';

export interface ProductEnquiryParams {
  productName: string;
  productSlug?: string;
  brand?: string;
  size?: string;
  unit?: string;
  productUrl?: string;
}

export interface BulkQuotationParams {
  customerName: string;
  phone?: string;
  companyName?: string;
  requiredProducts: string;
  quantity?: string;
  deliveryPreference?: string;
  notes?: string;
}

export interface GeneralEnquiryParams {
  customerName?: string;
  subject?: string;
  message?: string;
}

/**
 * Checks if WhatsApp number is configured and valid
 */
export function isWhatsAppAvailable(whatsappNumber?: string): boolean {
  if (!whatsappNumber) return false;
  const cleaned = formatInternationalPhoneNumber(whatsappNumber);
  return cleaned.length >= 10;
}

/**
 * Generates standard WhatsApp wa.me link with URL-encoded message
 */
export function generateWhatsAppUrl(whatsappNumber: string, message: string): string {
  const formattedNumber = formatInternationalPhoneNumber(whatsappNumber).replace('+', '');
  const encodedText = encodeURIComponent(message.trim());
  return `https://wa.me/${formattedNumber}?text=${encodedText}`;
}

/**
 * Generates prefilled message for product enquiry
 */
export function buildProductEnquiryMessage(params: ProductEnquiryParams): string {
  const lines: string[] = [
    `Hello, I would like to enquire about the following product:`,
    ``,
    `*Product:* ${params.productName}`,
  ];

  if (params.brand) {
    lines.push(`*Brand:* ${params.brand}`);
  }
  if (params.size) {
    lines.push(`*Size / Dimensions:* ${params.size}`);
  }
  if (params.unit) {
    lines.push(`*Unit:* ${params.unit}`);
  }
  if (params.productUrl) {
    lines.push(`*Link:* ${params.productUrl}`);
  }

  lines.push(``);
  lines.push(`Please share current price, availability, and delivery options.`);
  return lines.join('\n');
}

/**
 * Generates prefilled message for bulk quotation
 */
export function buildBulkQuotationMessage(params: BulkQuotationParams): string {
  const lines: string[] = [
    `Hello, I would like to request a bulk material quotation:`,
    ``,
    `*Name:* ${params.customerName}`,
  ];

  if (params.companyName) {
    lines.push(`*Company / Contractor:* ${params.companyName}`);
  }
  if (params.phone) {
    lines.push(`*Contact Phone:* ${params.phone}`);
  }

  lines.push(``);
  lines.push(`*Required Products / Bill of Quantities:*`);
  lines.push(params.requiredProducts);

  if (params.quantity) {
    lines.push(`*Quantity:* ${params.quantity}`);
  }
  if (params.deliveryPreference) {
    lines.push(`*Preference:* ${params.deliveryPreference}`);
  }
  if (params.notes) {
    lines.push(``);
    lines.push(`*Additional Requirements:* ${params.notes}`);
  }

  lines.push(``);
  lines.push(`Kindly provide a formal quotation and estimated lead time.`);
  return lines.join('\n');
}

/**
 * Generates prefilled message for general enquiry
 */
export function buildGeneralEnquiryMessage(params: GeneralEnquiryParams): string {
  const lines: string[] = [`Hello, I have an enquiry for your hardware store:`];
  
  if (params.customerName) {
    lines.push(`*Name:* ${params.customerName}`);
  }
  if (params.subject) {
    lines.push(`*Subject:* ${params.subject}`);
  }
  if (params.message) {
    lines.push(``);
    lines.push(`*Message:* ${params.message}`);
  } else {
    lines.push(``);
    lines.push(`Please let me know if you can assist with product availability and store timings.`);
  }

  return lines.join('\n');
}
