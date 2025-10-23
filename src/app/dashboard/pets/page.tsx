import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { petSearchParamsCache, petSearchSerialize } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import PetListingPage from '@/features/pets/components/pet-listing';
import RecordTableAction from '@/features/pets/components/pets-tables/pets-table-action';
import { getI18nAsync } from '@/i18n';
import { unauthorized } from 'next/navigation';
import { Link } from '@/components/ui/link';
import { auth } from '@/lib/auth';

export const metadata = {
  title: 'Pets'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  const { t } = await getI18nAsync();
  const session = await auth();
  if (!session?.user) {
    unauthorized();
  }

  const { isAdmin } = session.user;

  // Allow nested RSCs to access the search params (in a type-safe way)
  const parsedSearchParams = petSearchParamsCache.parse(searchParams);

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  const key = petSearchSerialize({ ...parsedSearchParams });

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title={t('pets')}
            description={t(isAdmin ? 'pets_subtitle_admin' : 'pets_subtitle')}
          />
          <Link href='/dashboard/pets/new' button variant='primary'>
            {t('add_new_label')}
          </Link>
        </div>
        <Separator />
        <RecordTableAction />
        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <PetListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
