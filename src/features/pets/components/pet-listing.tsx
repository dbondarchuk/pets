import { DataTable as PetTable } from '@/components/ui/table/data-table';
import { petSearchParamsCache } from '@/lib/searchparams';
import { getPets } from './actions';
import { columns } from './pets-tables/columns';
import { auth } from '@/lib/auth';
import { unauthorized } from 'next/navigation';

type PetListingPageProps = {};

export default async function PetListingPage({}: PetListingPageProps) {
  const page = petSearchParamsCache.get('page');
  const query = petSearchParamsCache.get('q');
  const pageLimit = petSearchParamsCache.get('limit');
  const type = petSearchParamsCache.get('type');

  const session = await auth();
  if (!session?.user) {
    unauthorized();
  }

  const userId = session.user.id;
  const ownerId = session.user.isAdmin ? undefined : userId;

  const filters = {
    page,
    ownerId,
    limit: pageLimit,
    ...(query && { query }),
    ...(type && { type })
  };

  const data = await getPets(filters);

  return (
    <PetTable columns={columns} data={data.items} totalItems={data.total} />
  );
}
