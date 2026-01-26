"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { LogOut, LogIn } from "lucide-react";
import { login } from "@/lib/actions/auth";

export const AuthNavButton = () => {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || status === "loading") {
    return null;
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/admin/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          {session.user.name || "Dashboard"}
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      onClick={() => login("/admin/dashboard")}
      className="flex items-center gap-2"
    >
      <LogIn className="w-4 h-4" />
      Sign In
    </Button>
  );
};
