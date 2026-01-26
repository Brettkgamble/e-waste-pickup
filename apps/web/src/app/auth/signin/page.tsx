// https://www.youtube.com/watch?v=n-fVrzaikBQ
import Link from "next/link";
import { Suspense } from "react";

import { auth } from "@/auth";
import { SignInButton } from "@/components/ui/sign-in-button";
import { SignOutButton } from "@/components/ui/sign-out-button";

async function SignInContent({ callbackUrl }: { callbackUrl: string | null }) {
  const session = await auth();

  if (session?.user) {
    const redirectUrl = callbackUrl || "/admin/dashboard";
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome, {session.user.name}!</h1>
          <p className="text-muted-foreground mb-6">You are already signed in.</p>
          <div className="flex gap-4">
            <Link href={redirectUrl} className="text-blue-500 hover:underline">
              Go to Dashboard
            </Link>
            <SignOutButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Sign In</h1>
        <p className="text-muted-foreground mb-6">
          You need to sign in to access the admin dashboard.
        </p>
        <SignInButton callbackUrl={callbackUrl || "/admin/dashboard"} />
      </div>
    </div>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl
    ? decodeURIComponent(params.callbackUrl)
    : null;

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <SignInContent callbackUrl={callbackUrl} />
    </Suspense>
  );
}
