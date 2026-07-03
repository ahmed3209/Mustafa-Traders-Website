"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    if (res?.ok) {
      router.push(callbackUrl);
      router.refresh();
    } else {
      setError("Invalid username or password.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm">
      <div className="mb-6 text-center">
        <div className="font-display text-2xl font-bold">Mustafa Traders Admin</div>
        <p className="mt-1 text-sm text-text-muted">Sign in to manage orders</p>
      </div>

      <label htmlFor="u" className="mb-1 block text-sm font-medium">Username</label>
      <input id="u" className="field mb-4" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" autoFocus />

      <label htmlFor="p" className="mb-1 block text-sm font-medium">Password</label>
      <input id="p" type="password" className="field mb-4" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />

      {error && <p className="mb-4 text-sm text-error" role="alert">{error}</p>}

      <button type="submit" disabled={busy} className="bm-btn-gold w-full">
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
