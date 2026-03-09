import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  totalItems: number;
}

export const AdminPagination: React.FC<AdminPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalItems
}) => {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-surface border-t border-muted/10">
      <div className="text-xs font-bold text-muted">
        Affichage de <span className="text-main">{startItem}</span> à <span className="text-main">{endItem}</span> sur <span className="text-main">{totalItems}</span> vidéos
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted">Afficher</span>
          <select 
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-background border border-muted/20 rounded-lg px-2 py-1 text-xs font-bold text-main focus:outline-none focus:border-primary/50 transition-all"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="p-2 rounded-lg bg-background border border-muted/20 text-muted hover:text-main disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="flex items-center gap-1">
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${
                    currentPage === pageNum 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'bg-background border border-muted/20 text-muted hover:text-main'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            {totalPages > 5 && <span className="text-muted px-1">...</span>}
          </div>

          <button 
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="p-2 rounded-lg bg-background border border-muted/20 text-muted hover:text-main disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
