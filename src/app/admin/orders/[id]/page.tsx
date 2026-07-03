import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge, NotConfiguredNotice } from "@/components/admin/bits";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { AdminNotes } from "@/components/admin/AdminNotes";
import { getOrder } from "@/lib/orders";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { formatPKR } from "@/lib/utils";

export const dynamic = "force-dynamic";

function waLink(phone: string) {
  const intl = "92" + phone.replace(/\D/g, "").replace(/^92/, "").replace(/^0/, "");
  return `https://wa.me/${intl}`;
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  if (!isSupabaseConfigured()) {
    return (
      <AdminShell>
        <NotConfiguredNotice />
      </AdminShell>
    );
  }

  const order = await getOrder(params.id);
  if (!order) notFound();

  const rows: [string, string][] = [
    ["Phone", order.phone],
    ["WhatsApp", order.whatsappNumber || order.phone],
    ["City", order.city],
    ["Address", order.address],
    ["Size", `${order.mattressSize} × ${order.quantity}`],
    ["Unit Price", formatPKR(order.unitPrice)],
    ["Total", formatPKR(order.totalAmount)],
    ["Payment", order.paymentMethod === "cod" ? "Cash on Delivery" : "Advance Bank Transfer"],
    ["Customer Notes", order.orderNotes || "—"],
    ["Placed", new Date(order.createdAt).toLocaleString("en-PK")],
  ];

  return (
    <AdminShell>
      <Link href="/admin/orders" className="text-sm text-text-muted underline hover:text-gold">
        ← All orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">{order.id}</h1>
          <p className="text-text-muted">{order.customerName}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} />
          <OrderStatusSelect id={order.id} status={order.status} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="border border-border-subtle bg-white p-5">
          <h2 className="mb-3 font-display text-lg font-bold">Details</h2>
          <dl className="space-y-2 text-sm">
            {rows.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6">
                <dt className="text-text-muted">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex gap-2">
            <a href={`tel:${order.phone}`} className="bm-btn-gold !min-h-0 !px-4 !py-2 !text-xs">Call</a>
            <a href={waLink(order.whatsappNumber || order.phone)} target="_blank" rel="noopener noreferrer" className="border-[1.5px] border-whatsapp px-4 py-2 text-xs font-semibold text-success">WhatsApp</a>
          </div>
        </div>

        <div className="border border-border-subtle bg-white p-5">
          <h2 className="mb-3 font-display text-lg font-bold">Internal Notes</h2>
          <AdminNotes id={order.id} initial={order.adminNotes || ""} />
        </div>
      </div>
    </AdminShell>
  );
}
