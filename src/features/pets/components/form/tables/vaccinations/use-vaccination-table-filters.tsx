'use client';

import { vaccinationSearchParams } from '@/lib/searchparams';
import { allergySeverities } from '@/types/pet';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export const SEVERITY_OPTIONS = allergySeverities.map((severity) => ({
  value: severity,
  label: `allergies_severity_${severity}_label`
}));

export function useVaccinationTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    vaccinationSearchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );

  const [startFilter, setStartFilter] = useQueryState(
    'start',
    vaccinationSearchParams.start.withOptions({ shallow: false })
  );

  const [endFilter, setEndFilter] = useQueryState(
    'end',
    vaccinationSearchParams.end.withOptions({ shallow: false })
  );

  const [page, setPage] = useQueryState(
    'page',
    vaccinationSearchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setStartFilter(null);
    setEndFilter(null);

    setPage(1);
  }, [setSearchQuery, setStartFilter, setEndFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!startFilter || !!endFilter;
  }, [searchQuery, startFilter, endFilter]);

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    startFilter,
    setStartFilter,
    endFilter,
    setEndFilter
  };
}
