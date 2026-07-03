import { NextResponse } from "next/server";
import { orderSchema } from "@/lib/validations/order";
import { getPricing, findResolved } from "@/lib/pricing";
import { createOrder } from "@/lib/orders";
import { sendNewOrderEmail } from "@/lib/email";
import type { CreateOrderInput } from "@/types/order";

// POST /api/orders — create a new order.
// Prices are recomputed server-side from the admin-managed pricing (never
// trusted from the client). Persists to Supabase when configured and emails
// the owner via Resend; both degrade gracefully when not configured.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  // Honeypot: silently accept bots without storing.
  if (parsed.data.website) {
    return NextResponse.json({ id: "BM-0000-0000" }, { status: 200 });
  }

  const data = parsed.data;

  // Recompute price/total from server-side pricing.
  const pricing = await getPricing();
  const sizeInfo = findResolved(pricing, data.mattressSize);
  if (!sizeInfo || !sizeInfo.enabled) {
    return NextResponse.json(
      { error: "Selected size is not available" },
      { status: 422 }
    );
  }
  const unitPrice = sizeInfo.effectivePrice;
  const totalAmount = unitPrice * data.quantity;

  const input: CreateOrderInput = {
    customerName: data.customerName,
    phone: data.phone,
    whatsappNumber: data.whatsappNumber || undefined,
    city: data.city,
    address: data.address,
    mattressSize: data.mattressSize,
    quantity: data.quantity,
    paymentMethod: data.paymentMethod,
    orderNotes: data.orderNotes || undefined,
  };

  let id: string;
  try {
    const result = await createOrder({ ...input, unitPrice, totalAmount });
    id = result.id;
  } catch (err) {
    console.error("[order] persist failed:", err);
    return NextResponse.json(
      { error: "Could not save your order. Please try again." },
      { status: 500 }
    );
  }

  // Fire-and-forget email (never blocks the response on failure).
  sendNewOrderEmail({
    ...input,
    id,
    unitPrice,
    totalAmount,
    sizeLabel: `${sizeInfo.label} (${sizeInfo.dimensions})`,
  }).catch(() => {});

  return NextResponse.json({ id }, { status: 201 });
}
