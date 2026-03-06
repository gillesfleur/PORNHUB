import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';
import { CategoryCard } from './CategoryCard';
import { ArrowRight } from 'lucide-react';

interface PopularCategoriesProps {
  categories: Category[];
}

export const PopularCategories: React.FC<PopularCategoriesProps> = ({ categories }) => {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <span className="text-primary">📂</span> Catégories populaires
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <CategoryCard key={category.id} category={category} index={index} />
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <Link 
          to="/categories" 
          className="flex items-center gap-2 text-primary font-bold hover:underline transition-all group"
        >
          Voir toutes les catégories
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
};
