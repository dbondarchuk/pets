import { auth } from '@/lib/auth';
import { PetsRepository } from '@/repository/db/pets.repository';
import { BulkDeleteRequestSchema } from '@/types/requests';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
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
  await petsRepository.deletePets(
    parseResult.data.ids,
    session.user.isAdmin ? undefined : userId
  );

  return NextResponse.json({ success: true }, { status: 201 });
};
