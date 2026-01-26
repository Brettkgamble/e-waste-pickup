"use client";

import { useSearchParams } from "next/navigation";
import { login } from "@/lib/actions/auth";

export const SignInButton = ({ callbackUrl }: { callbackUrl?: string } = {}) => {
  const searchParams = useSearchParams();
  const urlCallbackUrl = searchParams.get("callbackUrl");
  const finalCallbackUrl = callbackUrl || urlCallbackUrl || "/admin/dashboard";

  return (
    <button
      onClick={() => {
        login(finalCallbackUrl);
      }}
    >
      Sign in with GitHub
    </button>
  );
};
