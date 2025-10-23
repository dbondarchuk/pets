import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    isAdmin: boolean;
  }

  interface Session {
    user: User & DefaultSession['user'];
  }
}
