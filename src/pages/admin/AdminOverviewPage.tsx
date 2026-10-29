import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  FolderTree,
  Inbox,
  TrendingUp,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { DataService } from '@/services/dataService';
import { Enquiry } from '@/types';

export const AdminOverviewPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalCategories: 0,
    activeCategories: 0,
    totalEnquiries: 0,
    newEnquiries: 0,
    recentActivity: [] as Enquiry[],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await DataService.adminGetStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time statistics computed from live store records
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/products"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add New Product
          </Link>
          <Link
            to="/admin/enquiries"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-navy-950 hover:bg-navy-900 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Inbox className="w-4 h-4 mr-1.5" />
            View Enquiries
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Active Products */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
              Active Products
            </span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">
              {isLoading ? '...' : stats.activeProducts}
            </span>
            <span className="text-[11px] text-slate-400">
              {stats.totalProducts} total in catalog
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
              Active Categories
            </span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">
              {isLoading ? '...' : stats.activeCategories}
            </span>
            <span className="text-[11px] text-slate-400">
              {stats.totalCategories} total categories
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FolderTree className="w-6 h-6" />
          </div>
        </div>

        {/* New Enquiries */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
              New Enquiries
            </span>
            <span className="text-2xl font-bold text-emerald-600 mt-1 block">
              {isLoading ? '...' : stats.newEnquiries}
            </span>
            <span className="text-[11px] text-slate-400">
              Awaiting contact or quote
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Inbox className="w-6 h-6" />
          </div>
        </div>

        {/* Total Enquiries */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
              Total Enquiries
            </span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">
              {isLoading ? '...' : stats.totalEnquiries}
            </span>
            <span className="text-[11px] text-slate-400">
              Cumulative project quotes
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-navy-950">Recent Customer Enquiries</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Quotations and enquiries received through online forms
            </p>
          </div>
          <Link
            to="/admin/enquiries"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="p-6 text-center text-xs text-slate-400">Loading activity...</div>
        ) : stats.recentActivity.length === 0 ? (
          <div className="p-10 text-center text-slate-500 text-xs">
            No customer enquiries recorded yet. Submissions from Bulk Orders and Contact will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Requirement</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentActivity.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3 font-semibold text-slate-900">
                      {enq.customer_name}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      <a href={`tel:${enq.phone}`} className="hover:underline text-brand-600 font-medium">
                        {enq.phone}
                      </a>
                    </td>
                    <td className="px-5 py-3">
                      <span className="capitalize bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                        {enq.enquiry_type}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-700 max-w-xs truncate">
                      {enq.requested_products || enq.message || '—'}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          enq.status === 'new'
                            ? 'bg-emerald-100 text-emerald-800'
                            : enq.status === 'contacted'
                            ? 'bg-blue-100 text-blue-800'
                            : enq.status === 'quoted'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(enq.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
