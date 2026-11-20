"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type SupabaseBrowserClient = ReturnType<typeof createClient>;

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSignOut() {
    setPending(true);
    setError("");

    let supabase: SupabaseBrowserClient;
    try {
      supabase = createClient();
    } catch (caughtError: unknown) {
      const message = caughtError instanceof Error ? caughtError.message : "Unable to sign out.";
      setError(message);
      setPending(false);
      return;
    }

    const { error: signOutError } = await supabase.auth.signOut();
    setPending(false);

    if (signOutError) {
      setError(signOutError.message);
      return;
    }

    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleSignOut}
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
      >
        <LogOut aria-hidden="true" size={14} />
        {pending ? "Signing out..." : "Sign out"}
      </button>
      {error ? (
        <p role="alert" className="absolute right-0 top-full z-10 mt-1 w-56 rounded-lg border border-error/30 bg-white px-2 py-1 text-xs text-error-dark shadow-card">
          {error}
        </p>
      ) : null}
    </div>
  );
}
