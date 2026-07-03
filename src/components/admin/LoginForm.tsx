"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// Styled to the Claude Design admin login (dark gradient + white card + gold
// gradient button), driving the real NextAuth credentials flow.
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
      setError("Incorrect username or password.");
      setBusy(false);
    }
  }

  return (
    <div
      className="flex min-h-[100dvh] items-center justify-center p-6"
      style={{ background: "linear-gradient(135deg,#0D0F1A 0%,#2D1500 100%)" }}
    >
      <form
        onSubmit={onSubmit}
        className="w-full max-w-[400px] bg-white px-10 py-11"
        style={{ animation: "adm-fadein 0.5s ease both" }}
      >
        <div className="mb-8 text-center">
          <div className="adm-display text-3xl font-bold leading-none text-[#2D1500]">
            MUSTAFA
          </div>
          <div className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-[#C9A84C]">
            Traders Admin
          </div>
          <div className="mt-2 text-[0.82rem] text-[#78716C]">
            Owner dashboard — orders &amp; management
          </div>
        </div>

        <label className="mb-1.5 block text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#1C1007]">
          Username
        </label>
        <input
          className="adm-field mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          autoFocus
        />

        <label className="mb-1.5 block text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#1C1007]">
          Password
        </label>
        <input
          type="password"
          className="adm-field mb-5"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {error && (
          <div className="mb-4 rounded bg-[#FEE2E2] px-3.5 py-2.5 text-[0.82rem] text-[#B91C1C]" role="alert">
            {error}
          </div>
        )}

        <button type="submit" disabled={busy} className="adm-btn w-full py-3.5 text-[0.88rem] tracking-[0.1em]">
          {busy ? "Signing in…" : "Sign In to Admin"}
        </button>
      </form>
    </div>
  );
}
