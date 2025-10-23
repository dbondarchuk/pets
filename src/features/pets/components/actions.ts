'use server';

import { PetsRepository } from '@/repository/db/pets.repository';
import { PetsRequest, QueryResponse } from '@/repository/types';
import { PetListModel } from '@/types/pet';

export const getPets = async (
  request: PetsRequest
): Promise<QueryResponse<PetListModel>> => {
  const petsRepository = new PetsRepository();
  const response = await petsRepository.getPets(request);

  return response;
};
