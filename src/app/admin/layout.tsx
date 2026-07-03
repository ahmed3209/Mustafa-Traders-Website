import type { Metadata } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";

// Admin uses the Claude Design "Boston Mattress Admin" type pairing.
const admDisplay = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-admin-display",
  display: "swap",
});
const admBody = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-admin-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${admDisplay.variable} ${admBody.variable} admin-root`}>
      {children}
    </div>
  );
}
