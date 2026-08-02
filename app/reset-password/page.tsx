"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/client";

type Status = "checking" | "ready" | "invalid" | "done";

export default function ResetPasswordPage() {
  const configured = hasSupabaseEnv();
  const supabase = useMemo(
    () => (configured ? createClient() : null),
    [configured]
  );
  const router = useRouter();

  const [status, setStatus] = useState<Status>(
    configured ? "checking" : "invalid"
  );
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // The browser client exchanges the ?code= from the reset email
  // automatically; we just wait for the session to appear.
  useEffect(() => {
    if (!supabase) return;

    let settled = false;

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session && !settled) {
          settled = true;
          setStatus("ready");
        }
      }
    );

    supabase.auth.getSession().then(({ data }) => {
      if (data.session && !settled) {
        settled = true;
        setStatus("ready");
      }
    });

    const timeout = window.setTimeout(() => {
      if (!settled) setStatus("invalid");
    }, 5000);

    return () => {
      subscription.subscription.unsubscribe();
      window.clearTimeout(timeout);
    };
  }, [supabase]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setError(null);
    if (password.length < 8) {
      setError("Please choose a password with at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("The two passwords don't match — please retype them.");
      return;
    }
    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });
    setBusy(false);
    if (updateError) {
      setError("Couldn't update the password. Please try the email link again.");
      return;
    }
    setStatus("done");
    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 1500);
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
          {status === "checking" && (
            <p className="text-center text-sm text-muted">
              Checking your reset link…
            </p>
          )}

          {status === "invalid" && (
            <div className="text-center">
              <span className="text-2xl" aria-hidden="true">
                ⏳
              </span>
              <h1 className="mt-3 text-lg font-semibold text-ink">
                This link looks expired
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Reset links only work once and for a short time. Please request
                a fresh one from the login page.
              </p>
              <Link
                href="/login"
                className="mt-6 inline-block text-sm text-accent hover:opacity-80"
              >
                ← Back to login
              </Link>
            </div>
          )}

          {status === "done" && (
            <div className="text-center">
              <span className="text-2xl" aria-hidden="true">
                ✅
              </span>
              <h1 className="mt-3 text-lg font-semibold text-ink">
                Password updated
              </h1>
              <p className="mt-2 text-sm text-muted">
                Taking you to your dashboard…
              </p>
            </div>
          )}

          {status === "ready" && (
            <>
              <h1 className="text-lg font-semibold text-ink">
                Choose a new password
              </h1>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor="new-password"
                    className="mb-1.5 block text-sm text-muted"
                  >
                    New password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-xl border border-edge bg-base px-4 py-2.5 text-sm text-ink placeholder:text-faint focus:border-accent/60 focus:outline-none"
                    placeholder="At least 8 characters"
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="mb-1.5 block text-sm text-muted"
                  >
                    Repeat it
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(event) => setConfirm(event.target.value)}
                    className="w-full rounded-xl border border-edge bg-base px-4 py-2.5 text-sm text-ink placeholder:text-faint focus:border-accent/60 focus:outline-none"
                    placeholder="Same password again"
                  />
                </div>

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
                  {busy ? "Saving…" : "Save new password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
