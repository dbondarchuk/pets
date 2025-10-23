import { ID } from '@/types/with-id';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { AllergiesTableAction } from './tables/allergies/allergies-table-action';
import { AllergiesTable } from './tables/allergies/table';
import { SearchParams } from 'next/dist/server/request/search-params';
import {
  allergySearchParamsCache,
  allergySearchSerialize
} from '@/lib/searchparams';
import { columns } from './tables/allergies/columns';

type AllergiesPageProps = {
  petId: ID;
  searchParams: SearchParams;
};

export async function AllergiesTablePage({
  petId,
  searchParams
}: AllergiesPageProps) {
  // Allow nested RSCs to access the search params (in a type-safe way)
  const parsedSearchParams = allergySearchParamsCache.parse(searchParams);

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  const key = allergySearchSerialize({ ...parsedSearchParams });
  return (
    <div className='flex flex-1 flex-col space-y-4'>
      <AllergiesTableAction petId={petId} />
      <Suspense
        key={key}
        fallback={
          <DataTableSkeleton columnCount={columns.length} rowCount={10} />
        }
      >
        <AllergiesTable petId={petId} />
      </Suspense>
    </div>
  );
}
