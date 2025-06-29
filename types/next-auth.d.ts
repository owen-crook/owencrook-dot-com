import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    idToken?: string;
  }

  interface JWT {
    id_token?: string;
  }
}
