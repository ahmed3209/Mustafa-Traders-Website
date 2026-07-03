import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/pricing", label: "Pricing" },
];

// Shared chrome for authenticated admin pages (not the login page).
export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="flex items-center justify-between border-b border-border-subtle bg-white px-4 py-3 md:px-8">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-display text-lg font-bold">
            Mustafa Traders Admin
          </Link>
          <nav className="flex gap-4 text-sm">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="text-text-muted hover:text-gold">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <LogoutButton />
      </header>
      <main className="mx-auto max-w-content p-4 md:p-8">{children}</main>
    </>
  );
}
