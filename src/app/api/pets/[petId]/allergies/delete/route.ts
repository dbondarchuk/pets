import { auth } from '@/lib/auth';
import { PetsRepository } from '@/repository/db/pets.repository';
import { BulkDeleteRequestSchema } from '@/types/requests';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ petId: string }> }
) => {
  const { petId } = await params;
  const body = await request.json();
  const parseResult = BulkDeleteRequestSchema.safeParse(body);
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
  if (!session.user.isAdmin) {
    const pet = await petsRepository.getPet(petId);
    if (!pet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
    }
    if (pet.ownerId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  await petsRepository.deletePetAllergies(petId, parseResult.data.ids);

  return NextResponse.json({ success: true }, { status: 201 });
};
