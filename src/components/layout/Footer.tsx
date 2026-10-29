import React from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  MapPin,
  Phone,
  MessageCircle,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { useBusiness } from '@/context/BusinessContext';
import { useLanguage } from '@/context/LanguageContext';
import { isWhatsAppAvailable, generateWhatsAppUrl } from '@/utils/whatsapp';

export const Footer: React.FC = () => {
  const { settings } = useBusiness();
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const hasWhatsApp = isWhatsAppAvailable(settings.whatsapp_number);

  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-slate-800">
      {/* Top CTA banner */}
      <div className="bg-gradient-to-r from-brand-700 to-brand-600 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              {t('contractor_banner_title')}
            </h3>
            <p className="text-sm text-brand-100 max-w-2xl mt-1">
              {t('contractor_banner_desc')}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/bulk-orders"
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-navy-950 text-white font-medium hover:bg-navy-900 transition-colors shadow-sm"
            >
              {t('request_quote')}
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
            {hasWhatsApp && (
              <a
                href={generateWhatsAppUrl(
                  settings.whatsapp_number,
                  'Hello, I would like to request a bulk quotation for hardware supplies.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4 ml-1.5" />
                WhatsApp BOQ
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main footer columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Store info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-brand-600 text-white flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                {settings.shop_name}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {settings.tagline ||
                'Authorized supplier of genuine electrical, plumbing, construction hardware, power tools, and water pumps.'}
            </p>
            <div className="space-y-2 text-sm text-slate-300 pt-2">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>
                  {settings.address ? (
                    settings.address
                  ) : (
                    <span className="text-slate-400">
                      Tamil Nadu, India.
                    </span>
                  )}
                </span>
              </div>
              {settings.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                  <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">
                    {settings.phone}
                  </a>
                </div>
              )}
              {settings.google_maps_url && (
                <div className="pt-2">
                  <a
                    href={settings.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs font-semibold text-brand-400 hover:text-brand-300"
                  >
                    <span>{t('view_google_maps')}</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              {t('quick_links')}
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  {t('nav_products')}
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-white transition-colors">
                  {t('nav_categories')}
                </Link>
              </li>
              <li>
                <Link to="/brands" className="hover:text-white transition-colors">
                  {t('nav_brands')}
                </Link>
              </li>
              <li>
                <Link to="/bulk-orders" className="hover:text-white transition-colors">
                  {t('nav_bulk_orders')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  {t('nav_about')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  {t('nav_contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Help & FAQs (Section 16 requirement) */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              {t('help_and_faq')}
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/faq/why-contact-for-price" className="hover:text-white transition-colors">
                  Product Availability
                </Link>
              </li>
              <li>
                <Link to="/faq/why-contact-for-price" className="hover:text-white transition-colors">
                  Product Pricing
                </Link>
              </li>
              <li>
                <Link to="/bulk-orders" className="hover:text-white transition-colors">
                  Bulk Orders
                </Link>
              </li>
              <li>
                <Link to="/brands" className="hover:text-white transition-colors">
                  Product Brands
                </Link>
              </li>
              <li>
                <Link to="/faq/delivery-and-pickup-options" className="hover:text-white transition-colors">
                  Delivery and Pickup
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  Returns and Replacements
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Shop Location & Directions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact and Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust, Transparency & Disclaimer */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              {t('legal_and_trust')}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              We operate as a genuine physical hardware & building materials store in Tamil Nadu. We never fabricate reviews, discounts, or stock status. Quotations are provided based on genuine market rates.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-400">
              <div>
                <Link to="/privacy-policy" className="hover:text-white transition-colors underline">
                  Privacy Policy
                </Link>
              </div>
              <div className="flex items-center text-slate-400 pt-1">
                <ShieldAlert className="w-3.5 h-3.5 mr-1 text-brand-400" />
                <span>Verified Google Maps Storefront</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © {currentYear} {settings.shop_name}. {t('all_rights_reserved')}
          </p>
          <div className="flex items-center space-x-6">
            <Link to="/privacy-policy" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/admin" className="hover:text-slate-400 transition-colors">
              {t('nav_admin')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
