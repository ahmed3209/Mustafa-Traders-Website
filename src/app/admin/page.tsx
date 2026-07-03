import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge, NotConfiguredNotice } from "@/components/admin/bits";
import { getStats, listOrders } from "@/lib/orders";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { formatPKR } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const configured = isSupabaseConfigured();
  const [stats, orders] = await Promise.all([getStats(), listOrders()]);
  const recent = orders.slice(0, 8);

  const cards = [
    { label: "Orders Today", value: String(stats.today) },
    { label: "This Month", value: String(stats.month) },
    { label: "Revenue (Month)", value: formatPKR(stats.revenueMonth) },
    { label: "Total Orders", value: String(stats.total) },
  ];

  return (
    <AdminShell>
      <h1 className="font-display text-3xl font-bold">Dashboard</h1>

      {!configured && (
        <div className="mt-4">
          <NotConfiguredNotice />
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="border border-border-subtle bg-white p-6 text-center">
            <div className="text-2xl font-bold text-gold">{c.value}</div>
            <div className="mt-1 text-sm text-text-muted">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm underline hover:text-gold">
            View all →
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="mt-3 text-text-muted">
            {configured ? "No orders yet." : "Connect Supabase to load orders."}
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto border border-border-subtle bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-linen">
                <tr>
                  {["Order ID", "Customer", "City", "Total", "Status"].map((h) => (
                    <th key={h} className="px-3 py-2 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((o) => (
                  <tr key={o.id} className="border-t border-border-subtle">
                    <td className="px-3 py-2">
                      <Link href={`/admin/orders/${o.id}`} className="font-medium hover:text-gold">{o.id}</Link>
                    </td>
                    <td className="px-3 py-2">{o.customerName}</td>
                    <td className="px-3 py-2">{o.city}</td>
                    <td className="px-3 py-2 tabular-nums">{formatPKR(o.totalAmount)}</td>
                    <td className="px-3 py-2"><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
