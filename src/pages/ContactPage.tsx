import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  ExternalLink,
  Send,
  CheckCircle2,
  AlertCircle,
  Building2,
} from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { useBusiness } from '@/context/BusinessContext';
import { useLanguage } from '@/context/LanguageContext';
import { DataService } from '@/services/dataService';
import { generateLocalBusinessSchema } from '@/utils/seo';
import { isWhatsAppAvailable } from '@/utils/whatsapp';

export const ContactPage: React.FC = () => {
  const { settings } = useBusiness();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const hasWhatsApp = isWhatsAppAvailable(settings.whatsapp_number);
  const hasPhone = Boolean(settings.phone && settings.phone.trim().length >= 10);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }
    const cleanPhone = formData.phone.replace(/[^\d+]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);
    try {
      await DataService.createEnquiry({
        customer_name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        enquiry_type: 'general',
        message: `Subject: ${formData.subject || 'General Enquiry'}\n\n${formData.message}`,
      });
      setIsSuccess(true);
      setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Failed to submit message', err);
      setErrorMessage('Failed to send enquiry. Please contact us via phone or WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const localBusinessSchema = generateLocalBusinessSchema(settings);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <SEOHead
        title={`Contact & Store Location | ${settings.shop_name}`}
        description="Contact our hardware counter in Tamil Nadu for pricing, stock enquiries, or driving directions via Google Maps."
        structuredData={localBusinessSchema}
      />

      <Breadcrumbs items={[{ label: 'Contact & Location' }]} />

      <div className="mt-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
          {t('contact_title')}
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-2xl">
          {t('contact_subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Contact Info & Verified Google Maps link */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <h2 className="text-lg font-bold text-navy-950 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-brand-600" />
              Store Information
            </h2>

            <div className="space-y-4 text-sm text-slate-700">
              {/* Address */}
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900">{t('store_address')}</h3>
                  <p className="text-slate-600 mt-0.5">
                    {settings.address || (
                      <span className="text-slate-500">
                        {t('address_not_verified')}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Phone */}
              {hasPhone && (
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-slate-900">{t('phone_number')}</h3>
                    <a
                      href={`tel:${settings.phone}`}
                      className="text-brand-600 hover:underline mt-0.5 inline-block font-medium"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </div>
              )}

              {/* WhatsApp */}
              {hasWhatsApp && (
                <div className="flex items-start space-x-3">
                  <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-slate-900">{t('whatsapp_chat')}</h3>
                    <p className="text-xs text-slate-500 mb-1">
                      Quick quotes for electrical & plumbing lists
                    </p>
                    <WhatsAppButton
                      message="Hello, I want to enquire about materials at your shop."
                      variant="compact"
                      label="Chat on WhatsApp"
                    />
                  </div>
                </div>
              )}

              {/* Opening Hours */}
              {settings.opening_hours && (
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-slate-900">{t('business_hours')}</h3>
                    <p className="text-slate-600 mt-0.5">{settings.opening_hours}</p>
                  </div>
                </div>
              )}

              {/* Email */}
              {settings.email && (
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Email Address</h3>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-slate-700 hover:text-brand-600 mt-0.5 inline-block text-xs"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Google Maps Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
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
              <a
                href={settings.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center px-5 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                {t('view_google_maps')}
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg font-bold text-navy-950 mb-1">
            Send an Enquiry
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Have a question about product specifications, brands, or store hours? Send us a message.
          </p>

          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Enquiry Sent Successfully</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Thank you for contacting us. Our team will review your message and reply via telephone or message.
              </p>
              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                className="px-4 py-2 bg-navy-950 text-white text-xs font-semibold rounded-lg hover:bg-navy-900"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Anand"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 mb-1">
                    Telephone / Mobile Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit number"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="anand@example.com"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs font-semibold text-slate-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Water pump availability"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-semibold text-slate-700 mb-1">
                  Message Details *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help with your hardware or construction material requirements?"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center px-5 py-3 rounded-lg bg-navy-950 hover:bg-navy-900 text-white font-semibold text-sm shadow-sm transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Sending Enquiry...' : 'Submit Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
