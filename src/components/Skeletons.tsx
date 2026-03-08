import React from 'react';

const Shimmer = () => (
  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
);

export const VideoCardSkeleton: React.FC<{ variant?: 'default' | 'horizontal' | 'compact' }> = ({ variant = 'default' }) => {
  if (variant === 'horizontal') {
    return (
      <div className="flex gap-4 p-2 rounded-xl">
        <div className="relative w-[40%] h-[100px] flex-shrink-0 bg-surface rounded-lg overflow-hidden animate-pulse" />
        <div className="flex-grow space-y-2 py-1">
          <div className="h-4 bg-surface rounded w-full animate-pulse" />
          <div className="h-4 bg-surface rounded w-2/3 animate-pulse" />
          <div className="h-3 bg-surface rounded w-1/3 animate-pulse mt-4" />
        </div>
      </div>
    );
  }

  const isCompact = variant === 'compact';

  return (
    <div className="space-y-3">
      <div className="relative aspect-video bg-surface rounded-xl overflow-hidden animate-pulse" />
      <div className="space-y-2 px-1">
        <div className={`bg-surface rounded animate-pulse ${isCompact ? 'h-3 w-full' : 'h-4 w-full'}`} />
        {!isCompact && <div className="h-4 bg-surface rounded w-2/3 animate-pulse" />}
        <div className="flex items-center gap-3 mt-2">
          <div className="h-3 bg-surface rounded w-16 animate-pulse" />
          <div className="h-3 bg-surface rounded w-12 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export const PornstarCardSkeleton: React.FC = () => (
  <div className="flex flex-col items-center space-y-3">
    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-surface animate-pulse" />
    <div className="h-4 bg-surface rounded w-20 animate-pulse" />
    <div className="h-3 bg-surface rounded w-12 animate-pulse" />
  </div>
);

export const CategoryCardSkeleton: React.FC = () => (
  <div className="h-28 sm:h-36 rounded-xl bg-surface animate-pulse overflow-hidden relative" />
);

export const VideoPlayerSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="relative aspect-video bg-surface rounded-3xl animate-pulse overflow-hidden flex flex-col justify-end p-6">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white/10" />
          <div className="w-32 h-2 bg-white/10 rounded" />
        </div>
        <div className="flex items-center gap-4">
          <div className="w-24 h-2 bg-white/10 rounded" />
          <div className="w-10 h-10 rounded bg-white/10" />
        </div>
      </div>
    </div>
    <div className="space-y-4">
      <div className="h-8 bg-surface rounded-xl w-3/4 animate-pulse" />
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-surface animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 bg-surface rounded w-32 animate-pulse" />
          <div className="h-3 bg-surface rounded w-24 animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);

export const CommentSkeleton: React.FC = () => (
  <div className="flex gap-4">
    <div className="w-10 h-10 rounded-full bg-surface animate-pulse shrink-0" />
    <div className="flex-grow space-y-2">
      <div className="flex items-center gap-2">
        <div className="h-3 bg-surface rounded w-24 animate-pulse" />
        <div className="h-3 bg-surface rounded w-16 animate-pulse" />
      </div>
      <div className="h-4 bg-surface rounded w-full animate-pulse" />
      <div className="h-4 bg-surface rounded w-5/6 animate-pulse" />
    </div>
  </div>
);

export const PageSkeleton: React.FC = () => (
  <div className="container mx-auto px-4 py-8 space-y-8">
    <div className="h-10 bg-surface rounded-xl w-48 animate-pulse" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <VideoCardSkeleton key={i} />
      ))}
    </div>
  </div>
);
