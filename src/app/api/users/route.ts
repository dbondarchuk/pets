import { auth } from '@/lib/auth';
import { UsersRepository } from '@/repository/db/users.repository';
import { NextResponse } from 'next/server';

export const GET = async () => {
  const session = await auth();
  if (!session?.user || !session.user.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const usersRepository = new UsersRepository();
  const users = await usersRepository.getUsers();
  return NextResponse.json(users);
};
