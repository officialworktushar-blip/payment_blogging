"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type SupabaseBrowserClient = ReturnType<typeof createClient>;

interface LoginFormProps {
  initialError?: string;
}

export function LoginForm({ initialError = "" }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(initialError);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    let supabase: SupabaseBrowserClient;
    try {
      supabase = createClient();
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Unable to initialise Supabase.";
      setError(message);
      setPending(false);
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (signInError || !data.user) {
      setError(signInError?.message ?? "Sign-in failed. Check your email and password.");
      setPending(false);
      return;
    }

    const { data: adminRow, error: adminError } = await supabase
      .from("admin_users")
      .select("email")
      .ilike("email", normalizedEmail)
      .maybeSingle();

    if (adminError) {
      const { error: signOutError } = await supabase.auth.signOut();
      setError(
        signOutError
          ? "Could not clear the session. Please close this tab and try again."
          : "Could not verify admin access. Please try again.",
      );
      setPending(false);
      return;
    }

    if (!adminRow) {
      const { error: signOutError } = await supabase.auth.signOut();
      setError(
        signOutError
          ? "Could not clear the session. Please close this tab and try again."
          : "This account is not registered as an admin.",
      );
      setPending(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        {error ? (
          <p role="alert" className="rounded-lg border border-error/30 bg-error-light px-3 py-2 text-sm text-error-dark">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogIn aria-hidden="true" size={16} />
          {pending ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="mt-4 text-center text-xs text-slate-500">
        Admin access only. There is no public sign-up.
      </p>
    </div>
  );
}
