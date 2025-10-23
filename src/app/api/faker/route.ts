import { PetsRepository } from '@/repository/db/pets.repository';
import { UsersRepository } from '@/repository/db/users.repository';
import { allergySeverities, animals, Pet, PetUpdateModel } from '@/types/pet';
import { User } from '@/types/user';
import { faker } from '@faker-js/faker';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  const type = request.nextUrl.searchParams.get('type');
  const count =
    parseInt(request.nextUrl.searchParams.get('count') || '10') || 10;

  const usersRepository = new UsersRepository();
  if (type === 'users') {
    const users: User[] = [];
    for (let i = 0; i < count; i++) {
      const name = faker.person.fullName();
      const email = faker.internet.email();
      const phone = faker.phone.number();
      const address = faker.location.streetAddress();
      const password = faker.internet.password();

      const user = await usersRepository.createUser({
        name,
        email,
        phone,
        address,
        password
      });
      users.push(user);
    }

    return NextResponse.json({ users }, { status: 201 });
  }

  const petsRepository = new PetsRepository();
  const pets: Pet[] = [];
  const allergiesFns = [
    faker.food.ingredient,
    faker.food.meat,
    faker.food.vegetable,
    faker.food.spice,
    faker.food.fruit
  ];

  const usersIdsParam = request.nextUrl.searchParams.get('userId');
  const knownUserIds = await usersRepository.getUsersIds();
  const usersIds =
    usersIdsParam && usersIdsParam.length > 0
      ? usersIdsParam.split(',').filter((id) => knownUserIds.includes(id))
      : knownUserIds;

  if (usersIds.length === 0) {
    return NextResponse.json({ error: 'No users found' }, { status: 400 });
  }

  for (let i = 0; i < count; i++) {
    const type = animals[faker.number.int({ min: 0, max: animals.length - 1 })];
    const ownerId =
      usersIds[faker.number.int({ min: 0, max: usersIds.length - 1 })];

    const petModel: PetUpdateModel & { ownerId: string } = {
      name: faker.animal.petName(),
      type: type,
      dateOfBirth: faker.date.past({ years: 10 }),
      gender: faker.person.sexType(),
      breed: faker.animal[type](),
      veterinarian: faker.helpers.maybe(() => faker.person.fullName(), {
        probability: 0.5
      }),
      insurance: faker.helpers.maybe(
        () => ({
          provider: faker.company.name(),
          policyNumber: faker.finance.accountNumber()
        }),
        { probability: 0.5 }
      ),
      ownerId: ownerId
    };

    const pet = await petsRepository.createPet(petModel);
    const allergies = Array.from({
      length: faker.number.int({ min: 0, max: 3 })
    }).map(() => ({
      allergy:
        allergiesFns[
          faker.number.int({ min: 0, max: allergiesFns.length - 1 })
        ](),
      severity:
        allergySeverities[
          faker.number.int({ min: 0, max: allergySeverities.length - 1 })
        ],
      reaction: faker.lorem.words(2),
      note: faker.lorem.lines()
    }));

    for (const allergy of allergies) {
      await petsRepository.createPetAllergy(pet.id, allergy);
    }

    const vaccinations = Array.from({
      length: faker.number.int({ min: 0, max: 3 })
    }).map(() => ({
      date: faker.date.past({ years: 5 }),
      vaccine: faker.lorem.words(2),
      note: faker.lorem.lines()
    }));

    for (const vaccination of vaccinations) {
      await petsRepository.createPetVaccination(pet.id, vaccination);
    }

    pets.push(pet);
  }

  return NextResponse.json({ pets }, { status: 201 });
};
