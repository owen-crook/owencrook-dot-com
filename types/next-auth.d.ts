import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    idToken?: string;
  }

  interface JWT {
    id_token?: string;
    refresh_token?: string;
    access_token?: string;
    accessTokenExpires?: number;
  }
}
