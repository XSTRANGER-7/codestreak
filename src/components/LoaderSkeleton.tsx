import React from 'react';

const SkeletonBox = ({ className = '' }) => (
  <div className={`bg-gray-800/30 backdrop-blur-md animate-pulse rounded-md ${className}`}></div>
);

export const DashboardSkeleton = () => {
  return (
    <div className="p-6 space-y-6 bg-black min-h-screen text-white">
      {/* Top Stats */}
      <div className="grid grid-cols-4 gap-4">
        <SkeletonBox className="h-20" />
        <SkeletonBox className="h-20" />
        <SkeletonBox className="h-20" />
        <SkeletonBox className="h-20" />
      </div>

      {/* Weekly Progress + Categories */}
      <div className="grid grid-cols-2 gap-4">
        <SkeletonBox className="h-64" />
        <SkeletonBox className="h-64" />
      </div>

      {/* Quick Actions or More Cards */}
      <div className="grid grid-cols-3 gap-4">
        <SkeletonBox className="h-40" />
        <SkeletonBox className="h-40" />
        <SkeletonBox className="h-40" />
      </div>
    </div>
  );
};
