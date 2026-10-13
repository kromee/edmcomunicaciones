'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/DashboardSidebar';

function ListRouteLoading({ collapsed }: { collapsed: boolean }) {
  const offset = collapsed ? 'lg:ml-20' : 'lg:ml-64';

  return (
    <>
      <div className={`sticky top-0 z-30 h-16 border-b border-gray-100 bg-white sm:h-20 ${offset}`}>
        <div className="flex h-full items-center px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-full max-w-md rounded-md bg-surface-secondary" />
        </div>
      </div>

      <main className={offset}>
        <div className="px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="h-8 w-44 rounded-md bg-gray-200/80" />
            <div className="flex items-center gap-2">
              <div className="h-10 w-28 rounded-md border border-gray-200 bg-white" />
              <div className="h-10 w-40 rounded-md bg-brand/90" />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
            <div className="hidden border-b border-gray-100 bg-surface-secondary/60 px-4 py-3 md:block">
              <div className="h-3 w-full rounded bg-gray-200/70" />
            </div>
            <div className="divide-y divide-gray-100">
              {Array.from({ length: 8 }, (_, index) => (
                <div key={index} className="flex items-center gap-4 px-4 py-3">
                  <div className="h-8 w-8 shrink-0 rounded-lg bg-brand/10" />
                  <div className="h-3.5 flex-1 rounded bg-gray-100" />
                  <div className="hidden h-3.5 w-28 rounded bg-gray-100 sm:block" />
                  <div className="hidden h-6 w-20 rounded-lg bg-brand/80 md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function DashboardHomeLoading({ collapsed }: { collapsed: boolean }) {
  const offset = collapsed ? 'lg:ml-20' : 'lg:ml-64';

  return (
    <main className={offset}>
      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-8 h-8 w-64 rounded-md bg-gray-200/80" />
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="rounded-xl border border-gray-100 bg-white p-5">
              <div className="h-4 w-24 rounded bg-gray-200/80" />
              <div className="mt-4 h-8 w-20 rounded bg-gray-200/80" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function Loading() {
  const pathname = usePathname();
  const isQuotes = pathname.startsWith('/dashboard/cotizaciones');
  const isClients = pathname.startsWith('/dashboard/clientes');
  const collapsed = isQuotes;

  return (
    <div className="min-h-screen bg-surface-secondary">
      <Sidebar defaultCollapsed={collapsed} />
      {isQuotes || isClients ? (
        <ListRouteLoading collapsed={collapsed} />
      ) : (
        <DashboardHomeLoading collapsed={collapsed} />
      )}
    </div>
  );
}
