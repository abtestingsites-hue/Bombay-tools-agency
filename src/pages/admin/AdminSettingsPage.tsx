import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useBusiness } from '@/context/BusinessContext';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings } = useBusiness();

  const [form, setForm] = useState({
    shop_name: '',
    tagline: '',
    phone: '',
    whatsapp_number: '',
    email: '',
    address: '',
    opening_hours: '',
    google_maps_url: '',
    logo_url: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        shop_name: settings.shop_name || '',
        tagline: settings.tagline || '',
        phone: settings.phone || '',
        whatsapp_number: settings.whatsapp_number || '',
        email: settings.email || '',
        address: settings.address || '',
        opening_hours: settings.opening_hours || '',
        google_maps_url: settings.google_maps_url || '',
        logo_url: settings.logo_url || '',
      });
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings(form);
      setSuccessNotice(true);
      setTimeout(() => setSuccessNotice(false), 3000);
    } catch (err: any) {
      alert(`Error saving business settings: ${err?.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
          Business Profile & Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Centralized business identity, contact details, Google Maps integration, and counter hours
        </p>
      </div>

      {successNotice && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-800 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">Business settings saved successfully! Live website updated.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Identity */}
        <div>
          <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wide mb-4">
            Store Identity
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Shop / Company Name *
              </label>
              <input
                type="text"
                name="shop_name"
                required
                value={form.shop_name}
                onChange={handleChange}
                placeholder="e.g. Bombay Tools Agency"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tagline / Subtitle
              </label>
              <input
                type="text"
                name="tagline"
                value={form.tagline}
                onChange={handleChange}
                placeholder="e.g. Hardware, Electrical & Building Materials"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Contact Numbers */}
        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wide mb-4">
            Customer Contact Channels
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp Number (E.164 / Indian)
              </label>
              <input
                type="text"
                name="whatsapp_number"
                value={form.whatsapp_number}
                onChange={handleChange}
                placeholder="e.g. +919876543210"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-brand-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Powers all WhatsApp product & bulk RFQ CTAs.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Telephone / Landline
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. +91 44 2345 6789"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-brand-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Click-to-call phone number.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="contact@bombaytoolsagency.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Location & Maps */}
        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wide mb-4">
            Physical Location & Google Maps
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Google Maps Verified Link *
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  name="google_maps_url"
                  required
                  value={form.google_maps_url}
                  onChange={handleChange}
                  placeholder="https://maps.app.goo.gl/..."
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-brand-500"
                />
                <a
                  href={form.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 inline-flex items-center"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1" />
                  Test
                </a>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Physical Street Address
              </label>
              <textarea
                rows={2}
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Door No, Street Name, Landmark, City/Town, Tamil Nadu - PIN"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Store Opening Hours
              </label>
              <input
                type="text"
                name="opening_hours"
                value={form.opening_hours}
                onChange={handleChange}
                placeholder="e.g. Mon - Sat: 8:30 AM - 8:30 PM (Sunday Closed)"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center px-6 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-xs transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving Settings...' : 'Save Business Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
