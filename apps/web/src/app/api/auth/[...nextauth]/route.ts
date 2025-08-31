// https://www.youtube.com/watch?v=n-fVrzaikBQ
import NextAuth from "@/auth";

const handler = NextAuth();

export const { GET, POST } = handler;
