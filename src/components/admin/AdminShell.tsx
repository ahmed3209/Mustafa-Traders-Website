import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/pricing", label: "Pricing" },
];

// Dark top bar from the Claude Design admin, rebranded to Mustafa Traders.
export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header
        className="sticky top-0 z-[100] flex h-[62px] items-center justify-between px-[5%]"
        style={{ background: "#1C1007" }}
      >
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="adm-display text-[1.3rem] font-bold text-[#FDFBF7]">
              MUSTAFA
            </span>
            <span className="border-l border-white/15 pl-2.5 text-[0.58rem] font-bold uppercase tracking-[0.2em] text-[#C9A84C]">
              Traders Admin
            </span>
          </Link>
          <nav className="hidden items-center gap-4 sm:flex">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="text-[0.8rem] text-[rgba(253,251,247,0.6)] transition-colors hover:text-[#C9A84C]"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-[0.78rem] text-[rgba(253,251,247,0.55)] hover:text-[#FDFBF7]"
          >
            ← Store
          </Link>
          <LogoutButton />
        </div>
      </header>
      <div className="mx-auto max-w-[1200px] px-[5%] py-8">{children}</div>
    </>
  );
}
