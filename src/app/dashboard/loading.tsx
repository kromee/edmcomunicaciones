'use client';

import { Sidebar } from '@/components/DashboardSidebar';

export default function Loading() {
  return (
    <div className="min-h-screen bg-surface-secondary">
      <Sidebar />
      
      <main className="lg:ml-64 transition-all duration-300">
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header Skeleton */}
          <div className="mb-8 flex items-start gap-4">
            <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse" />
            <div className="space-y-2">
              <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-4 w-64 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 sm:p-6 shadow-card">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 bg-gray-200 rounded-2xl animate-pulse" />
                  <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="h-4 w-32 bg-gray-200 rounded-lg animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* Content Skeleton */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="h-6 w-48 bg-gray-200 rounded-lg animate-pulse mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-0">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
