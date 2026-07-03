import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge, NotConfiguredNotice } from "@/components/admin/bits";
import { listOrders } from "@/lib/orders";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { formatPKR } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const configured = isSupabaseConfigured();
  const orders = await listOrders();

  const total = orders.length;
  const newPending = orders.filter(
    (o) => o.status === "new" || o.status === "confirmed"
  ).length;
  const shipped = orders.filter((o) => o.status === "shipped").length;
  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + o.totalAmount, 0);

  const cards = [
    { label: "Total Orders", value: String(total), color: "#C9A84C" },
    { label: "New / Pending", value: String(newPending), color: "#1d4ed8" },
    { label: "Shipped", value: String(shipped), color: "#d97706" },
    { label: "Revenue (PKR)", value: formatPKR(revenue), color: "#15803D", small: true },
  ];

  const recent = orders.slice(0, 8);

  return (
    <AdminShell>
      {!configured && (
        <div className="mb-6">
          <NotConfiguredNotice />
        </div>
      )}

      {/* Stat cards */}
      <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="adm-card px-[22px] py-5"
            style={{ borderLeft: `4px solid ${c.color}` }}
          >
            <div className="mb-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#78716C]">
              {c.label}
            </div>
            <div
              className="adm-display font-bold leading-none"
              style={{ color: c.color, fontSize: c.small ? "1.6rem" : "2rem" }}
            >
              {c.value}
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="adm-display text-xl font-bold">Recent Orders</h2>
        <Link href="/admin/orders" className="text-sm text-[#78716C] underline hover:text-[#C9A84C]">
          View all →
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="adm-card px-10 py-14 text-center">
          <div className="mb-3 text-5xl">📭</div>
          <div className="adm-display mb-1.5 text-2xl">No orders yet</div>
          <div className="text-sm text-[#78716C]">
            {configured
              ? "Orders will appear here once customers place them from the store."
              : "Connect Supabase to load orders."}
          </div>
        </div>
      ) : (
        <div className="adm-card overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-[#e7e2d9] bg-[#F5F4F2]">
                {["Order ID", "Customer", "City", "Total", "Status", "Date"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#78716C]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o.id} className="adm-row border-b border-[#f0ece4]">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="font-mono text-[0.8rem] font-semibold text-[#C9A84C]">
                      {o.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-medium">{o.customerName}</td>
                  <td className="px-4 py-3">{o.city}</td>
                  <td className="px-4 py-3 font-bold text-[#C9A84C] tabular-nums">{formatPKR(o.totalAmount)}</td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-3 whitespace-nowrap text-[0.78rem] text-[#78716C]">
                    {new Date(o.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
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
