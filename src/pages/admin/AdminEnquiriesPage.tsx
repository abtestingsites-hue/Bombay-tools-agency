import React, { useState, useEffect } from 'react';
import {
  Search,
  Phone,
  MessageCircle,
  Edit3,
  Save,
  X,
} from 'lucide-react';
import { DataService } from '@/services/dataService';
import { Enquiry, EnquiryStatus } from '@/types';
import { generateWhatsAppUrl } from '@/utils/whatsapp';

export const AdminEnquiriesPage: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Selected for viewing / notes edit
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const loadEnquiries = async () => {
    setIsLoading(true);
    try {
      const data = await DataService.adminGetEnquiries({
        status: statusFilter !== 'all' ? (statusFilter as EnquiryStatus) : undefined,
        search: search || undefined,
      });
      setEnquiries(data);
    } catch (err) {
      console.error('Failed to load enquiries', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, [statusFilter, search]);

  const handleStatusChange = async (enquiryId: string, newStatus: EnquiryStatus) => {
    try {
      const updated = await DataService.adminUpdateEnquiry(enquiryId, { status: newStatus });
      setEnquiries((prev) => prev.map((e) => (e.id === enquiryId ? updated : e)));
      if (selectedEnquiry?.id === enquiryId) {
        setSelectedEnquiry(updated);
      }
    } catch (err: any) {
      alert(`Error updating status: ${err?.message}`);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    setIsSavingNotes(true);
    try {
      const updated = await DataService.adminUpdateEnquiry(selectedEnquiry.id, {
        internal_notes: notesInput,
      });
      setEnquiries((prev) => prev.map((e) => (e.id === selectedEnquiry.id ? updated : e)));
      setSelectedEnquiry(updated);
      alert('Internal notes saved successfully.');
    } catch (err: any) {
      alert(`Error saving notes: ${err?.message}`);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const openEnquiryDrawer = (enq: Enquiry) => {
    setSelectedEnquiry(enq);
    setNotesInput(enq.internal_notes || '');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
            Customer Enquiries & Quotations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Process incoming bulk RFQs, contact clients, and track quotation status
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, phone number, or product..."
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center space-x-1 w-full sm:w-auto overflow-x-auto">
          {['all', 'new', 'contacted', 'quoted', 'closed'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-navy-950 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading enquiries...</div>
        ) : enquiries.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No enquiries found matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Phone & WhatsApp</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Requirement</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Received</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enquiries.map((enq) => {
                  const whatsappChatUrl = generateWhatsAppUrl(
                    enq.phone,
                    `Hello ${enq.customer_name}, regarding your quotation request on Bombay Tools Agency:`
                  );
                  return (
                    <tr key={enq.id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-slate-900 block">
                          {enq.customer_name}
                        </span>
                        {enq.email && (
                          <span className="text-[11px] text-slate-400">
                            {enq.email}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center space-x-2">
                          <a
                            href={`tel:${enq.phone}`}
                            className="inline-flex items-center text-slate-700 hover:text-brand-600 font-semibold"
                            title="Call customer"
                          >
                            <Phone className="w-3.5 h-3.5 mr-1 text-brand-600" />
                            {enq.phone}
                          </a>
                          <a
                            href={whatsappChatUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            title="Open WhatsApp chat with client"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="capitalize bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded font-semibold text-[10px]">
                          {enq.enquiry_type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-700 max-w-xs truncate">
                        {enq.requested_products || enq.message || '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        <select
                          value={enq.status}
                          onChange={(e) =>
                            handleStatusChange(enq.id, e.target.value as EnquiryStatus)
                          }
                          className={`rounded px-2 py-1 text-[11px] font-bold border focus:outline-none ${
                            enq.status === 'new'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : enq.status === 'contacted'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : enq.status === 'quoted'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-slate-100 text-slate-700 border-slate-300'
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="quoted">Quoted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                        {new Date(enq.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openEnquiryDrawer(enq)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                        >
                          View / Notes
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Enquiry Detail & Internal Notes Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-navy-950">
                  Enquiry Details
                </h2>
                <span className="text-xs text-slate-400">
                  Received on {new Date(selectedEnquiry.created_at).toLocaleString()}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block">Customer Name</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedEnquiry.customer_name}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Phone</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedEnquiry.phone}
                  </span>
                </div>
              </div>

              {selectedEnquiry.requested_products && (
                <div>
                  <span className="font-bold text-slate-700 uppercase tracking-wide block mb-1">
                    Requested Materials / BOQ
                  </span>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-slate-800 whitespace-pre-line">
                    {selectedEnquiry.requested_products}
                  </div>
                </div>
              )}

              {selectedEnquiry.message && (
                <div>
                  <span className="font-bold text-slate-700 uppercase tracking-wide block mb-1">
                    Customer Message & Notes
                  </span>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-slate-800 whitespace-pre-line">
                    {selectedEnquiry.message}
                  </div>
                </div>
              )}

              {/* Admin-only Internal Notes */}
              <div className="pt-2">
                <label className="font-bold text-slate-900 uppercase tracking-wide block mb-1 flex items-center">
                  <Edit3 className="w-3.5 h-3.5 mr-1 text-brand-600" />
                  Administrator Internal Notes (Private)
                </label>
                <textarea
                  rows={3}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Record quoted rates, follow-up dates, payment terms, or delivery arrangements..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <a
                  href={`tel:${selectedEnquiry.phone}`}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 inline-flex items-center"
                >
                  <Phone className="w-3.5 h-3.5 mr-1 text-brand-600" />
                  Call
                </a>
                <a
                  href={generateWhatsAppUrl(
                    selectedEnquiry.phone,
                    `Hello ${selectedEnquiry.customer_name}, regarding your quotation request:`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center"
                >
                  <MessageCircle className="w-3.5 h-3.5 mr-1" />
                  WhatsApp
                </a>
              </div>

              <button
                type="button"
                disabled={isSavingNotes}
                onClick={handleSaveNotes}
                className="px-4 py-1.5 rounded-lg bg-navy-950 hover:bg-navy-900 text-white text-xs font-semibold inline-flex items-center"
              >
                <Save className="w-3.5 h-3.5 mr-1.5" />
                {isSavingNotes ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
