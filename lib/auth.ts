import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code', // required to get id_token
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Grab the ID token from the account on initial login
      if (account?.id_token) {
        token.id_token = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose the id_token to the client session
      session.idToken = token.id_token as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
