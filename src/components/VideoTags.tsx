import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Tag as TagIcon, FolderOpen } from 'lucide-react';

interface VideoTagsProps {
  category: string;
  tags: string[];
}

export const VideoTags: React.FC<VideoTagsProps> = ({ category, tags }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const slugify = (text: string) => {
    return text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  };

  const visibleTags = isExpanded ? tags : tags.slice(0, 6);
  const hasMore = tags.length > 6;

  return (
    <div className="space-y-6 pt-2">
      {/* Category Section */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-muted text-sm font-bold uppercase tracking-wider">
          <FolderOpen size={16} className="text-primary" />
          Catégorie :
        </div>
        <Link 
          to={`/category/${slugify(category)}`}
          className="bg-primary/10 hover:bg-primary text-primary hover:text-white px-4 py-1.5 rounded-full text-sm font-black transition-all border border-primary/20"
        >
          {category}
        </Link>
      </div>

      {/* Tags Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-muted text-sm font-bold uppercase tracking-wider">
          <TagIcon size={16} className="text-primary" />
          Tags :
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Desktop shows all, Mobile respects isExpanded */}
          {tags.map((tag, index) => {
            const isHiddenOnMobile = !isExpanded && index >= 6;
            return (
              <Link 
                key={tag}
                to={`/tag/${slugify(tag)}`}
                className={`bg-surface px-4 py-2 rounded-xl text-xs font-bold text-muted uppercase tracking-widest border border-muted/10 hover:border-primary/40 hover:text-primary transition-all ${
                  isHiddenOnMobile ? 'hidden sm:flex' : 'flex'
                }`}
              >
                #{tag}
              </Link>
            );
          })}

          {/* Mobile Toggle Button */}
          {hasMore && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="sm:hidden flex items-center gap-1 bg-surface/50 px-4 py-2 rounded-xl text-xs font-black text-primary uppercase tracking-widest border border-primary/20 transition-all"
            >
              {isExpanded ? (
                <>
                  <ChevronUp size={14} />
                  Moins
                </>
              ) : (
                <>
                  <ChevronDown size={14} />
                  +{tags.length - 6} tags
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
