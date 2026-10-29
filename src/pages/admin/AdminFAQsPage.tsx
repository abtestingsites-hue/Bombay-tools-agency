import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  X,
  ExternalLink,
} from 'lucide-react';
import { DataService } from '@/services/dataService';
import { FAQ } from '@/types';
import { Link } from 'react-router-dom';

export const AdminFAQsPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
    slug: '',
    sort_order: 1,
    is_published: true,
  });

  const loadFaqs = async () => {
    setIsLoading(true);
    try {
      const data = await DataService.getFAQs({ includeUnpublished: true });
      setFaqs(data);
    } catch (err) {
      console.error('Failed to load FAQs', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const openCreateModal = () => {
    setEditingFaq(null);
    setFormData({
      question: '',
      answer: '',
      category: 'General',
      slug: '',
      sort_order: faqs.length + 1,
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (faq: FAQ) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      slug: faq.slug,
      sort_order: faq.sort_order,
      is_published: faq.is_published,
    });
    setIsModalOpen(true);
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    if (!editingFaq) {
      const slug = q
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 50);
      setFormData((prev) => ({ ...prev, question: q, slug }));
    } else {
      setFormData((prev) => ({ ...prev, question: q }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFaq) {
        await DataService.adminUpdateFAQ(editingFaq.id, {
          question: formData.question,
          answer: formData.answer,
          category: formData.category,
          slug: formData.slug,
          sort_order: Number(formData.sort_order),
          is_published: formData.is_published,
        });
      } else {
        await DataService.adminCreateFAQ({
          question: formData.question,
          answer: formData.answer,
          category: formData.category,
          slug: formData.slug || `faq-${Date.now()}`,
          sort_order: Number(formData.sort_order),
          is_published: formData.is_published,
        });
      }
      setIsModalOpen(false);
      loadFaqs();
    } catch (err: any) {
      alert(`Error saving FAQ: ${err?.message}`);
    }
  };

  const handleTogglePublish = async (faq: FAQ) => {
    try {
      await DataService.adminUpdateFAQ(faq.id, { is_published: !faq.is_published });
      loadFaqs();
    } catch (err: any) {
      alert(`Error updating publication status: ${err?.message}`);
    }
  };

  const handleDelete = async (faq: FAQ) => {
    if (confirm(`Are you sure you want to delete FAQ "${faq.question}"?`)) {
      try {
        await DataService.adminDeleteFAQ(faq.id);
        loadFaqs();
      } catch (err: any) {
        alert(`Error deleting FAQ: ${err?.message}`);
      }
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
            FAQ & Answer Engine Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Maintain accurate answers for customer questions, SEO structured data, and trade queries
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add FAQ
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading FAQs...</div>
        ) : faqs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No FAQs found. Click "Add FAQ" to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Question & Answer</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Visibility</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {faqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3.5 font-bold text-slate-400">
                      #{faq.sort_order}
                    </td>
                    <td className="px-5 py-3.5 max-w-md">
                      <span className="font-bold text-slate-900 block mb-0.5">
                        {faq.question}
                      </span>
                      <p className="text-slate-500 line-clamp-2 text-[11px] leading-relaxed">
                        {faq.answer}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                        /faq/{faq.slug}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-block px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                        {faq.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(faq)}
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                          faq.is_published
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {faq.is_published ? (
                          <>
                            <Eye className="w-3 h-3 mr-1 text-emerald-600" />
                            Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 mr-1 text-slate-400" />
                            Draft / Hidden
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2 whitespace-nowrap">
                      <Link
                        to={`/faq/${faq.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded text-slate-400 hover:text-brand-600 hover:bg-slate-100 inline-block"
                        title="Preview FAQ page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => openEditModal(faq)}
                        className="p-1.5 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100"
                        title="Edit FAQ"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(faq)}
                        className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-slate-100"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FAQ Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-navy-950">
                {editingFaq ? 'Edit FAQ' : 'Add FAQ'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Question *
                </label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={handleQuestionChange}
                  placeholder="e.g. Do you supply site deliveries for PVC pipes?"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Delivery, Pricing, Brands"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Answer Content *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Provide a direct answer followed by supporting terms and next action..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="publishedToggle"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4"
                />
                <label htmlFor="publishedToggle" className="font-semibold text-slate-700">
                  Publish (Visible to public visitors & in FAQPage schema)
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-xs"
                >
                  {editingFaq ? 'Save FAQ' : 'Create FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
