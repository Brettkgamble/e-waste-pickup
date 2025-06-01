// https://www.youtube.com/watch?v=n-fVrzaikBQ
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

const nextAuthResult = NextAuth({
  providers: [GitHub],
});

export const auth: ReturnType<typeof NextAuth>["auth"] = nextAuthResult.auth;

export const handlers: ReturnType<typeof NextAuth>["handlers"] =
  nextAuthResult.handlers;

export const signIn: ReturnType<typeof NextAuth>["signIn"] =
  nextAuthResult.signIn;

export const signOut: ReturnType<typeof NextAuth>["signOut"] =
  nextAuthResult.signOut;
