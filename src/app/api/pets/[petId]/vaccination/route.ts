import { auth } from '@/lib/auth';
import { vaccinationSearhParamsLoader } from '@/lib/searchparams';
import { PetsRepository } from '@/repository/db/pets.repository';
import { vaccinationSchema } from '@/types/pet';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ petId: string }> }
) => {
  const { petId } = await params;

  const searchParams = vaccinationSearhParamsLoader(
    request.nextUrl.searchParams
  );

  const page = searchParams.page;
  const limit = searchParams.limit;
  const query = searchParams.q ?? undefined;
  const start = searchParams.start ?? undefined;
  const end = searchParams.end ?? undefined;

  const petsRepository = new PetsRepository();

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!session.user.isAdmin) {
    if (!petId) {
      return NextResponse.json(
        { error: 'Pet ID is required' },
        { status: 400 }
      );
    }
    const pet = await petsRepository.getPet(petId);
    if (!pet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
    }
    if (pet.ownerId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const vaccinations = await petsRepository.getPetVaccinations({
    page,
    limit,
    query,
    petId,
    range: start || end ? { startDate: start, endDate: end } : undefined
  });
  return NextResponse.json(vaccinations);
};

export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ petId: string }> }
) => {
  const { petId } = await params;
  const body = await request.json();
  const parseResult = vaccinationSchema.safeParse(body);
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

  const petsRepository = new PetsRepository();
  const pet = await petsRepository.getPet(petId);
  if (!pet) {
    return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
  }

  if (!session.user.isAdmin && pet.ownerId !== userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await petsRepository.createPetVaccination(pet.id, parseResult.data);

  return NextResponse.json({ success: true }, { status: 201 });
};
