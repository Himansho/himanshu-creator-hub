"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/client";

type Mode = "login" | "forgot" | "sent";

function friendlyAuthError(message: string): string {
  if (message.toLowerCase().includes("invalid login credentials")) {
    return "That email or password doesn't match. Please try again.";
  }
  if (message.toLowerCase().includes("rate limit")) {
    return "Too many attempts — please wait a minute and try again.";
  }
  return "Something went wrong while signing in. Please try again.";
}

export default function LoginPage() {
  const configured = hasSupabaseEnv();
  const supabase = useMemo(
    () => (configured ? createClient() : null),
    [configured]
  );
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (authError) {
      setError(friendlyAuthError(authError.message));
      setBusy(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  async function handleForgot(event: React.FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError(null);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: `${window.location.origin}/reset-password` }
    );
    setBusy(false);
    if (resetError) {
      setError("Couldn't send the reset email. Please try again in a minute.");
      return;
    }
    setMode("sent");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-8 block text-center text-sm font-semibold tracking-widest text-muted uppercase"
        >
          HB<span className="text-accent">.</span>
        </Link>

        <div className="glass rounded-2xl p-8">
          {!configured ? (
            <div className="text-center">
              <span className="text-2xl" aria-hidden="true">
                🔧
              </span>
              <h1 className="mt-3 text-lg font-semibold text-ink">
                Setup not finished yet
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                The database connection isn't configured. Finish the Supabase
                steps in the README (add the two values in Vercel), and this
                login page will start working.
              </p>
            </div>
          ) : mode === "sent" ? (
            <div className="text-center">
              <span className="text-2xl" aria-hidden="true">
                📬
              </span>
              <h1 className="mt-3 text-lg font-semibold text-ink">
                Check your email
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                If an account exists for {email}, a password-reset link is on
                its way. Open it on this device.
              </p>
              <button
                type="button"
                onClick={() => setMode("login")}
                className="mt-6 text-sm text-accent hover:opacity-80"
              >
                ← Back to login
              </button>
            </div>
          ) : (
            <>
              <h1 className="flex items-center gap-2 text-lg font-semibold text-ink">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-accent"
                  aria-hidden="true"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                {mode === "login" ? "Admin access" : "Reset password"}
              </h1>

              <form
                onSubmit={mode === "login" ? handleLogin : handleForgot}
                className="mt-6 space-y-4"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm text-muted"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-xl border border-edge bg-base px-4 py-2.5 text-sm text-ink placeholder:text-faint focus:border-accent/60 focus:outline-none"
                    placeholder="you@example.com"
                  />
                </div>

                {mode === "login" && (
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-1.5 block text-sm text-muted"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="w-full rounded-xl border border-edge bg-base px-4 py-2.5 text-sm text-ink placeholder:text-faint focus:border-accent/60 focus:outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                )}

                {error && (
                  <p className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-[#14100a] transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {busy
                    ? "One moment…"
                    : mode === "login"
                      ? "Sign in"
                      : "Send reset link"}
                </button>
              </form>

              <button
                type="button"
                onClick={() => {
                  setMode(mode === "login" ? "forgot" : "login");
                  setError(null);
                }}
                className="mt-5 block w-full text-center text-sm text-muted transition-colors hover:text-ink"
              >
                {mode === "login" ? "Forgot password?" : "← Back to login"}
              </button>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-faint">
          Private area — for the site owner only.
        </p>
      </div>
    </main>
  );
}
