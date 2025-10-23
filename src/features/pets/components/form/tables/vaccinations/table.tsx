import { DataTable } from '@/components/ui/table/data-table';
import { vaccinationSearchParamsCache } from '@/lib/searchparams';
import { columns } from './columns';
import { auth } from '@/lib/auth';
import { unauthorized } from 'next/navigation';
import { ID } from '@/types/with-id';
import { PetsRepository } from '@/repository/db/pets.repository';

type VaccinationTableProps = {
  petId: ID;
};

export async function VaccinationTable({ petId }: VaccinationTableProps) {
  const page = vaccinationSearchParamsCache.get('page');
  const query = vaccinationSearchParamsCache.get('q');
  const pageLimit = vaccinationSearchParamsCache.get('limit');
  const start = vaccinationSearchParamsCache.get('start');
  const end = vaccinationSearchParamsCache.get('end');

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
    ...((start || end) && {
      range: { startDate: start ?? undefined, endDate: end ?? undefined }
    })
  };

  const data = await petsRepository.getPetVaccinations(filters);

  return (
    <DataTable columns={columns} data={data.items} totalItems={data.total} />
  );
}
