import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import { ID } from '@/types/with-id';
import { notFound, unauthorized } from 'next/navigation';
import { PetsRepository } from '@/repository/db/pets.repository';
import { auth } from '@/lib/auth';
import { PageBreadcrumbs } from '@/hooks/use-breadcrumbs';
import { PetPage } from '@/features/pets/components/pet-page';
import { SearchParams } from 'next/dist/server/request/search-params';

export const metadata = {
  title: 'Dashboard : Update Pet'
};

const getPet = async (id: ID) => {
  const petsRepository = new PetsRepository();
  const pet = await petsRepository.getPet(id);
  if (!pet) {
    return notFound();
  }
  return pet;
};

export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{
    id: string;
    tab: 'details' | 'vaccinations' | 'allergies';
  }>;
  searchParams: Promise<SearchParams>;
}) {
  const { id, tab } = await params;
  const pet = await getPet(id);

  const session = await auth();
  if (
    !session?.user ||
    (!session.user.isAdmin && session.user.id !== pet.ownerId.toString())
  ) {
    unauthorized();
  }

  const searchParamsData = await searchParams;

  const breadcrumbs = [
    { title: 'dashboard', link: '/dashboard' },
    { title: 'pets', link: '/dashboard/pets' },
    { title: pet.name, link: '/dashboard/pets/[id]' }
  ];

  return (
    <PageContainer scrollable={tab === 'details'}>
      <div className='flex flex-1 flex-col space-y-4'>
        <PageBreadcrumbs breadcrumbs={breadcrumbs} />
        <Suspense fallback={<FormCardSkeleton />}>
          <PetPage id={id} tab={tab} searchParams={searchParamsData} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
