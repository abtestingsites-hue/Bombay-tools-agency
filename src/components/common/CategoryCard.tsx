import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '@/types';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link
      to={`/categories/${category.slug}`}
      className="group relative bg-white rounded-xl border border-slate-200 hover:border-brand-500 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
    >
      <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100 relative">
        <img
          src={category.image_url}
          alt={category.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/20 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-brand-300 transition-colors drop-shadow-sm">
            {category.name}
          </h3>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
          {category.description}
        </p>
        <div className="mt-3 pt-2 flex items-center text-xs font-semibold text-brand-600 group-hover:text-brand-700">
          <span>Browse Materials</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

