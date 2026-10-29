import React from 'react';
import { SEOHead } from '@/components/SEOHead';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { useBusiness } from '@/context/BusinessContext';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const { settings } = useBusiness();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <SEOHead
        title={`Privacy Policy | ${settings.shop_name}`}
        description="Privacy policy and data protection practices for customer quotations, phone communications, and product enquiries."
      />

      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

      <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-8">
        <div>
          <div className="flex items-center space-x-2 text-brand-600 mb-2">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Privacy & Trust</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Last updated: October 2026
          </p>
        </div>

        <section className="space-y-3 text-sm text-slate-700 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 flex items-center">
            <Lock className="w-4 h-4 mr-2 text-brand-600" />
            1. Scope of Privacy Policy
          </h2>
          <p>
            {settings.shop_name} ("we", "our", or "the store") operates a physical retail and wholesale hardware enterprise in Tamil Nadu, India. This Privacy Policy informs customers and contractors regarding our practices for the collection, use, and disclosure of personal data when you interact with our website, request quotations, or message our counter.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-700 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 flex items-center">
            <Eye className="w-4 h-4 mr-2 text-brand-600" />
            2. Information We Collect
          </h2>
          <p>
            We only collect information directly provided by you for the purpose of fulfilling material quotations and product availability enquiries:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li><strong>Contact Information:</strong> Name, phone number, email address, company or firm name.</li>
            <li><strong>Material Requirements:</strong> Bill of Quantities (BOQ), product lists, units, dimensions, and delivery addresses.</li>
            <li><strong>Preferences:</strong> Site language preferences saved in your browser's local storage.</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm text-slate-700 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 flex items-center">
            <FileText className="w-4 h-4 mr-2 text-brand-600" />
            3. How We Use Your Data
          </h2>
          <p>
            Your information is used strictly to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Prepare and communicate price quotations, GST invoices, and material availability.</li>
            <li>Coordinate site deliveries or store pickups for confirmed purchases.</li>
            <li>Respond to technical specification enquiries regarding electrical, plumbing, or hardware tools.</li>
          </ul>
          <p className="font-semibold text-slate-900">
            We never sell, rent, or trade your contact information to third-party telemarketers or advertisers.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-700 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900">
            4. WhatsApp and External Links
          </h2>
          <p>
            Our website provides direct links to communicate via WhatsApp and navigate via Google Maps. When you click these links, your interactions with WhatsApp (Meta) and Google Maps are subject to their respective terms and privacy policies.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-700 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900">
            5. Contacting Us About Data
          </h2>
          <p>
            If you have questions regarding your enquiry data or wish to have past quotation records removed from our system, you may reach out directly via our Contact page or message our store.
          </p>
        </section>
      </div>
    </div>
  );
};

