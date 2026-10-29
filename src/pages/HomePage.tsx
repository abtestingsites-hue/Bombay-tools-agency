import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  ShieldCheck,
  Truck,
  FileSpreadsheet,
  ArrowRight,
  MapPin,
  ExternalLink,
  PhoneCall,
  CheckCircle2,
  ChevronRight,
  MessageCircle,
  Building,
} from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { ProductCard } from '@/components/common/ProductCard';
import { CategoryCard } from '@/components/common/CategoryCard';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { useBusiness } from '@/context/BusinessContext';
import { useLanguage } from '@/context/LanguageContext';
import { DataService } from '@/services/dataService';
import { Category, Product, FAQ } from '@/types';
import { generateLocalBusinessSchema } from '@/utils/seo';
import { BUSINESS_CONFIG } from '@/config/business';

export const HomePage: React.FC = () => {
  const { settings } = useBusiness();
  const { t } = useLanguage();

  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [cats, productsRes, faqList] = await Promise.all([
          DataService.getCategories(),
          DataService.getProducts({ featuredOnly: true, limit: 6 }),
          DataService.getFAQs({ limit: 4 } as any),
        ]);
        setCategories(cats);
        setFeaturedProducts(productsRes.data);
        setFaqs(faqList.slice(0, 4));
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const localBusinessSchema = generateLocalBusinessSchema(settings);

  return (
    <div>
      <SEOHead
        title={`${settings.shop_name} | Hardware, Power Tools & Building Materials - Coimbatore, Tamil Nadu`}
        description="Wholesale and retail supplier of genuine electrical materials, plumbing supplies, construction hardware, power tools, and water pumps in Coimbatore, Tamil Nadu."
        structuredData={localBusinessSchema}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy-950 via-slate-900 to-navy-950 text-white overflow-hidden py-14 sm:py-20 lg:py-24">
        {/* Subtle geometric pattern background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Copy & Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-brand-600/20 border border-brand-500/40 text-brand-400 px-3 py-1 rounded-full text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                <span>Tamil Nadu Hardware & Materials Depot • Coimbatore</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                {t('hero_title')}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                {t('hero_subtitle')}
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-md transition-all text-sm sm:text-base"
                >
                  {t('explore_catalog')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>

                <Link
                  to="/bulk-orders"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold backdrop-blur-sm border border-white/20 transition-all text-sm sm:text-base"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2 text-brand-400" />
                  {t('request_quote')}
                </Link>

                <WhatsAppButton
                  message="Hello Bombay Tools Agency, I want to enquire about hardware products from your store."
                  variant="primary"
                  className="text-sm sm:text-base py-3.5 rounded-xl"
                />
              </div>

              {/* Trust badges */}
              <div className="pt-6 border-t border-slate-800 grid grid-cols-3 gap-4 text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0" />
                  <span>100% Genuine Brands</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-brand-400 shrink-0" />
                  <span>Tamil Nadu Delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Wrench className="w-4 h-4 text-brand-400 shrink-0" />
                  <span>Contractor Quotations</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Hardware Showcase Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Glow behind image */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-brand-600 to-amber-500 rounded-3xl blur-lg opacity-30" />

                {/* Main Card with Photography */}
                <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-navy-900 shadow-2xl">
                  {/* High quality hardware & tools showcase photography */}
                  <div className="aspect-[4/3] sm:aspect-[16/11] relative overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=900&auto=format&fit=crop&q=85"
                      alt="Bombay Tools Agency - Hardware, Power Tools & Building Materials"
                      className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />

                    {/* Top pill badge */}
                    <div className="absolute top-3.5 left-3.5">
                      <span className="bg-navy-950/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20 inline-flex items-center shadow-md">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2" />
                        In-Store Counter Open
                      </span>
                    </div>
                  </div>

                  {/* Information Overlay */}
                  <div className="p-5 sm:p-6 space-y-4 bg-navy-950/90 backdrop-blur-md border-t border-white/10">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-bold text-brand-400 uppercase tracking-wider block">
                          Verified Physical Store
                        </span>
                        <h2 className="text-lg font-bold text-white mt-0.5">
                          {settings.shop_name}
                        </h2>
                        <p className="text-xs text-slate-300 mt-1 flex items-center">
                          <MapPin className="w-3.5 h-3.5 text-brand-400 mr-1 shrink-0" />
                          Dr Nanjappa Rd, Coimbatore, Tamil Nadu
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-md">
                        <Building className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row gap-2.5">
                      <a
                        href={settings.google_maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5 mr-1.5" />
                        Get Directions
                      </a>
                      <Link
                        to="/contact"
                        className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors"
                      >
                        Contact Us
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block mb-1">
                Material Categories
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-navy-950">
                {t('categories_title')}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {t('categories_subtitle')}
              </p>
            </div>
            <Link
              to="/categories"
              className="inline-flex items-center text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block mb-1">
                Verified Inventory
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-navy-950">
                {t('featured_products')}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {t('featured_subtitle')}
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              <span>Browse Full Catalog</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-slate-100 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bulk Material & Contractor Banner */}
      <section className="py-16 sm:py-20 bg-navy-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Contractor & Project Supply
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Bulk Quantities, Commercial Rates & Site Delivery
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                We supply complete electrical, plumbing, sanitaryware, and construction hardware requirements for residential, commercial, and industrial sites across Tamil Nadu. Share your list for transparent pricing without broker margins.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                  <span>GST invoice with full tax compliance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                  <span>Factory direct standard packaging</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                  <span>Site dispatch arrangements</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                  <span>Dedicated commercial support</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <Link
                to="/bulk-orders"
                className="w-full inline-flex items-center justify-center px-6 py-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-center shadow-lg transition-all"
              >
                <span>Request Project Quotation</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <WhatsAppButton
                message="Hello, I would like to get a bulk quotation for my upcoming construction project."
                variant="secondary"
                label="WhatsApp BOQ Directly"
                className="w-full justify-center py-4 bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Store Location & Google Maps Section (With Embedded Google Map & Contact Details) */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block mb-1">
              Visit Us in Person
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-950">
              {t('location_title')}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {t('location_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Contact & Location Details Card */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Verified Physical Location</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{settings.shop_name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Hardware & Power Tools Merchant</p>
                </div>

                <div className="space-y-4 text-sm text-slate-700">
                  {/* Address */}
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">{t('store_address')}</p>
                      <p className="text-slate-600 mt-0.5 leading-relaxed">
                        {settings.address || '215, Dr Nanjappa Rd, Flyover, Anupperpalayam, Ram Nagar, Coimbatore, Tamil Nadu 641018'}
                      </p>
                      <p className="text-xs text-brand-600 font-medium mt-1">
                        Landmark: Dr. Nanjappa Road Flyover / Ram Nagar
                      </p>
                    </div>
                  </div>

                  {/* Opening Hours */}
                  {settings.opening_hours && (
                    <div className="flex items-start space-x-3">
                      <Wrench className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900">{t('business_hours')}</p>
                        <p className="text-slate-600 mt-0.5">{settings.opening_hours}</p>
                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  {settings.phone && (
                    <div className="flex items-start space-x-3">
                      <PhoneCall className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900">{t('phone_number')}</p>
                        <a href={`tel:${settings.phone}`} className="text-brand-600 hover:underline mt-0.5 block font-medium">
                          {settings.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* WhatsApp */}
                  {settings.whatsapp_number && (
                    <div className="flex items-start space-x-3">
                      <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900">{t('whatsapp_chat')}</p>
                        <a
                          href={`https://wa.me/${settings.whatsapp_number.replace(/[^\d]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 hover:underline mt-0.5 block font-medium"
                        >
                          {settings.whatsapp_number}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
                <a
                  href={settings.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-sm transition-colors"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {t('get_directions')}
                  <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </a>
                <Link
                  to="/contact"
                  className="w-full inline-flex items-center justify-center px-5 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-colors"
                >
                  {t('nav_contact')}
                </Link>
              </div>
            </div>

            {/* Embedded Interactive Google Map */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm min-h-[420px] flex flex-col">
              <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-medium">Live Google Maps Navigation</span>
                </div>
                <a
                  href={settings.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center"
                >
                  <span>Open in Google Maps App</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>

              {/* Embedded Google Map iframe */}
              <div className="flex-1 w-full relative min-h-[360px] bg-slate-100">
                <iframe
                  title="Bombay Tools Agency - Store Location"
                  src={BUSINESS_CONFIG.googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '380px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Hub Preview */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block mb-1">
                Frequently Asked Questions
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-navy-950">
                {t('faq_title')}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {t('faq_subtitle')}
              </p>
            </div>
            <Link
              to="/faq"
              className="inline-flex items-center text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              <span>View All Questions</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-semibold text-brand-600 uppercase tracking-wide">
                    {faq.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {faq.question}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60">
                  <Link
                    to={`/faq/${faq.slug}`}
                    className="inline-flex items-center text-xs font-semibold text-brand-600 hover:text-brand-700"
                  >
                    <span>Read full answer</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
