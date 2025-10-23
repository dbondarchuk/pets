import {
  AllergyEntry,
  AllergyEntryListModel,
  AllergyEntryUpdateModel,
  AllergySeverity,
  Pet,
  PetListModel,
  PetUpdateModel,
  VaccinationEntry,
  VaccinationListModel,
  VaccinationUpdateModel
} from '@/types/pet';
import { User, UserListModel, UserUpdateModel } from '@/types/user';
import { ID, WithId } from '@/types/with-id';

export type Query = {
  page: number;
  limit: number;
  query?: string;
};

export type PetsRequest = Query & {
  type?: string;
  ownerId?: ID;
};

export type PetItemRequest = Query & {
  petId?: ID;
};

export type QueryResponse<T> = {
  total: number;
  offset: number;
  limit: number;
  items: T[];
};

export type IPetsRepository = {
  getPets(request: PetsRequest): Promise<QueryResponse<PetListModel>>;
  getPet(id: ID): Promise<WithId<Pet> | null>;
  deletePet(id: ID): Promise<void>;
  deletePets(ids: ID[], ownerId?: ID): Promise<void>;
  updatePet(id: ID, updateModel: PetUpdateModel): Promise<void>;
  createPet(createModel: PetUpdateModel): Promise<Pet>;
  getPetVaccinations(
    request: PetItemRequest & { range?: { startDate?: Date; endDate?: Date } }
  ): Promise<QueryResponse<VaccinationListModel>>;
  getPetVaccination(id: ID): Promise<WithId<VaccinationEntry> | null>;
  createPetVaccination(
    petId: ID,
    vaccination: VaccinationUpdateModel
  ): Promise<VaccinationEntry>;
  updatePetVaccination(
    vaccineHistoryEntryId: ID,
    vaccineHistoryEntry: VaccinationUpdateModel
  ): Promise<void>;
  deletePetVaccination(vaccinationId: ID): Promise<void>;
  deletePetVaccinations(petId: ID, vaccinationIds: ID[]): Promise<void>;
  getPetAllergies(
    request: PetItemRequest & { severity?: AllergySeverity }
  ): Promise<QueryResponse<AllergyEntryListModel>>;
  getPetAllergy(id: ID): Promise<WithId<AllergyEntry> | null>;
  createPetAllergy(
    petId: ID,
    allergy: AllergyEntryUpdateModel
  ): Promise<AllergyEntry>;
  updatePetAllergy(
    allergyId: ID,
    allergy: AllergyEntryUpdateModel
  ): Promise<void>;
  deletePetAllergy(allergyId: ID): Promise<void>;
  deletePetAllergies(petId: ID, allergyIds: ID[]): Promise<void>;
};

export type IUsersRepository = {
  getUsers(): Promise<UserListModel[]>;
  getUsersIds(): Promise<ID[]>;
  getUser(email: string): Promise<User | null>;
  createUser(createModel: UserUpdateModel): Promise<User>;
};
