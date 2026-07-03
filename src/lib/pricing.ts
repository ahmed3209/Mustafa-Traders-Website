import { product } from "@/config/product";
import type { MattressSize } from "@/types/order";
import {
  createSupabaseAdminClient,
  isSupabaseConfigured,
} from "@/lib/supabase/admin";

// Resolved pricing for one size = static config merged with any admin-managed
// overrides (base price + discount) stored in Supabase `size_pricing`.
export interface ResolvedSize {
  size: MattressSize;
  label: string;
  dimensions: string;
  enabled: boolean;
  price: number; // original / list price
  discountPrice: number | null; // active discounted price (when < price)
  discountLabel: string | null; // optional tag text
  effectivePrice: number; // what the customer actually pays
  hasDiscount: boolean;
  savings: number; // price - effectivePrice
  discountPercent: number; // rounded %
}

interface PricingRow {
  size: MattressSize;
  price: number;
  discount_price: number | null;
  discount_label: string | null;
}

function resolve(
  base: (typeof product.sizes)[number],
  row?: PricingRow
): ResolvedSize {
  const price = row?.price ?? base.price;
  const discountPrice =
    row?.discount_price && row.discount_price > 0 && row.discount_price < price
      ? row.discount_price
      : null;
  const effectivePrice = discountPrice ?? price;
  const savings = price - effectivePrice;
  return {
    size: base.size,
    label: base.label,
    dimensions: base.dimensions,
    enabled: base.enabled,
    price,
    discountPrice,
    discountLabel: row?.discount_label ?? null,
    effectivePrice,
    hasDiscount: discountPrice !== null,
    savings,
    discountPercent: discountPrice ? Math.round((savings / price) * 100) : 0,
  };
}

/**
 * Server-only: resolve pricing for every configured size. Reads admin overrides
 * from Supabase when configured; otherwise falls back to static config so the
 * store works without a database.
 */
export async function getPricing(): Promise<ResolvedSize[]> {
  let rows: Record<string, PricingRow> = {};

  if (isSupabaseConfigured()) {
    try {
      const sb = createSupabaseAdminClient();
      const { data } = await sb
        .from("size_pricing")
        .select("size, price, discount_price, discount_label");
      if (data) {
        for (const r of data as PricingRow[]) rows[r.size] = r;
      }
    } catch {
      // Network/permission issue — fall back to config.
    }
  }

  return product.sizes.map((b) => resolve(b, rows[b.size]));
}

export const enabledResolved = (sizes: ResolvedSize[]): ResolvedSize[] =>
  sizes.filter((s) => s.enabled);

export const findResolved = (
  sizes: ResolvedSize[],
  size: MattressSize
): ResolvedSize | undefined => sizes.find((s) => s.size === size);
