import {
  AllergyEntry,
  AllergyEntryListModel,
  AllergyEntryUpdateModel,
  allergySeverities,
  AllergySeverity,
  animals,
  Pet,
  PetListModel,
  PetUpdateModel,
  VaccinationEntry,
  VaccinationListModel,
  VaccinationUpdateModel
} from '@/types/pet';
import { ID, WithId } from '@/types/with-id';
import { Op, WhereOptions } from 'sequelize';
import {
  IPetsRepository,
  PetItemRequest,
  PetsRequest,
  QueryResponse
} from '../types';
import {
  AllergyRecord,
  getAllergiesDb,
  getPetsDb,
  getVaccinationsDb,
  PetRecord,
  UserRecord,
  VaccinationRecord
} from './db';

export class PetsRepository implements IPetsRepository {
  public async getPets(request: PetsRequest) {
    const db = await getPetsDb();
    const { page, limit, query, type, ownerId } = request;
    const where: WhereOptions<PetRecord> = {};
    if (query) {
      where.name = { [Op.like]: `%${query}%` };
    }
    if (type) {
      where.type = type;
    }
    if (ownerId) {
      where.ownerId = ownerId;
    }

    const { count, rows } = await db.findAndCountAll({
      where,
      include: [
        {
          model: UserRecord,
          as: 'owner',
          attributes: ['name']
        }
      ],

      offset: (page - 1) * limit,
      limit
    });

    return {
      total: count,
      offset: page,
      limit,
      items: rows.map((pet) => ({
        id: pet.id,
        name: pet.name,
        ownerId: pet.ownerId,
        type: pet.type as (typeof animals)[number],
        breed: pet.breed,
        dateOfBirth: pet.dateOfBirth,
        ownerName: pet.owner.name
      }))
    } satisfies QueryResponse<PetListModel>;
  }

  public async getPet(id: ID) {
    const db = await getPetsDb();
    const petRecord = await db.findByPk(id, {
      include: [
        {
          model: UserRecord,
          as: 'owner',
          attributes: ['name']
        }
      ]
    });
    if (!petRecord) {
      return null;
    }

    return {
      ...petRecord.toJSON(),
      ownerName: petRecord.owner.name
    } as WithId<Pet>;
  }

  public async deletePet(id: ID) {
    const db = await getPetsDb();
    await db.destroy({
      where: {
        id
      }
    });
  }

  public async deletePets(ids: ID[], ownerId?: ID) {
    const db = await getPetsDb();
    const where: WhereOptions<PetRecord> = {};
    if (ids.length > 0) {
      where.id = { [Op.in]: ids };
    }
    if (ownerId) {
      where.ownerId = ownerId;
    }
    await db.destroy({ where });
  }

  public async updatePet(id: ID, updateModel: PetUpdateModel) {
    const db = await getPetsDb();

    await db.update(
      {
        ...updateModel
      },
      {
        where: {
          id
        }
      }
    );
  }

  public async createPet(createModel: PetUpdateModel & { ownerId: ID }) {
    const db = await getPetsDb();

    const pet = await db.create({
      ...createModel
    });

    return pet.toJSON() as Pet;
  }

  public async getPetVaccinations(
    request: PetItemRequest & { range?: { startDate?: Date; endDate?: Date } }
  ) {
    const { page, limit, query, petId, range } = request;
    const where: WhereOptions<VaccinationRecord> = {};
    if (query) {
      where.vaccine = { [Op.like]: `%${query}%` };
      where.note = { [Op.like]: `%${query}%` };
    }

    if (petId) {
      where.petId = petId;
    }

    if (range?.startDate && range?.endDate) {
      where.date = { [Op.between]: [range.startDate, range.endDate] };
    } else if (range?.startDate) {
      where.date = { [Op.gte]: range.startDate };
    } else if (range?.endDate) {
      where.date = { [Op.lte]: range.endDate };
    }

    const db = await getVaccinationsDb();
    const { count, rows } = await db.findAndCountAll({
      where,
      offset: (page - 1) * limit,
      limit
    });

    return {
      total: count,
      offset: page,
      limit,
      items: rows.map((vaccination) => ({
        petId: vaccination.petId,
        id: vaccination.id,
        date: vaccination.date,
        vaccine: vaccination.vaccine
      }))
    } satisfies QueryResponse<VaccinationListModel>;
  }

