'use client';

import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { TYPE_OPTIONS, usePetsTableFilters } from './use-pets-table-filters';
import { useTranslation } from '@/i18n/client';
import { DeleteSelectedRecordsButton } from './delete-selected-button';
import { useSelectedRowsStore } from '@/components/ui/table/use-data-table-context';

export default function PetsTableAction() {
  const {
    typeFilter,
    setTypeFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = usePetsTableFilters();
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
          title={t('type_label')}
          options={TYPE_OPTIONS}
          setFilterValue={(value) => setTypeFilter(value as any)}
          filterValue={typeFilter as string}
        />
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>
      <div className='flex flex-wrap items-center gap-4'>
        <DeleteSelectedRecordsButton selected={rowSelection} />
      </div>
    </div>
  );
}
