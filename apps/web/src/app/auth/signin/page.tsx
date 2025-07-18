// https://www.youtube.com/watch?v=n-fVrzaikBQ
"use server";

import Link from "next/link";

import { auth } from "@/auth";
import { SignInButton } from "@/components/ui/sign-in-button";
import { SignOutButton } from "@/components/ui/sign-out-button";

export default async function Page() {
  const session = await auth();

  if (session?.user) {
    return (
      <div>
        <Link href="/admin">Admin</Link>;
        <SignOutButton />;
      </div>
    );
  }

  return (
    <div>
      <h1>You are not signed in</h1>
      <SignInButton />
    </div>
  );
}
