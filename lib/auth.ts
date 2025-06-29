import { jwtDecode } from 'jwt-decode';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

interface DecodedIdToken {
  exp: number;
}

async function refreshAccessToken(token: any) {
  try {
    const url = 'https://oauth2.googleapis.com/token';

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: token.refresh_token,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error_description || 'Failed to refresh token');
    }

    return {
      ...token,
      access_token: data.access_token,
      id_token: data.id_token,
      accessTokenExpires: Date.now() + data.expires_in * 1000,
    };
  } catch (error) {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        return {
          ...token,
          access_token: account.access_token,
          id_token: account.id_token,
          refresh_token: account.refresh_token,
          accessTokenExpires: Date.now() + (account.expires_at || 0) * 1000,
        };
      }

      // If token has not expired, return it
      try {
        const decoded = jwtDecode<DecodedIdToken>(token.id_token as string);
        const isExpired = Date.now() >= decoded.exp * 1000;

        if (!isExpired) {
          return token;
        }
      } catch (e) {
        console.warn('Failed to decode token for expiration check', e);
      }

      // Token expired, try to refresh
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.idToken = token.id_token as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
