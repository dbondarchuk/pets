'use client';

import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useVaccinationTableFilters } from './use-vaccination-table-filters';
import { DeleteSelectedVaccinationsButton } from './delete-selected-button';
import { useSelectedRowsStore } from '@/components/ui/table/use-data-table-context';
import { AddVaccinationButton } from './add-button';
import { DataTableRangeBox } from '@/components/ui/table/data-table-range-box';

export function VaccinationTableAction({ petId }: { petId: string }) {
  const {
    startFilter,
    setStartFilter,
    endFilter,
    setEndFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useVaccinationTableFilters();
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
        <DataTableRangeBox
          startValue={startFilter}
          setStartValue={setStartFilter}
          endValue={endFilter}
          setEndValue={setEndFilter}
        />
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>
      <div className='flex flex-wrap items-center gap-4'>
        <DeleteSelectedVaccinationsButton
          selected={rowSelection}
          petId={petId}
        />
        <AddVaccinationButton petId={petId} />
      </div>
    </div>
  );
}
