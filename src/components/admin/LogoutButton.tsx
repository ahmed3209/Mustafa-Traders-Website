"use client";

import { signOut } from "next-auth/react";

// Red-tinted logout matching the Claude Design admin bar.
export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="rounded px-3.5 py-1.5 text-[0.78rem] font-medium transition-colors"
      style={{
        background: "rgba(220,38,38,0.15)",
        border: "1px solid rgba(220,38,38,0.3)",
        color: "#FCA5A5",
      }}
    >
      Logout
    </button>
  );
}
