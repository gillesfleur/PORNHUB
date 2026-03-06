import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-2 text-xs sm:text-sm text-muted font-medium py-4">
      <Link 
        to="/" 
        className="flex items-center gap-1 hover:text-primary transition-colors"
      >
        <Home size={14} />
        <span className="hidden sm:inline">Accueil</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={14} className="opacity-40" />
          {item.href ? (
            <Link 
              to={item.href} 
              className="hover:text-primary transition-colors line-clamp-1"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-main font-bold line-clamp-1">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
