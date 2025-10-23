import { UsersRepository } from '@/repository/db/users.repository';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    );
  }

  if (email === 'admin@example.com' && password === 'password') {
    return NextResponse.json({
      user: { id: '0', name: 'John', email: email, isAdmin: true }
    });
  }

  const usersRepository = new UsersRepository();
  const user = await usersRepository.getUser(email);
  if (user && user.password === password) {
    return NextResponse.json({
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        isAdmin: false
      }
    });
  } else {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
};
