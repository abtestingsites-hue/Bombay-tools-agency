import { BusinessSettings, Product, FAQ } from '@/types';

export function generateLocalBusinessSchema(settings: BusinessSettings, siteUrl = 'https://example.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'HardwareStore',
    name: settings.shop_name,
    description: settings.tagline || 'Retail and wholesale supplier of electrical, plumbing, construction hardware, power tools and pumps in Tamil Nadu, India.',
    url: siteUrl,
    telephone: settings.phone || undefined,
    hasMap: settings.google_maps_url || undefined,
    address: settings.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: settings.address,
          addressRegion: 'Tamil Nadu',
          addressCountry: 'IN',
        }
      : {
          '@type': 'PostalAddress',
          addressRegion: 'Tamil Nadu',
          addressCountry: 'IN',
        },
    openingHours: settings.opening_hours || undefined,
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, Bank Transfer',
    priceRange: '₹₹',
  };
}

export function generateProductSchema(product: Product, siteUrl = 'https://example.com') {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    image: product.image_urls.length > 0 ? product.image_urls : undefined,
    url: `${siteUrl}/products/${product.slug}`,
  };

  const availabilityMap: Record<string, string> = {
    in_stock: 'https://schema.org/InStock',
    out_of_stock: 'https://schema.org/OutOfStock',
    on_order: 'https://schema.org/PreOrder',
    available_to_order: 'https://schema.org/PreOrder',
  };

  if (product.is_price_visible && product.price !== null) {
    schema.offers = {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'INR',
      availability: availabilityMap[product.availability_status] || 'https://schema.org/InStock',
      url: `${siteUrl}/products/${product.slug}`,
    };
  } else {
    schema.offers = {
      '@type': 'Offer',
      priceCurrency: 'INR',
      availability: availabilityMap[product.availability_status] || 'https://schema.org/InStock',
      url: `${siteUrl}/products/${product.slug}`,
    };
  }

  return schema;
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>, siteUrl = 'https://example.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
    })),
  };
}

export function generateFAQSchema(faqs: FAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

