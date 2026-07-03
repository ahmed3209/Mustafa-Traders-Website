"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="border-[1.5px] border-border-subtle px-4 py-2 text-xs font-semibold uppercase tracking-wide text-text-dark transition-colors hover:border-gold hover:text-gold"
    >
      Logout
    </button>
  );
}
