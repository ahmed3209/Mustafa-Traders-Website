import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Return Policy",
};

// Trust builder. Placeholder copy — replace with owner-approved text.
export default function ReturnPolicyPage() {
  return (
    <main className="section max-w-3xl">
      <Link href="/" className="text-sm text-text-muted underline hover:text-gold">
        ← Back to home
      </Link>
      <h1 className="mt-6 font-display text-4xl font-bold">Return Policy</h1>
      <p className="mt-4 text-text-muted">
        {/* TODO: finalize return/refund terms with owner. */}
        We want you to love your {site.name} {"—"} Dream Cloud mattress. If
        there is any manufacturing defect or damage on delivery, contact us
        within the agreed window and we will arrange a replacement or resolution.
        Every mattress is backed by a 20-year warranty.
      </p>
      <p className="mt-4 text-text-muted">
        To start a return or report an issue, message us on WhatsApp or call{" "}
        {site.phone.display}.
      </p>
    </main>
  );
}
