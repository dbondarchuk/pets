import { ID } from '@/types/with-id';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { SearchParams } from 'next/dist/server/request/search-params';
import {
  vaccinationSearchParamsCache,
  vaccinationSearchSerialize
} from '@/lib/searchparams';
import { columns } from './tables/vaccinations/columns';
import { VaccinationTableAction } from './tables/vaccinations/allergies-table-action';
import { VaccinationTable } from './tables/vaccinations/table';

type VaccinationPageProps = {
  petId: ID;
  searchParams: SearchParams;
};

export async function VaccinationTablePage({
  petId,
  searchParams
}: VaccinationPageProps) {
  // Allow nested RSCs to access the search params (in a type-safe way)
  const parsedSearchParams = vaccinationSearchParamsCache.parse(searchParams);

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  const key = vaccinationSearchSerialize({ ...parsedSearchParams });
  return (
    <div className='flex flex-1 flex-col space-y-4'>
      <VaccinationTableAction petId={petId} />
      <Suspense
        key={key}
        fallback={
          <DataTableSkeleton columnCount={columns.length} rowCount={10} />
        }
      >
        <VaccinationTable petId={petId} />
      </Suspense>
    </div>
  );
}
