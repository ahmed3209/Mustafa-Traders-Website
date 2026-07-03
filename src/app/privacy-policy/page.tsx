import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

// Required for WhatsApp Business. Placeholder copy — replace with owner-approved
// policy text before launch.
export default function PrivacyPolicyPage() {
  return (
    <main className="section max-w-3xl">
      <Link href="/" className="text-sm text-text-muted underline hover:text-gold">
        ← Back to home
      </Link>
      <h1 className="mt-6 font-display text-4xl font-bold">Privacy Policy</h1>
      <p className="mt-4 text-text-muted">
        {/* TODO: finalize policy copy with owner. */}
        {site.name} collects only the information needed to process and deliver
        your order — your name, phone number, WhatsApp number, city, and delivery
        address. We use this information solely to confirm and fulfill your order
        and to contact you about it. We do not sell or share your data with third
        parties except delivery partners required to ship your mattress.
      </p>
      <p className="mt-4 text-text-muted">
        For any privacy questions, contact us at {site.phone.display}.
      </p>
    </main>
  );
}
