import { auth } from '@/lib/auth';
import { PetsRepository } from '@/repository/db/pets.repository';
import { vaccinationSchema } from '@/types/pet';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ petId: string; vaccinationId: string }> }
) => {
  const { petId, vaccinationId } = await params;
  const petsRepository = new PetsRepository();
  const vaccination = await petsRepository.getPetVaccination(vaccinationId);
  if (!vaccination || vaccination.petId !== petId) {
    return NextResponse.json(
      { error: 'Vaccination not found' },
      { status: 404 }
    );
  }

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!session.user.isAdmin) {
    const pet = await petsRepository.getPet(vaccination.petId);
    if (!pet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
    }
    if (pet.ownerId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.json(vaccination);
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ petId: string; vaccinationId: string }> }
) => {
  const { petId, vaccinationId } = await params;
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
  const vaccination = await petsRepository.getPetVaccination(vaccinationId);
  if (!vaccination || vaccination.petId !== petId) {
    return NextResponse.json(
      { error: 'Vaccination not found' },
      { status: 404 }
    );
  }

  if (!session.user.isAdmin) {
    const pet = await petsRepository.getPet(vaccination.petId);
    if (!pet) {
      return NextResponse.json(
        { error: 'Vaccination not found' },
        { status: 404 }
      );
    }
    if (pet.ownerId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  await petsRepository.updatePetVaccination(vaccinationId, parseResult.data);

  return NextResponse.json({ success: true }, { status: 201 });
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ petId: string; vaccinationId: string }> }
) => {
  const { petId, vaccinationId } = await params;
  const petsRepository = new PetsRepository();
  const vaccination = await petsRepository.getPetVaccination(vaccinationId);
  if (!vaccination) {
    return NextResponse.json(
      { error: 'Vaccination not found' },
      { status: 404 }
    );
  }

  if (vaccination.petId !== petId) {
    return NextResponse.json(
      { error: 'Vaccination not found' },
      { status: 404 }
    );
  }

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!session.user.isAdmin) {
    const pet = await petsRepository.getPet(vaccination.petId);
    if (!pet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
    }
    if (pet.ownerId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  await petsRepository.deletePetVaccination(vaccinationId);
  return NextResponse.json({ success: true }, { status: 201 });
};