  public async getPetVaccination(vaccinationId: ID) {
    const db = await getVaccinationsDb();
    const vaccinationRecord = await db.findByPk(vaccinationId);
    if (!vaccinationRecord) {
      return null;
    }
    return vaccinationRecord.toJSON() as VaccinationEntry;
  }

  public async createPetVaccination(
    petId: ID,
    vaccination: VaccinationUpdateModel
  ) {
    const db = await getVaccinationsDb();
    const vaccinationRecord = await db.create({
      ...vaccination,
      petId
    });
    return vaccinationRecord.toJSON() as VaccinationEntry;
  }

  public async updatePetVaccination(
    vaccinationId: ID,
    vaccination: VaccinationUpdateModel
  ) {
    const db = await getVaccinationsDb();
    await db.update(
      {
        ...vaccination
      },
      { where: { id: vaccinationId } }
    );
  }

  public async deletePetVaccination(vaccinationId: ID) {
    const db = await getVaccinationsDb();
    await db.destroy({
      where: { id: vaccinationId }
    });
  }

  public async deletePetVaccinations(petId: ID, vaccinationIds: ID[]) {
    const db = await getVaccinationsDb();
    await db.destroy({
      where: { id: { [Op.in]: vaccinationIds }, petId }
    });
  }

  public async getPetAllergies(
    request: PetItemRequest & { severity?: AllergySeverity }
  ) {
    const db = await getAllergiesDb();
    const { page, limit, query, petId, severity } = request;
    const or: WhereOptions<AllergyRecord>[] = [];
    if (query) {
      or.push({
        allergy: { [Op.like]: `%${query}%` }
      });
      or.push({
        note: { [Op.like]: `%${query}%` }
      });
      or.push({
        reaction: { [Op.like]: `%${query}%` }
      });
    }

    const where: WhereOptions<AllergyRecord> = {};
    if (petId) {
      where.petId = petId;
    }

    if (or.length > 0) {
      // @ts-ignore exists
      where[Op.or] = or;
    }

    if (severity) {
      where.severity = severity;
    }

    const { count, rows } = await db.findAndCountAll({
      where,
      offset: (page - 1) * limit,
      limit
    });

    return {
      total: count,
      offset: page,
      limit,
      items: rows.map((allergy) => ({
        petId: allergy.petId,
        id: allergy.id,
        allergy: allergy.allergy,
        severity: allergy.severity as (typeof allergySeverities)[number],
        reaction: allergy.reaction
      }))
    } satisfies QueryResponse<AllergyEntryListModel>;
  }

  public async getPetAllergy(allergyId: ID) {
    const db = await getAllergiesDb();
    const allergy = await db.findByPk(allergyId);
    if (!allergy) {
      return null;
    }

    return allergy.toJSON() as AllergyEntry;
  }

  public async createPetAllergy(petId: ID, allergy: AllergyEntryUpdateModel) {
    const db = await getAllergiesDb();
    const allergyRecord = await db.create({
      ...allergy,
      petId
    });

    return allergyRecord.toJSON() as AllergyEntry;
  }

  public async updatePetAllergy(
    allergyId: ID,
    allergy: AllergyEntryUpdateModel
  ) {
    const db = await getAllergiesDb();
    await db.update(
      {
        ...allergy
      },
      { where: { id: allergyId } }
    );
  }

  public async deletePetAllergy(allergyId: ID) {
    const db = await getAllergiesDb();
    await db.destroy({
      where: { id: allergyId }
    });
  }

  public async deletePetAllergies(petId: ID, allergyIds: ID[]) {
    const db = await getAllergiesDb();
    await db.destroy({
      where: { id: { [Op.in]: allergyIds }, petId }
    });
  }
}
