import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  createSupabaseAdminClient,
  isSupabaseConfigured,
} from "@/lib/supabase/admin";
import type { MattressSize } from "@/types/order";

interface PricingUpdate {
  size: MattressSize;
  price: number;
  discountPrice: number | null;
  discountLabel: string | null;
}

// PUT /api/admin/pricing — upsert base price + discount per size.
export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured. Pricing edits require a database." },
      { status: 503 }
    );
  }

  let body: { items?: PricingUpdate[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "No items provided" }, { status: 422 });
  }

  const rows = body.items.map((it) => {
    const price = Math.round(Number(it.price));
    const discountRaw =
      it.discountPrice === null || it.discountPrice === undefined
        ? null
        : Math.round(Number(it.discountPrice));
    // Ignore an invalid or non-reducing discount.
    const discount_price =
      discountRaw && discountRaw > 0 && discountRaw < price ? discountRaw : null;
    return {
      size: it.size,
      price,
      discount_price,
      discount_label: it.discountLabel?.trim() || null,
      updated_at: new Date().toISOString(),
    };
  });

  if (rows.some((r) => !Number.isFinite(r.price) || r.price <= 0)) {
    return NextResponse.json({ error: "Invalid price" }, { status: 422 });
  }

  try {
    const sb = createSupabaseAdminClient();
    const { error } = await sb.from("size_pricing").upsert(rows, {
      onConflict: "size",
    });
    if (error) throw new Error(error.message);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Update failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
