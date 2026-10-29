import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Phone,
  MessageCircle,
  MapPin,
  Search,
  Wrench,
  Globe,
  ShieldCheck,
} from 'lucide-react';
import { useBusiness } from '@/context/BusinessContext';
import { useLanguage } from '@/context/LanguageContext';
import { isWhatsAppAvailable, generateWhatsAppUrl } from '@/utils/whatsapp';

export const Navbar: React.FC = () => {
  const { settings } = useBusiness();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'text-brand-600 font-semibold'
        : 'text-slate-700 hover:text-brand-600'
    }`;

  const hasWhatsApp = isWhatsAppAvailable(settings.whatsapp_number);
  const hasPhone = Boolean(settings.phone && settings.phone.trim().length >= 10);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top utility bar */}
      <div className="bg-navy-950 text-slate-300 text-xs py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline-flex items-center text-slate-400">
              <MapPin className="w-3.5 h-3.5 mr-1 text-brand-500" />
              Tamil Nadu, India
            </span>
            {hasPhone && (
              <a
                href={`tel:${settings.phone}`}
                className="inline-flex items-center hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 mr-1 text-brand-500" />
                <span>{settings.phone}</span>
              </a>
            )}
            {settings.opening_hours && (
              <span className="hidden md:inline-flex items-center text-slate-400">
                {settings.opening_hours}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="inline-flex items-center space-x-1 bg-navy-900 px-2 py-0.5 rounded border border-slate-700">
              <Globe className="w-3 h-3 text-brand-400 mr-1" />
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`text-xs px-1.5 py-0.5 rounded ${
                  language === 'en'
                    ? 'bg-brand-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('ta')}
                className={`text-xs px-1.5 py-0.5 rounded ${
                  language === 'ta'
                    ? 'bg-brand-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                தமிழ்
              </button>
            </div>

            <Link
              to="/admin"
              className="hidden sm:inline-flex items-center text-slate-400 hover:text-white transition-colors"
              title="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {t('nav_admin')}
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo / Shop Branding */}
          <Link to="/" className="flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-brand-600 text-white flex items-center justify-center shadow-md">
              <Wrench className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-navy-950 block leading-tight">
                {settings.shop_name}
              </span>
              <span className="text-xs text-slate-500 hidden sm:block truncate max-w-xs">
                {settings.tagline || 'Building Materials & Hardware Supplies'}
              </span>
            </div>
          </Link>

          {/* Search bar (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                className="w-full bg-slate-100 border border-slate-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            <NavLink to="/" className={navLinkClass}>
              {t('nav_home')}
            </NavLink>
            <NavLink to="/products" className={navLinkClass}>
              {t('nav_products')}
            </NavLink>
            <NavLink to="/categories" className={navLinkClass}>
              {t('nav_categories')}
            </NavLink>
            <NavLink to="/brands" className={navLinkClass}>
              {t('nav_brands')}
            </NavLink>
            <NavLink to="/bulk-orders" className={navLinkClass}>
              {t('nav_bulk_orders')}
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              {t('nav_about')}
            </NavLink>
            <NavLink to="/faq" className={navLinkClass}>
              {t('nav_faq')}
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              {t('nav_contact')}
            </NavLink>
          </nav>

          {/* Quick CTA button */}
          <div className="flex items-center space-x-3">
            {hasWhatsApp ? (
              <a
                href={generateWhatsAppUrl(
                  settings.whatsapp_number,
                  'Hello, I would like to enquire about hardware products.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                aria-label="Enquire on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">{t('enquire_whatsapp')}</span>
                <span className="sm:hidden">WhatsApp</span>
              </a>
            ) : (
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition-all"
              >
                <Phone className="w-4 h-4 mr-1.5" />
                <span>{t('nav_contact')}</span>
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          {/* Mobile search bar */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_placeholder')}
              className="w-full bg-slate-100 border border-slate-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          <div className="flex flex-col space-y-1">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-base font-medium text-slate-800 hover:bg-slate-100"
            >
              {t('nav_home')}
            </NavLink>
            <NavLink
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-base font-medium text-slate-800 hover:bg-slate-100"
            >
              {t('nav_products')}
            </NavLink>
            <NavLink
              to="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-base font-medium text-slate-800 hover:bg-slate-100"
            >
              {t('nav_categories')}
            </NavLink>
            <NavLink
              to="/brands"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-base font-medium text-slate-800 hover:bg-slate-100"
            >
              {t('nav_brands')}
            </NavLink>
            <NavLink
              to="/bulk-orders"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-base font-medium text-slate-800 hover:bg-slate-100"
            >
              {t('nav_bulk_orders')}
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-base font-medium text-slate-800 hover:bg-slate-100"
            >
              {t('nav_about')}
            </NavLink>
            <NavLink
              to="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-base font-medium text-slate-800 hover:bg-slate-100"
            >
              {t('nav_faq')}
            </NavLink>
            <NavLink
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-base font-medium text-slate-800 hover:bg-slate-100"
            >
              {t('nav_contact')}
            </NavLink>
            <NavLink
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-100"
            >
              {t('nav_admin')}
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};
