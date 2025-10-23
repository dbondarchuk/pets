import { auth } from '@/lib/auth';
import { PetsRepository } from '@/repository/db/pets.repository';
import { allergyEntrySchema } from '@/types/pet';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ petId: string; allergyId: string }> }
) => {
  const { petId, allergyId } = await params;
  const petsRepository = new PetsRepository();
  const allergy = await petsRepository.getPetAllergy(allergyId);
  if (!allergy || allergy.petId !== petId) {
    return NextResponse.json({ error: 'Allergy not found' }, { status: 404 });
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
    const pet = await petsRepository.getPet(allergy.petId);
    if (!pet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
    }
    if (pet.ownerId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.json(allergy);
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ petId: string; allergyId: string }> }
) => {
  const { petId, allergyId } = await params;
  const body = await request.json();
  const parseResult = allergyEntrySchema.safeParse(body);
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
  const allergy = await petsRepository.getPetAllergy(allergyId);
  if (!allergy || allergy.petId !== petId) {
    return NextResponse.json({ error: 'Allergy not found' }, { status: 404 });
  }

  if (!session.user.isAdmin) {
    const pet = await petsRepository.getPet(allergy.petId);
    if (!pet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
    }
    if (pet.ownerId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  await petsRepository.updatePetAllergy(allergyId, parseResult.data);

  return NextResponse.json({ success: true }, { status: 201 });
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ petId: string; allergyId: string }> }
) => {
  const { petId, allergyId } = await params;
  const petsRepository = new PetsRepository();
  const allergy = await petsRepository.getPetAllergy(allergyId);
  if (!allergy || allergy.petId !== petId) {
    return NextResponse.json({ error: 'Allergy not found' }, { status: 404 });
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
    const pet = await petsRepository.getPet(allergy.petId);
    if (!pet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
    }
    if (pet.ownerId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  await petsRepository.deletePetAllergy(allergyId);
  return NextResponse.json({ success: true }, { status: 201 });
};
