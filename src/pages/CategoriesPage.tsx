import React, { useState, useEffect } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { CategoryCard } from '@/components/common/CategoryCard';
import { DataService } from '@/services/dataService';
import { Category } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

export const CategoriesPage: React.FC = () => {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const cats = await DataService.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <SEOHead
        title="Material Categories | Electrical, Plumbing, Tools & Hardware"
        description="Explore our hardware store categories: electrical wiring, plumbing pipes and fittings, heavy fasteners, construction chemicals, sanitaryware, power tools, and water pumps."
      />

      <Breadcrumbs items={[{ label: 'Categories' }]} />

      <div className="mt-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
          {t('categories_title')}
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-2xl">
          {t('categories_subtitle')}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-slate-100 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      )}
    </div>
  );
};
