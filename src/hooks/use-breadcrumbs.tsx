'use client';

import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type BreadcrumbItem = {
  title: string;
  link: string;
};

const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/dashboard': [{ title: 'dashboard', link: '/dashboard' }],
  '/dashboard/pets': [
    { title: 'dashboard', link: '/dashboard' },
    { title: 'pets', link: '/dashboard/pets' }
  ]
};

const BreadcrumbsContext = createContext<BreadcrumbItem[]>([]);
const BreadcrumbsSetContext = createContext<
  React.Dispatch<React.SetStateAction<BreadcrumbItem[]>>
>(() => {});

export function BreadcrumbsProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  return (
    <BreadcrumbsContext.Provider value={breadcrumbs}>
      <BreadcrumbsSetContext.Provider value={setBreadcrumbs}>
        {children}
      </BreadcrumbsSetContext.Provider>
    </BreadcrumbsContext.Provider>
  );
}

export function useBreadcrumbs() {
  const context = useContext(BreadcrumbsContext);
  const setBreadcrumbs = useContext(BreadcrumbsSetContext);
  const pathname = usePathname();
  useEffect(() => {
    setBreadcrumbs([]);
  }, [pathname, setBreadcrumbs]);

  const breadcrumbs = useMemo(() => {
    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    // If no exact match, fall back to generating breadcrumbs from the path
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path
      };
    });
  }, [pathname]);

  if (context?.length > 0) {
    return context;
  }

  return breadcrumbs;
}

export const PageBreadcrumbs = ({
  breadcrumbs
}: {
  breadcrumbs: BreadcrumbItem[];
}) => {
  const setBreadcrumbs = useContext(BreadcrumbsSetContext);
  useEffect(() => {
    setBreadcrumbs(breadcrumbs);
  }, [breadcrumbs, setBreadcrumbs]);

  return null;
};
