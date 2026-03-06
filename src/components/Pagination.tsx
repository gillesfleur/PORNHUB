import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  totalPages?: number;
  initialPage?: number;
  onPageChange?: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ 
  totalPages = 10, 
  initialPage = 1,
  onPageChange
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    if (onPageChange) {
      onPageChange(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPageNumbers = () => {
    const pages = [];
    const delta = 1; // Number of pages to show around current page

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || 
        i === totalPages || 
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(
          <button
            key={i}
            onClick={() => goToPage(i)}
            className={`w-10 h-10 rounded-lg font-bold transition-all ${
              currentPage === i 
                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' 
                : 'bg-surface border border-muted text-main hover:border-primary hover:text-primary'
            }`}
          >
            {i}
          </button>
        );
      } else if (i === currentPage - delta - 1 || i === currentPage + delta + 1) {
        pages.push(
          <span key={i} className="text-muted px-1">...</span>
        );
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12 mb-8">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-4 h-10 rounded-lg bg-surface border border-muted text-main font-bold hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={18} />
        <span className="hidden sm:inline">Précédent</span>
      </button>

      <div className="flex items-center gap-1 sm:gap-2">
        {renderPageNumbers()}
      </div>

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-4 h-10 rounded-lg bg-surface border border-muted text-main font-bold hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <span className="hidden sm:inline">Suivant</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
};
