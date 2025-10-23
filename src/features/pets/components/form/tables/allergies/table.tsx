import { DataTable } from '@/components/ui/table/data-table';
import { allergySearchParamsCache } from '@/lib/searchparams';
import { columns } from './columns';
import { auth } from '@/lib/auth';
import { unauthorized } from 'next/navigation';
import { ID } from '@/types/with-id';
import { PetsRepository } from '@/repository/db/pets.repository';

type AllergiesTableProps = {
  petId: ID;
};

export async function AllergiesTable({ petId }: AllergiesTableProps) {
  const page = allergySearchParamsCache.get('page');
  const query = allergySearchParamsCache.get('q');
  const pageLimit = allergySearchParamsCache.get('limit');
  const severityFilter = allergySearchParamsCache.get('severity');

  const petsRepository = new PetsRepository();
  const session = await auth();
  if (!session?.user) {
    unauthorized();
  }

  const userId = session.user.id;
  if (!userId) {
    unauthorized();
  }

  if (!session.user.isAdmin) {
    const pet = await petsRepository.getPet(petId);
    if (!pet) {
      unauthorized();
    }
    if (pet.ownerId !== userId) {
      unauthorized();
    }
  }
  const filters = {
    page,
    petId,
    limit: pageLimit,
    ...(query && { query }),
    ...(severityFilter && { severity: severityFilter })
  };

  const data = await petsRepository.getPetAllergies(filters);

  return (
    <DataTable columns={columns} data={data.items} totalItems={data.total} />
  );
}
