import { AdminShell } from "@/components/admin/AdminShell";
import { NotConfiguredNotice } from "@/components/admin/bits";
import { PricingEditor } from "@/components/admin/PricingEditor";
import { getPricing, enabledResolved } from "@/lib/pricing";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminPricingPage() {
  const configured = isSupabaseConfigured();
  const sizes = enabledResolved(await getPricing());

  return (
    <AdminShell>
      <h1 className="font-display text-3xl font-bold">Pricing &amp; Discounts</h1>
      <p className="mt-1 text-sm text-text-muted">
        Set base prices and optional discounts. Discounts show on the store as a
        strikethrough original price, the discounted value, and a tag.
      </p>

      {!configured ? (
        <div className="mt-6">
          <NotConfiguredNotice />
        </div>
      ) : (
        <div className="mt-6">
          <PricingEditor sizes={sizes} />
        </div>
      )}
    </AdminShell>
  );
}
