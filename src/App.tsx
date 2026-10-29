import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from '@/context/LanguageContext';
import { BusinessProvider } from '@/context/BusinessContext';
import { AuthProvider } from '@/context/AuthContext';

// Layouts
import { Layout } from '@/components/layout/Layout';
import { AdminLayout } from '@/pages/admin/AdminLayout';

// Public Pages
import { HomePage } from '@/pages/HomePage';
import { ProductsPage } from '@/pages/ProductsPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { CategoriesPage } from '@/pages/CategoriesPage';
import { CategoryDetailPage } from '@/pages/CategoryDetailPage';
import { BrandsPage } from '@/pages/BrandsPage';
import { BrandDetailPage } from '@/pages/BrandDetailPage';
import { BulkOrdersPage } from '@/pages/BulkOrdersPage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { FAQPage } from '@/pages/FAQPage';
import { FAQDetailPage } from '@/pages/FAQDetailPage';
import { PrivacyPolicyPage } from '@/pages/PrivacyPolicyPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

// Admin Pages
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminOverviewPage } from '@/pages/admin/AdminOverviewPage';
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage';
import { AdminCategoriesPage } from '@/pages/admin/AdminCategoriesPage';
import { AdminEnquiriesPage } from '@/pages/admin/AdminEnquiriesPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';
import { AdminFAQsPage } from '@/pages/admin/AdminFAQsPage';
import { AdminSEOPage } from '@/pages/admin/AdminSEOPage';

export function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <BusinessProvider>
          <AuthProvider>
            <Routes>
              {/* Public Website Routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/:slug" element={<ProductDetailPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="categories/:slug" element={<CategoryDetailPage />} />
                <Route path="brands" element={<BrandsPage />} />
                <Route path="brands/:slug" element={<BrandDetailPage />} />
                <Route path="bulk-orders" element={<BulkOrdersPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="faq" element={<FAQPage />} />
                <Route path="faq/:slug" element={<FAQDetailPage />} />
                <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Admin Portal Authentication */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Protected Admin Portal Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminOverviewPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="enquiries" element={<AdminEnquiriesPage />} />
                <Route path="faqs" element={<AdminFAQsPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
                <Route path="seo" element={<AdminSEOPage />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BusinessProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
