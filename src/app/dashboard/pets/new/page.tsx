import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import { PetPage } from '@/features/pets/components/pet-page';
import { PageBreadcrumbs } from '@/hooks/use-breadcrumbs';
import { SearchParams } from 'next/dist/server/request/search-params';

export const metadata = {
  title: 'Dashboard : New Pet'
};

const breadcrumbs = [
  { title: 'dashboard', link: '/dashboard' },
  { title: 'pets', link: '/dashboard/pets' },
  { title: 'add_new_label', link: '/dashboard/pets/new' }
];

export default async function Page({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParamsData = await searchParams;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <PageBreadcrumbs breadcrumbs={breadcrumbs} />
        <Suspense fallback={<FormCardSkeleton />}>
          <PetPage
            id={undefined}
            tab='details'
            searchParams={searchParamsData}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
}
