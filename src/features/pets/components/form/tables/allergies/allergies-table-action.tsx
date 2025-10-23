'use client';

import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import {
  SEVERITY_OPTIONS,
  useAllergiesTableFilters
} from './use-allergies-table-filters';
import { useTranslation } from '@/i18n/client';
import { DeleteSelectedAllergiesButton } from './delete-selected-button';
import { useSelectedRowsStore } from '@/components/ui/table/use-data-table-context';
import { AddAllergyButton } from './add-button';

export function AllergiesTableAction({ petId }: { petId: string }) {
  const {
    severityFilter,
    setSeverityFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useAllergiesTableFilters();
  const { t } = useTranslation();
  const { rowSelection } = useSelectedRowsStore();

  return (
    <div className='flex flex-col flex-wrap items-center justify-between gap-4 md:flex-row'>
      <div className='flex flex-1 flex-wrap items-center gap-4'>
        <DataTableSearch
          searchKey='name'
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
        <DataTableFilterBox
          filterKey='type'
          title={t('allergies_severity_label')}
          options={SEVERITY_OPTIONS}
          setFilterValue={(value) => setSeverityFilter(value as any)}
          filterValue={severityFilter as string}
        />
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>
      <div className='flex flex-wrap items-center gap-4'>
        <DeleteSelectedAllergiesButton selected={rowSelection} petId={petId} />
        <AddAllergyButton petId={petId} />
      </div>
    </div>
  );
}
