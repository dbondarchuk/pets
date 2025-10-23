import { auth } from '@/lib/auth';
import { perSearhParamsLoader } from '@/lib/searchparams';
import { PetsRepository } from '@/repository/db/pets.repository';
import { petSchema } from '@/types/pet';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  const searchParams = perSearhParamsLoader(request.nextUrl.searchParams);
  const petsRepository = new PetsRepository();

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ownerId = session.user.isAdmin
    ? (searchParams.ownerId ?? undefined)
    : userId;

  const pets = await petsRepository.getPets({
    page: searchParams.page,
    limit: searchParams.limit,
    query: searchParams.q || undefined,
    type: searchParams.type || undefined,
    ownerId
  });
  return NextResponse.json(pets);
};

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const parseResult = petSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(parseResult, { status: 400 });
  }
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let ownerId = userId;
  if (session.user.isAdmin) {
    const ownerIdParam = request.nextUrl.searchParams.get('ownerId');
    if (!ownerIdParam) {
      return NextResponse.json(
        { error: 'Owner ID is required' },
        { status: 400 }
      );
    }

    ownerId = ownerIdParam;
  }

  const petsRepository = new PetsRepository();
  const pet = await petsRepository.createPet({
    ...parseResult.data,
    ownerId
  });

  return NextResponse.json(pet, { status: 201 });
};
