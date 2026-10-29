import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  FileSpreadsheet,
  MapPin,
  Package,
} from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { DataService } from '@/services/dataService';
import { FAQ } from '@/types';
import { generateFAQSchema } from '@/utils/seo';

export const FAQDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [faq, setFaq] = useState<FAQ | null>(null);
  const [otherFaqs, setOtherFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFaq() {
      if (!slug) return;
      setIsLoading(true);
      try {
        const item = await DataService.getFAQBySlug(slug);
        setFaq(item);
        const allFaqs = await DataService.getFAQs();
        setOtherFaqs(allFaqs.filter((f) => f.slug !== slug).slice(0, 3));
      } catch (err) {
        console.error('Failed to load FAQ item', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFaq();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse space-y-4">
        <div className="h-6 w-32 bg-slate-200 rounded" />
        <div className="h-10 w-3/4 bg-slate-200 rounded" />
        <div className="h-40 bg-slate-100 rounded-xl" />
      </div>
    );
  }

  if (!faq) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Question Not Found</h1>
        <p className="text-slate-600 mb-6">
          The requested question could not be found or may have been updated.
        </p>
        <Link
          to="/faq"
          className="inline-flex items-center px-4 py-2 rounded-lg bg-brand-600 text-white font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to FAQ Hub
        </Link>
      </div>
    );
  }

  const faqSchema = generateFAQSchema([faq]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <SEOHead
        title={`${faq.question} | Hardware FAQ`}
        description={faq.answer.slice(0, 160)}
        structuredData={faqSchema}
      />

      <Breadcrumbs
        items={[
          { label: 'Help & FAQs', path: '/faq' },
          { label: faq.question },
        ]}
      />

      <article className="mt-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
        <div>
          <span className="inline-block bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            {faq.category}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight leading-snug">
            {faq.question}
          </h1>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3">
            Direct Answer & Store Policy
          </h2>
          <div className="text-base text-slate-700 leading-relaxed space-y-4 whitespace-pre-line">
            {faq.answer}
          </div>
        </div>

        {/* Supporting actions based on question type */}
        <div className="pt-6 border-t border-slate-200/80 bg-slate-50 -mx-6 sm:-mx-10 -mb-6 sm:-mb-10 p-6 sm:p-8 rounded-b-2xl space-y-4">
          <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wide">
            Next Action For Your Material Requirements
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <Link
              to="/bulk-orders"
              className="bg-white p-3 rounded-lg border border-slate-200 hover:border-brand-500 font-semibold text-slate-800 flex items-center space-x-2 transition-colors shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-brand-600 shrink-0" />
              <span>Request Bulk Quotation</span>
            </Link>

            <Link
              to="/products"
              className="bg-white p-3 rounded-lg border border-slate-200 hover:border-brand-500 font-semibold text-slate-800 flex items-center space-x-2 transition-colors shadow-xs"
            >
              <Package className="w-4 h-4 text-brand-600 shrink-0" />
              <span>Browse Catalog</span>
            </Link>

            <Link
              to="/contact"
              className="bg-white p-3 rounded-lg border border-slate-200 hover:border-brand-500 font-semibold text-slate-800 flex items-center space-x-2 transition-colors shadow-xs"
            >
              <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
              <span>Store Location & Map</span>
            </Link>
          </div>

          <div className="pt-2">
            <WhatsAppButton
              message={`Hello, I was reading your FAQ about "${faq.question}" and would like more details.`}
              variant="compact"
              label="Ask Us Regarding This on WhatsApp"
            />
          </div>
        </div>
      </article>

      {/* Related FAQs */}
      {otherFaqs.length > 0 && (
        <div className="mt-12 space-y-4">
          <h2 className="text-lg font-bold text-navy-950">Related Questions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {otherFaqs.map((item) => (
              <Link
                key={item.id}
                to={`/faq/${item.slug}`}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-brand-500 transition-colors flex flex-col justify-between"
              >
                <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                  {item.question}
                </h3>
                <span className="text-[11px] text-brand-600 font-semibold mt-3 block">
                  Read answer →
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
