'use client';

import { petSearchParams } from '@/lib/searchparams';
import { animals } from '@/types/pet';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export const TYPE_OPTIONS = animals.map((type) => ({
  value: type,
  label: `type_${type}_label`
}));

export function usePetsTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    petSearchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );

  const [typeFilter, setTypeFilter] = useQueryState(
    'type',
    petSearchParams.type.withOptions({ shallow: false })
  );

  const [page, setPage] = useQueryState(
    'page',
    petSearchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setTypeFilter(null);

    setPage(1);
  }, [setSearchQuery, setTypeFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!typeFilter;
  }, [searchQuery, typeFilter]);

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    typeFilter,
    setTypeFilter
  };
}
