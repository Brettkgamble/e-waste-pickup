// https://www.youtube.com/watch?v=n-fVrzaikBQ
import NextAuth, { type NextAuthOptions } from "next-auth";
import GitHub from "next-auth/providers/github";
import GoogleProvider from 'next-auth/providers/google'
import { getServerSession } from "next-auth/next";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // If the callback URL is relative, redirect to it after login
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // If the origin matches the baseUrl, redirect to the URL
      else if (new URL(url).origin === baseUrl) return url;
      // Otherwise redirect to the homepage
      return baseUrl;
    },
  },
  pages: {
    signOut: "/",
  },
};

export const auth = () => getServerSession(authOptions);

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
