import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MessageCircle,
  FileSpreadsheet,
  MapPin,
} from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { useBusiness } from '@/context/BusinessContext';
import { useLanguage } from '@/context/LanguageContext';
import { DataService } from '@/services/dataService';
import { FAQ } from '@/types';
import { generateFAQSchema } from '@/utils/seo';
import { isWhatsAppAvailable, generateWhatsAppUrl } from '@/utils/whatsapp';

export const FAQPage: React.FC = () => {
  const { settings } = useBusiness();
  const { t } = useLanguage();

  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFaqs() {
      try {
        const data = await DataService.getFAQs();
        setFaqs(data);
        // Default first FAQ open
        if (data[0]) {
          setOpenIds({ [data[0].id]: true });
        }
      } catch (err) {
        console.error('Failed to load FAQs', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFaqs();
  }, []);

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    faqs.forEach((f) => {
      if (f.category) set.add(f.category);
    });
    return Array.from(set);
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory =
        selectedCategory === 'all' || faq.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [faqs, selectedCategory, searchQuery]);

  const faqSchema = generateFAQSchema(faqs);
  const hasWhatsApp = isWhatsAppAvailable(settings.whatsapp_number);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <SEOHead
        title={`Help & FAQs | Pricing, Delivery & Orders | ${settings.shop_name}`}
        description="Frequently asked questions about hardware pricing, bulk material quotation, brand authenticity, site delivery, and physical store timings in Tamil Nadu."
        structuredData={faqSchema}
      />

      <Breadcrumbs items={[{ label: 'Help & FAQs' }]} />

      <div className="mt-4 mb-8 text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
          {t('faq_title')}
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          {t('faq_subtitle')}
        </p>

        {/* Search bar */}
        <div className="max-w-md mx-auto pt-2 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search_faq')}
            className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            selectedCategory === 'all'
              ? 'bg-navy-950 text-white'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          All Topics ({faqs.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              selectedCategory === cat
                ? 'bg-navy-950 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordions List */}
      <div className="max-w-4xl mx-auto space-y-4">
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-100 rounded-xl" />
            ))}
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
            <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No questions found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Try searching with different keywords or ask us directly on WhatsApp.
            </p>
            {hasWhatsApp && (
              <a
                href={generateWhatsAppUrl(
                  settings.whatsapp_number,
                  'Hello, I have a specific question about your hardware store.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
              >
                <MessageCircle className="w-4 h-4 mr-1.5" />
                Ask on WhatsApp
              </a>
            )}
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = Boolean(openIds[faq.id]);
            return (
              <div
                key={faq.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors focus:outline-none"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wide">
                      {faq.category}
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {faq.question}
                    </h2>
                  </div>
                  <div className="p-1 rounded-full bg-slate-100 text-slate-600 shrink-0">
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-brand-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 space-y-4">
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </p>

                    {/* Quick navigation and related actions */}
                    <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold">
                      <Link
                        to={`/faq/${faq.slug}`}
                        className="text-brand-600 hover:text-brand-700 inline-flex items-center"
                      >
                        <span>Permanent page for this answer</span>
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Link>
                      <Link
                        to="/bulk-orders"
                        className="text-slate-600 hover:text-slate-900 inline-flex items-center"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 mr-1 text-brand-500" />
                        <span>Request Bulk Quotation</span>
                      </Link>
                      <Link
                        to="/contact"
                        className="text-slate-600 hover:text-slate-900 inline-flex items-center"
                      >
                        <MapPin className="w-3.5 h-3.5 mr-1 text-brand-500" />
                        <span>View Store Location</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
