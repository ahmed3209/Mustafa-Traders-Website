import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// Minimal wrapper. The header/nav live in <AdminShell> so the login page can
// opt out of them.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-[100dvh] bg-cream text-text-dark">{children}</div>;
}
