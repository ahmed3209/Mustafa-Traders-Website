import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { NotConfiguredNotice } from "@/components/admin/bits";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { listOrders, type OrderFilters } from "@/lib/orders";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { PAKISTAN_CITIES } from "@/config/cities";
import { formatPKR } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUSES = ["new", "confirmed", "shipped", "delivered", "cancelled"];

function waLink(name: string, id: string, phone: string) {
  const intl = "92" + phone.replace(/\D/g, "").replace(/^92/, "").replace(/^0/, "");
  const text = encodeURIComponent(
    `Salam ${name}! This is Mustafa Traders regarding your order ${id}.`
  );
  return `https://wa.me/${intl}?text=${text}`;
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

  const th =
    "whitespace-nowrap px-4 py-3 text-left text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#78716C]";

  return (
    <AdminShell>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="adm-display text-3xl font-bold">Orders</h1>
        <a
          href={`/api/admin/orders/export${qs ? `?${qs}` : ""}`}
          className="border-2 border-[#C9A84C] px-4 py-2 text-[0.78rem] font-bold uppercase tracking-[0.08em] text-[#2D1500] transition-colors hover:bg-[#C9A84C]"
        >
          Export CSV
        </a>
      </div>

      {!configured && (
        <div className="mb-5">
          <NotConfiguredNotice />
        </div>
      )}

      {/* Filter bar */}
      <form method="get" className="adm-card mb-4 flex flex-wrap items-end gap-3 p-4">
        <label className="text-[0.72rem] font-semibold text-[#78716C]">
          <span className="mb-1 block uppercase tracking-[0.1em]">Search</span>
          <input name="q" defaultValue={filters.q} placeholder="Name / phone / ID" className="border border-[#e7e2d9] px-2 py-1.5 text-sm text-[#1C1007]" />
        </label>
        <label className="text-[0.72rem] font-semibold text-[#78716C]">
          <span className="mb-1 block uppercase tracking-[0.1em]">Status</span>
          <select name="status" defaultValue={filters.status ?? ""} className="border border-[#e7e2d9] px-2 py-1.5 text-sm capitalize text-[#1C1007]">
            <option value="">All</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label className="text-[0.72rem] font-semibold text-[#78716C]">
          <span className="mb-1 block uppercase tracking-[0.1em]">City</span>
          <select name="city" defaultValue={filters.city ?? ""} className="border border-[#e7e2d9] px-2 py-1.5 text-sm text-[#1C1007]">
            <option value="">All</option>
            {PAKISTAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className="text-[0.72rem] font-semibold text-[#78716C]">
          <span className="mb-1 block uppercase tracking-[0.1em]">From</span>
          <input type="date" name="from" defaultValue={filters.from} className="border border-[#e7e2d9] px-2 py-1.5 text-sm text-[#1C1007]" />
        </label>
        <label className="text-[0.72rem] font-semibold text-[#78716C]">
          <span className="mb-1 block uppercase tracking-[0.1em]">To</span>
          <input type="date" name="to" defaultValue={filters.to} className="border border-[#e7e2d9] px-2 py-1.5 text-sm text-[#1C1007]" />
        </label>
        <button type="submit" className="adm-btn px-4 py-2 text-[0.76rem]">Apply</button>
        {qs && <Link href="/admin/orders" className="py-2 text-[0.76rem] text-[#78716C] underline hover:text-[#C9A84C]">Clear</Link>}
        <span className="ml-auto text-[0.78rem] text-[#78716C]">{orders.length} orders shown</span>
      </form>

      {orders.length === 0 ? (
        <div className="adm-card px-10 py-14 text-center">
          <div className="mb-3 text-5xl">📭</div>
          <div className="adm-display mb-1.5 text-2xl">No orders found</div>
          <div className="text-sm text-[#78716C]">
            {configured ? "No orders match these filters." : "Connect Supabase to load orders."}
          </div>
        </div>
      ) : (
        <div className="adm-card overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-[#e7e2d9] bg-[#F5F4F2]">
                {["Order ID", "Customer", "City", "Size / Qty", "Total", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} className={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="adm-row border-b border-[#f0ece4]">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="font-mono text-[0.8rem] font-semibold text-[#C9A84C]">{o.id}</Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="whitespace-nowrap font-semibold">{o.customerName}</div>
                    <a href={`tel:${o.phone}`} className="text-[0.75rem] text-[#78716C] hover:text-[#C9A84C]">{o.phone}</a>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{o.city}</td>
                  <td className="px-4 py-3">
                    <div className="text-[0.82rem] font-semibold capitalize">{o.mattressSize}</div>
                    <div className="text-[0.74rem] text-[#78716C]">Qty: {o.quantity}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-bold text-[#C9A84C] tabular-nums">{formatPKR(o.totalAmount)}</td>
                  <td className="px-4 py-3"><OrderStatusSelect id={o.id} status={o.status} /></td>
                  <td className="whitespace-nowrap px-4 py-3 text-[0.78rem] text-[#78716C]">
                    {new Date(o.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link href={`/admin/orders/${o.id}`} className="rounded bg-[#F5F0E8] px-2.5 py-1.5 text-[0.74rem] font-semibold text-[#2D1500]">View</Link>
                      <a href={waLink(o.customerName, o.id, o.whatsappNumber || o.phone)} target="_blank" rel="noopener noreferrer" className="rounded px-2.5 py-1.5 text-[0.74rem] font-semibold text-[#15803D]" style={{ background: "rgba(37,211,102,0.12)" }}>WA</a>
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
