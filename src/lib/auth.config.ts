import { NextAuthConfig, User } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';

const authConfig = {
  providers: [
    CredentialProvider({
      credentials: {
        email: {
          type: 'email'
        },
        password: {
          type: 'password'
        }
      },
      async authorize(credentials, req) {
        try {
          const url = new URL(req.url);
          // Dummy credentials verification endpoint
          const response = await fetch(
            `${url.protocol}//${url.host}/api/auth/verify`,
            {
              method: 'POST',
              body: JSON.stringify(credentials)
            }
          );
          if (!response.ok) {
            return null;
          }
          const data = await response.json();
          if (!data.user) {
            return null;
          }
          return data.user;
        } catch (error: any) {
          // eslint-disable-next-line no-console
          console.error('Error verifying credentials', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/' //sigin page
  },
  callbacks: {
    authorized: async ({ auth, request }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth?.user?.id;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.isAdmin = (user as User & { isAdmin: boolean }).isAdmin;
        token.id = (user as User & { id: string }).id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.isAdmin = token.isAdmin as boolean;
      session.user.id = token.id as string;
      return session;
    }
  }
} satisfies NextAuthConfig;

export default authConfig;
