import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Send,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { useBusiness } from '@/context/BusinessContext';
import { useLanguage } from '@/context/LanguageContext';
import { DataService } from '@/services/dataService';
import { buildBulkQuotationMessage, generateWhatsAppUrl, isWhatsAppAvailable } from '@/utils/whatsapp';

export const BulkOrdersPage: React.FC = () => {
  const { settings } = useBusiness();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();

  const prefilledProduct = searchParams.get('product') || '';
  const prefilledCategory = searchParams.get('category') || '';

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    companyName: '',
    requiredProducts: prefilledProduct ? `${prefilledProduct} (1 unit/pack)` : prefilledCategory ? `Supplies for category: ${prefilledCategory}` : '',
    quantity: '',
    deliveryPreference: 'pickup',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const hasWhatsApp = isWhatsAppAvailable(settings.whatsapp_number);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) {
      return 'Please enter your name or company representative name.';
    }
    const cleanPhone = formData.phone.replace(/[^\d+]/g, '');
    if (cleanPhone.length < 10) {
      return 'Please enter a valid 10-digit telephone or mobile number.';
    }
    if (!formData.requiredProducts.trim()) {
      return 'Please specify the required products, sizes, or bill of quantities.';
    }
    return null;
  };

  const handleSubmitDatabase = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const error = validateForm();
    if (error) {
      setErrorMessage(error);
      return;
    }

    setIsSubmitting(true);
    try {
      await DataService.createEnquiry({
        customer_name: formData.customerName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        enquiry_type: 'bulk',
        requested_products: formData.requiredProducts.trim(),
        requested_quantity: formData.quantity.trim() || undefined,
        message: `Company: ${formData.companyName || 'Individual'}\nDelivery: ${formData.deliveryPreference}\nNotes: ${formData.notes || 'None'}`,
      });
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Failed to submit bulk enquiry', err);
      setErrorMessage('Failed to submit quotation request. Please try again or message us on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppSend = () => {
    const error = validateForm();
    if (error) {
      setErrorMessage(error);
      return;
    }

    const message = buildBulkQuotationMessage({
      customerName: formData.customerName,
      phone: formData.phone,
      companyName: formData.companyName,
      requiredProducts: formData.requiredProducts,
      quantity: formData.quantity,
      deliveryPreference: formData.deliveryPreference === 'site_delivery' ? 'Site Delivery in Tamil Nadu' : 'Store Pickup',
      notes: formData.notes,
    });

    if (hasWhatsApp) {
      const url = generateWhatsAppUrl(settings.whatsapp_number, message);
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <SEOHead
        title="Bulk Orders & Project Quotations | Building Materials"
        description="Submit your Bill of Quantities (BOQ) or material schedule for bulk supply of electrical, plumbing, sanitaryware, and construction hardware across Tamil Nadu."
      />

      <Breadcrumbs items={[{ label: 'Bulk Orders & Quotations' }]} />

      <div className="mt-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
          {t('bulk_title')}
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-2xl">
          {t('bulk_subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Form Container */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                {t('form_success_title')}
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                {t('form_success_desc')}
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccess(false);
                    setFormData({
                      customerName: '',
                      phone: '',
                      email: '',
                      companyName: '',
                      requiredProducts: '',
                      quantity: '',
                      deliveryPreference: 'pickup',
                      notes: '',
                    });
                  }}
                  className="px-5 py-2.5 rounded-lg bg-navy-950 text-white text-xs font-semibold hover:bg-navy-900 transition-colors"
                >
                  Submit Another Quotation Request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitDatabase} className="space-y-5">
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="customerName" className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('form_full_name')} *
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    required
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('form_phone')} *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="companyName" className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('form_company')}
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="e.g. Sri Balaji Constructions"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('form_email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="requiredProducts" className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('form_products')} *
                </label>
                <textarea
                  id="requiredProducts"
                  name="requiredProducts"
                  required
                  rows={4}
                  value={formData.requiredProducts}
                  onChange={handleChange}
                  placeholder="Paste your material schedule, Bill of Quantities (BOQ), or list item names with preferred brands (e.g. 2.5 sq mm Finolex wire, 20mm Ashirvad CPVC pipes, Bosch GWS 600 grinders)..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {t('form_products_help')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="quantity" className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('form_quantity')}
                  </label>
                  <input
                    type="text"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="e.g. 50 coils / 200 lengths / 10 pcs"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label htmlFor="deliveryPreference" className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('form_delivery_pref')}
                  </label>
                  <select
                    id="deliveryPreference"
                    name="deliveryPreference"
                    value={formData.deliveryPreference}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="pickup">{t('delivery_store_pickup')}</option>
                    <option value="site_delivery">{t('delivery_site_delivery')}</option>
                    <option value="to_be_decided">{t('delivery_to_be_decided')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('form_notes')}
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Target delivery dates, GST requirement, site contact..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-lg bg-navy-950 hover:bg-navy-900 text-white font-semibold text-sm shadow-sm transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? t('form_submitting') : t('submit_quotation')}
                </button>

                {hasWhatsApp && (
                  <button
                    type="button"
                    onClick={handleWhatsAppSend}
                    className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {t('send_via_whatsapp')}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Sidebar Guidance & Policy details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-navy-950 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-brand-600" />
              Contractor & BOQ Purchasing
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We work directly with builders, electrical contractors, plumbers, and interior fabricators to supply standardized materials at volume pricing.
            </p>

            <div className="space-y-3 pt-2 text-xs text-slate-700">
              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Genuine Manufacturer Packaging:</strong> Sealed master cartons, original batch codes, and standard wire lengths.
                </span>
              </div>
              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Tax Invoicing:</strong> GST bills provided with compliant HSN codes for commercial credit.
                </span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Prompt Quotation Turnaround:</strong> Most standard BOQs are estimated within 2 to 4 business hours.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-xs text-amber-900 space-y-2">
            <div className="flex items-center space-x-2 font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Transparent Commercial Policy</span>
            </div>
            <p className="leading-relaxed text-amber-800">
              Prices for copper wires, CPVC pipes, and structural steel fasteners vary according to daily raw material market rates. Final binding prices are provided in the formal written quotation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
