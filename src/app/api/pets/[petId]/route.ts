import { auth } from '@/lib/auth';
import { PetsRepository } from '@/repository/db/pets.repository';
import { petSchema } from '@/types/pet';
import { NextRequest, NextResponse } from 'next/server';

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ petId: string }> }
) => {
  const { petId } = await params;
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

  const petsRepository = new PetsRepository();
  const pet = await petsRepository.getPet(petId);
  if (!pet) {
    return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
  }
  if (!session.user.isAdmin && pet.ownerId !== userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await petsRepository.updatePet(petId, parseResult.data);

  return NextResponse.json({ petId }, { status: 201 });
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ petId: string }> }
) => {
  const { petId } = await params;
  const petsRepository = new PetsRepository();
  const pet = await petsRepository.getPet(petId);
  if (!pet) {
    return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
  }

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!session.user.isAdmin && pet.ownerId !== userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await petsRepository.deletePet(petId);
  return NextResponse.json({ success: true }, { status: 201 });
};

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ petId: string }> }
) => {
  const { petId } = await params;
  const petsRepository = new PetsRepository();
  const pet = await petsRepository.getPet(petId);
  if (!pet) {
    return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
  }

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!session.user.isAdmin && pet.ownerId !== userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json(pet);
};
