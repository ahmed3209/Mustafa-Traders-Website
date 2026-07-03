import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge, NotConfiguredNotice } from "@/components/admin/bits";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { listOrders, type OrderFilters } from "@/lib/orders";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { PAKISTAN_CITIES } from "@/config/cities";
import { formatPKR } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUSES = ["new", "confirmed", "shipped", "delivered", "cancelled"];

function waLink(phone: string) {
  const intl = "92" + phone.replace(/\D/g, "").replace(/^92/, "").replace(/^0/, "");
  return `https://wa.me/${intl}`;
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const configured = isSupabaseConfigured();
  const filters: OrderFilters = {
    status: searchParams.status || undefined,
    city: searchParams.city || undefined,
    q: searchParams.q || undefined,
    from: searchParams.from || undefined,
    to: searchParams.to || undefined,
  };
  const orders = await listOrders(filters);

  const qs = new URLSearchParams(
    Object.entries(filters).filter(([, v]) => v) as [string, string][]
  ).toString();

  const inputCls = "border border-border-subtle bg-white px-2 py-1.5 text-sm";

  return (
    <AdminShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold">Orders</h1>
        <a
          href={`/api/admin/orders/export${qs ? `?${qs}` : ""}`}
          className="border-[1.5px] border-gold px-4 py-2 text-sm font-semibold uppercase tracking-wide text-text-dark transition-colors hover:bg-gold hover:text-charcoal"
        >
          Export CSV
        </a>
      </div>

      {!configured && (
        <div className="mt-4">
          <NotConfiguredNotice />
        </div>
      )}

      {/* Filters */}
      <form method="get" className="mt-5 flex flex-wrap items-end gap-3">
        <label className="text-xs font-medium">
          <span className="mb-1 block text-text-muted">Search</span>
          <input name="q" defaultValue={filters.q} placeholder="Name / phone / ID" className={inputCls} />
        </label>
        <label className="text-xs font-medium">
          <span className="mb-1 block text-text-muted">Status</span>
          <select name="status" defaultValue={filters.status ?? ""} className={inputCls}>
            <option value="">All</option>
            {STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize">{s}</option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium">
          <span className="mb-1 block text-text-muted">City</span>
          <select name="city" defaultValue={filters.city ?? ""} className={inputCls}>
            <option value="">All</option>
            {PAKISTAN_CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium">
          <span className="mb-1 block text-text-muted">From</span>
          <input type="date" name="from" defaultValue={filters.from} className={inputCls} />
        </label>
        <label className="text-xs font-medium">
          <span className="mb-1 block text-text-muted">To</span>
          <input type="date" name="to" defaultValue={filters.to} className={inputCls} />
        </label>
        <button type="submit" className="bm-btn-gold !min-h-0 !px-4 !py-2 !text-xs">Apply</button>
        {qs && (
          <Link href="/admin/orders" className="py-2 text-xs text-text-muted underline hover:text-gold">
            Clear
          </Link>
        )}
      </form>

      {orders.length === 0 ? (
        <p className="mt-6 text-text-muted">
          {configured ? "No orders match these filters." : "Connect Supabase to load orders."}
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto border border-border-subtle bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-linen">
              <tr>
                {["Order ID", "Customer", "Phone", "City", "Size", "Qty", "Total", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-3 py-2 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-border-subtle align-middle">
                  <td className="px-3 py-2">
                    <Link href={`/admin/orders/${o.id}`} className="font-medium hover:text-gold">{o.id}</Link>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{o.customerName}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <a href={`tel:${o.phone}`} className="hover:text-gold">{o.phone}</a>
                  </td>
                  <td className="px-3 py-2">{o.city}</td>
                  <td className="px-3 py-2 capitalize">{o.mattressSize}</td>
                  <td className="px-3 py-2 tabular-nums">{o.quantity}</td>
                  <td className="px-3 py-2 whitespace-nowrap tabular-nums">{formatPKR(o.totalAmount)}</td>
                  <td className="px-3 py-2"><StatusBadge status={o.status} /></td>
                  <td className="px-3 py-2 whitespace-nowrap text-text-muted">
                    {new Date(o.createdAt).toLocaleDateString("en-PK")}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <OrderStatusSelect id={o.id} status={o.status} />
                      <a href={waLink(o.whatsappNumber || o.phone)} target="_blank" rel="noopener noreferrer" className="text-whatsapp" aria-label="WhatsApp customer" title="WhatsApp customer">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.07L2 22l5.07-1.35A9.96 9.96 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" /></svg>
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
