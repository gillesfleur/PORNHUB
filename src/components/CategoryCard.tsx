import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';
import { motion } from 'motion/react';

interface CategoryCardProps {
  category: Category;
  index: number;
}

const colors = [
  'bg-blue-600',
  'bg-purple-600',
  'bg-pink-600',
  'bg-red-600',
  'bg-orange-600',
  'bg-green-600',
  'bg-indigo-600',
  'bg-teal-600',
];

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, index }) => {
  const bgColor = colors[index % colors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: (index % 8) * 0.05, duration: 0.4 }}
    >
      <Link 
        to={`/category/${category.slug}`}
        className={`relative group h-28 sm:h-36 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-primary/20 ${bgColor} block`}
      >
        {/* Background Image if available */}
        {category.image && (
          <img 
            src={category.image} 
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        )}

        {/* Overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-all" />
        
        {/* Category Name */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <span className="text-white font-black text-lg sm:text-xl uppercase tracking-tighter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
            {category.name}
          </span>
        </div>

        {/* Video Count Badge */}
        <div className="absolute bottom-2 right-2 bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg border border-white/10">
          {category.videoCount.toLocaleString()}
        </div>
      </Link>
    </motion.div>
  );
};
