import {
  createSupabaseAdminClient,
  isSupabaseConfigured,
} from "@/lib/supabase/admin";
import type {
  CreateOrderInput,
  OrderStatus,
  MattressSize,
} from "@/types/order";

// Shape returned to the admin UI (camelCase view of the DB row).
export interface AdminOrder {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  whatsappNumber: string | null;
  city: string;
  address: string;
  mattressSize: MattressSize;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  paymentMethod: string;
  orderNotes: string | null;
  adminNotes: string | null;
  status: OrderStatus;
}

// eslint-disable-next-line
function mapRow(r: any): AdminOrder {
  return {
    id: r.id,
    createdAt: r.created_at,
    customerName: r.customer_name,
    phone: r.phone,
    whatsappNumber: r.whatsapp_number,
    city: r.city,
    address: r.address,
    mattressSize: r.mattress_size,
    quantity: r.quantity,
    unitPrice: r.unit_price,
    totalAmount: r.total_amount,
    paymentMethod: r.payment_method,
    orderNotes: r.order_notes,
    adminNotes: r.admin_notes,
    status: r.status,
  };
}

function fallbackId(): string {
  return `BM-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`;
}

/**
 * Persist a new order. Prices are passed in (already recomputed server-side).
 * When Supabase isn't configured, returns a generated id without persisting so
 * the storefront still works in local/dev.
 */
export async function createOrder(
  input: CreateOrderInput & { unitPrice: number; totalAmount: number }
): Promise<{ id: string; persisted: boolean }> {
  if (!isSupabaseConfigured()) {
    return { id: fallbackId(), persisted: false };
  }

  const sb = createSupabaseAdminClient();
  const { data, error } = await sb
    .from("orders")
    .insert({
      customer_name: input.customerName,
      phone: input.phone,
      whatsapp_number: input.whatsappNumber ?? null,
      city: input.city,
      address: input.address,
      mattress_size: input.mattressSize,
      quantity: input.quantity,
      unit_price: input.unitPrice,
      total_amount: input.totalAmount,
      payment_method: input.paymentMethod,
      order_notes: input.orderNotes ?? null,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Order insert failed");
  }
  return { id: data.id as string, persisted: true };
}

export interface OrderFilters {
  status?: string;
  city?: string;
  q?: string; // search: name / phone / id
  from?: string; // yyyy-mm-dd
  to?: string; // yyyy-mm-dd
}

export async function listOrders(
  filters: OrderFilters = {}
): Promise<AdminOrder[]> {
  if (!isSupabaseConfigured()) return [];
  const sb = createSupabaseAdminClient();
  let query = sb.from("orders").select("*").order("created_at", {
    ascending: false,
  });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.city) query = query.eq("city", filters.city);
  if (filters.from) query = query.gte("created_at", filters.from);
  if (filters.to) query = query.lte("created_at", `${filters.to}T23:59:59`);
  if (filters.q) {
    const q = filters.q.replace(/[,%]/g, "").trim();
    if (q) {
      query = query.or(
        `customer_name.ilike.%${q}%,phone.ilike.%${q}%,id.ilike.%${q}%`
      );
    }
  }

  const { data } = await query;
  return (data ?? []).map(mapRow);
}

export async function getOrder(id: string): Promise<AdminOrder | null> {
  if (!isSupabaseConfigured()) return null;
  const sb = createSupabaseAdminClient();
  const { data } = await sb.from("orders").select("*").eq("id", id).single();
  return data ? mapRow(data) : null;
}

export async function updateOrder(
  id: string,
  patch: { status?: OrderStatus; adminNotes?: string }
): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Supabase not configured");
  const sb = createSupabaseAdminClient();
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.status) update.status = patch.status;
  if (patch.adminNotes !== undefined) update.admin_notes = patch.adminNotes;

  const { error } = await sb.from("orders").update(update).eq("id", id);
  if (error) throw new Error(error.message);

  if (patch.status) {
    await sb
      .from("order_status_history")
      .insert({ order_id: id, status: patch.status });
  }
}

export interface OrderStats {
  today: number;
  month: number;
  revenueMonth: number;
  total: number;
}

export async function getStats(): Promise<OrderStats> {
  const empty = { today: 0, month: 0, revenueMonth: 0, total: 0 };
  if (!isSupabaseConfigured()) return empty;
  const sb = createSupabaseAdminClient();
  const { data } = await sb
    .from("orders")
    .select("created_at, total_amount, status");
  if (!data) return empty;

  const now = new Date();
  const startDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  let today = 0,
    month = 0,
    revenueMonth = 0;
  for (const r of data as any[]) {
    const d = new Date(r.created_at);
    if (d >= startDay) today++;
    if (d >= startMonth) {
      month++;
      if (r.status !== "cancelled") revenueMonth += r.total_amount ?? 0;
    }
  }
  return { today, month, revenueMonth, total: data.length };
}
