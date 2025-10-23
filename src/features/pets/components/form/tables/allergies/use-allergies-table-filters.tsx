'use client';

import { allergySearchParams } from '@/lib/searchparams';
import { allergySeverities } from '@/types/pet';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export const SEVERITY_OPTIONS = allergySeverities.map((severity) => ({
  value: severity,
  label: `allergies_severity_${severity}_label`
}));

export function useAllergiesTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    allergySearchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );

  const [severityFilter, setSeverityFilter] = useQueryState(
    'severity',
    allergySearchParams.severity.withOptions({ shallow: false })
  );

  const [page, setPage] = useQueryState(
    'page',
    allergySearchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setSeverityFilter(null);

    setPage(1);
  }, [setSearchQuery, setSeverityFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!severityFilter;
  }, [searchQuery, severityFilter]);

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    severityFilter,
    setSeverityFilter
  };
}
