import React from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Inbox,
  Settings,
  HelpCircle,
  Search,
  LogOut,
  ExternalLink,
  Wrench,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useBusiness } from '@/context/BusinessContext';
import { isSupabaseConfigured } from '@/lib/supabase';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, isLoading, logout } = useAuth();
  const { settings } = useBusiness();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="flex items-center space-x-2 text-slate-600 text-sm font-semibold">
          <div className="w-4 h-4 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
          <span>Verifying admin session...</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-brand-600 text-white font-semibold shadow-xs'
        : 'text-slate-300 hover:bg-navy-900 hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-navy-950 text-white flex flex-col justify-between shrink-0 shadow-lg">
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold block truncate max-w-[140px]">
                  {settings.shop_name}
                </span>
                <span className="text-[11px] text-slate-400 block">Admin Portal</span>
              </div>
            </div>
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white"
              title="Open Live Public Site"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <NavLink to="/admin" end className={navClass}>
              <LayoutDashboard className="w-4 h-4 mr-3" />
              Overview
            </NavLink>
            <NavLink to="/admin/products" className={navClass}>
              <Package className="w-4 h-4 mr-3" />
              Products
            </NavLink>
            <NavLink to="/admin/categories" className={navClass}>
              <FolderTree className="w-4 h-4 mr-3" />
              Categories
            </NavLink>
            <NavLink to="/admin/enquiries" className={navClass}>
              <Inbox className="w-4 h-4 mr-3" />
              Enquiries
            </NavLink>
            <NavLink to="/admin/faqs" className={navClass}>
              <HelpCircle className="w-4 h-4 mr-3" />
              FAQs
            </NavLink>
            <NavLink to="/admin/seo" className={navClass}>
              <Search className="w-4 h-4 mr-3" />
              SEO Management
            </NavLink>
            <NavLink to="/admin/settings" className={navClass}>
              <Settings className="w-4 h-4 mr-3" />
              Business Settings
            </NavLink>
          </nav>
        </div>

        {/* User info & Sign out */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="text-xs text-slate-400 truncate">
            Signed in as: <strong className="text-slate-200 block truncate">{user?.email || 'Administrator'}</strong>
          </div>
          {!isSupabaseConfigured && (
            <div className="bg-amber-950/60 border border-amber-800/60 rounded px-2 py-1 text-[10px] text-amber-300 flex items-center">
              <ShieldAlert className="w-3 h-3 mr-1 shrink-0" />
              <span>Offline/Mock Mode</span>
            </div>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 mr-2" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

