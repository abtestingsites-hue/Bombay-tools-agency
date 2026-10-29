import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Share2,
  FileText,
  RefreshCw,
} from 'lucide-react';
import { DataService } from '@/services/dataService';
import { Product } from '@/types';
import { useBusiness } from '@/context/BusinessContext';

export const AdminSEOPage: React.FC = () => {
  const { settings } = useBusiness();
  const [products, setProducts] = useState<Product[]>([]);

  // Social Preview State
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewDesc, setPreviewDesc] = useState('');
  const [previewImage, setPreviewImage] = useState('');

  const loadData = async () => {
    try {
      const prodRes = await DataService.getProducts({ limit: 1000 });
      setProducts(prodRes.data);

      setPreviewTitle(`${settings.shop_name} | Hardware & Building Materials Depot`);
      setPreviewDesc(
        settings.tagline ||
          'Supplying genuine electrical wires, CPVC pipes, Bosch tools, Jaquar bathware, and Crompton pumps in Tamil Nadu.'
      );
      setPreviewImage('https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&auto=format&fit=crop&q=80');
    } catch (err) {
      console.error('Failed to load SEO data', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [settings]);

  // Health checks
  const productsWithoutDescription = products.filter(
    (p) => !p.description || p.description.trim().length < 20
  );
  const duplicateSlugs = React.useMemo(() => {
    const slugMap = new Map<string, number>();
    products.forEach((p) => {
      slugMap.set(p.slug, (slugMap.get(p.slug) || 0) + 1);
    });
    return Array.from(slugMap.entries())
      .filter(([_, count]) => count > 1)
      .map(([slug]) => slug);
  }, [products]);

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
            SEO & Search Engine Optimization
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Audit meta descriptions, duplicate slugs, social preview cards, and schema health
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          className="inline-flex items-center px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Re-scan Catalog
        </button>
      </div>

      {/* SEO Health Audit Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Duplicate Slugs
            </span>
            {duplicateSlugs.length === 0 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600" />
            )}
          </div>
          <span className="text-2xl font-bold text-slate-900 block">
            {duplicateSlugs.length}
          </span>
          <p className="text-[11px] text-slate-500">
            {duplicateSlugs.length === 0
              ? 'All product slugs are clean & unique.'
              : `Found conflicting slugs: ${duplicateSlugs.join(', ')}`}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Thin / Missing Descriptions
            </span>
            {productsWithoutDescription.length === 0 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            )}
          </div>
          <span className="text-2xl font-bold text-slate-900 block">
            {productsWithoutDescription.length}
          </span>
          <p className="text-[11px] text-slate-500">
            {productsWithoutDescription.length === 0
              ? 'Every product has a rich overview.'
              : `${productsWithoutDescription.length} items have sparse descriptions.`}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Structured Data Status
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-bold text-emerald-600 block">
            Active
          </span>
          <p className="text-[11px] text-slate-500">
            LocalBusiness, Product & FAQPage schemas are active.
          </p>
        </div>
      </div>

      {/* Social Sharing & OpenGraph Live Simulator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-base font-bold text-navy-950 flex items-center">
            <Share2 className="w-4 h-4 mr-2 text-brand-600" />
            Social Media & WhatsApp Link Preview (OpenGraph)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Preview how your shop and product links render when shared on WhatsApp, Facebook, and LinkedIn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Controls */}
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Share Title (og:title)
              </label>
              <input
                type="text"
                value={previewTitle}
                onChange={(e) => setPreviewTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Share Description (og:description)
              </label>
              <textarea
                rows={3}
                value={previewDesc}
                onChange={(e) => setPreviewDesc(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Social Banner Image URL (og:image)
              </label>
              <input
                type="text"
                value={previewImage}
                onChange={(e) => setPreviewImage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Social Card Preview Render */}
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              WhatsApp / Social Card Preview
            </span>
            <div className="bg-slate-100 rounded-2xl border border-slate-300 overflow-hidden shadow-sm max-w-sm mx-auto">
              <div className="aspect-[1.91/1] bg-slate-200 overflow-hidden">
                <img
                  src={previewImage}
                  alt="OG Banner Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 bg-white space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  bombaytoolsagency.com
                </span>
                <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
                  {previewTitle}
                </h3>
                <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                  {previewDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical SEO Files Reference */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-xs text-slate-700 space-y-3">
        <h3 className="font-bold text-slate-900 uppercase tracking-wide flex items-center">
          <FileText className="w-4 h-4 mr-1.5 text-brand-600" />
          Technical Discovery Files
        </h3>
        <p className="leading-relaxed">
          The following standard discovery files are served at the web root:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600">
          <li>
            <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">/robots.txt</code>: Disallows admin paths and references sitemap.
          </li>
          <li>
            <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">/llms.txt</code>: Semantic machine-readable business & catalog summary for generative AI engines (Section 14).
          </li>
        </ul>
      </div>
    </div>
  );
};
