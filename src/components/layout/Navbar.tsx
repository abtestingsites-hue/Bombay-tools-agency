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
  FileSpreadsheet,
} from 'lucide-react';
import { useBusiness } from '@/context/BusinessContext';
import { useLanguage } from '@/context/LanguageContext';
import { isWhatsAppAvailable, generateWhatsAppUrl } from '@/utils/whatsapp';

export const Navbar: React.FC = () => {
  const { settings } = useBusiness();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap rounded-md ${
      isActive
        ? 'text-brand-600 font-semibold bg-brand-50/70'
        : 'text-slate-700 hover:text-brand-600 hover:bg-slate-50'
    }`;

  const hasWhatsApp = isWhatsAppAvailable(settings.whatsapp_number);
  const hasPhone = Boolean(settings.phone && settings.phone.trim().length >= 10);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Utility Bar */}
      <div className="bg-navy-950 text-slate-300 text-xs py-1.5 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-4 sm:space-x-6">
            <span className="inline-flex items-center text-slate-300">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-brand-500 shrink-0" />
              <span className="truncate max-w-[200px] sm:max-w-none">
                Coimbatore, Tamil Nadu
              </span>
            </span>
            {hasPhone && (
              <a
                href={`tel:${settings.phone}`}
                className="hidden sm:inline-flex items-center text-slate-300 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 mr-1.5 text-brand-500 shrink-0" />
                <span>{settings.phone}</span>
              </a>
            )}
            {settings.opening_hours && (
              <span className="hidden lg:inline-flex items-center text-slate-400">
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
                className={`text-xs px-1.5 py-0.5 rounded transition-colors ${
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
                className={`text-xs px-1.5 py-0.5 rounded transition-colors ${
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
              className="inline-flex items-center text-slate-400 hover:text-white transition-colors text-xs"
              title="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-slate-400" />
              <span>{t('nav_admin')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo / Shop Branding */}
          <Link to="/" className="flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 text-white flex items-center justify-center shadow-md">
              <Wrench className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="text-base sm:text-xl font-extrabold tracking-tight text-navy-950 block leading-tight">
                {settings.shop_name}
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:block truncate max-w-[220px]">
                {settings.tagline || 'Hardware & Power Tools'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Uncluttered & Realigned) */}
          <nav className="hidden xl:flex items-center space-x-1 lg:space-x-2">
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
            <NavLink to="/contact" className={navLinkClass}>
              {t('nav_contact')}
            </NavLink>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Quick Search Toggle / Input */}
            <div className="relative">
              {searchOpen ? (
                <form
                  onSubmit={handleSearchSubmit}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-64 sm:w-72 z-50 bg-white p-1 rounded-xl shadow-xl border border-slate-300 flex items-center animate-fade-in"
                >
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('search_placeholder')}
                    className="w-full text-xs px-3 py-1.5 outline-none bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                  aria-label="Search products"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Primary Action Button (WhatsApp when available, or Request Quote - NEVER doubled Contact link) */}
            {hasWhatsApp ? (
              <a
                href={generateWhatsAppUrl(
                  settings.whatsapp_number,
                  'Hello Bombay Tools Agency, I would like to enquire about hardware products.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
                aria-label="Chat on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 mr-1.5" />
                <span>WhatsApp</span>
              </a>
            ) : (
              <Link
                to="/bulk-orders"
                className="inline-flex items-center justify-center px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs transition-all"
              >
                <FileSpreadsheet className="w-4 h-4 mr-1.5" />
                <span>Request Quote</span>
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
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

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
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

          <div className="flex flex-col space-y-1 pt-1">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              {t('nav_home')}
            </NavLink>
            <NavLink
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              {t('nav_products')}
            </NavLink>
            <NavLink
              to="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              {t('nav_categories')}
            </NavLink>
            <NavLink
              to="/brands"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              {t('nav_brands')}
            </NavLink>
            <NavLink
              to="/bulk-orders"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              {t('nav_bulk_orders')}
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              {t('nav_about')}
            </NavLink>
            <NavLink
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              {t('nav_contact')}
            </NavLink>
            <NavLink
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-500 hover:bg-slate-100"
            >
              {t('nav_admin')}
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};
