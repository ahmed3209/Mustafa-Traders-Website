import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { NotConfiguredNotice } from "@/components/admin/bits";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { AdminNotes } from "@/components/admin/AdminNotes";
import { getOrder } from "@/lib/orders";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { formatPKR } from "@/lib/utils";

export const dynamic = "force-dynamic";

function waLink(name: string, id: string, phone: string) {
  const intl = "92" + phone.replace(/\D/g, "").replace(/^92/, "").replace(/^0/, "");
  const text = encodeURIComponent(`Salam ${name}! This is Mustafa Traders regarding your order ${id}.`);
  return `https://wa.me/${intl}?text=${text}`;
}

const eyebrow = "text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#78716C]";

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
  const o = await getOrder(params.id);
  if (!o) notFound();

  const wa = waLink(o.customerName, o.id, o.whatsappNumber || o.phone);

  return (
    <AdminShell>
      <Link href="/admin/orders" className="text-sm text-[#78716C] underline hover:text-[#C9A84C]">
        ← All orders
      </Link>

      <div className="adm-card mt-4 max-w-[560px] overflow-hidden">
        {/* Dark header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ background: "#1C1007" }}>
          <div>
            <div className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#C9A84C]">Order Detail</div>
            <div className="font-mono text-base font-bold text-[#FDFBF7]">{o.id}</div>
          </div>
          <div className="text-[0.75rem] text-[rgba(253,251,247,0.55)]">
            {new Date(o.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
          </div>
        </div>

        <div className="p-6">
          {/* Status */}
          <div className="mb-5 border-b border-[#f0ece4] pb-5">
            <div className={`${eyebrow} mb-2`}>Status</div>
            <OrderStatusSelect id={o.id} status={o.status} />
          </div>

          {/* Customer */}
          <div className="mb-5 border-b border-[#f0ece4] pb-5">
            <div className={`${eyebrow} mb-3`}>Customer</div>
            <div className="mb-3 grid grid-cols-2 gap-3">
              <Field label="Name" value={o.customerName} />
              <Field label="City" value={o.city} />
            </div>
            <div className="mb-2.5">
              <div className="mb-0.5 text-[0.7rem] text-[#78716C]">Phone</div>
              <a href={`tel:${o.phone}`} className="text-[0.9rem] font-semibold text-[#C9A84C]">{o.phone}</a>
            </div>
            <div>
              <div className="mb-0.5 text-[0.7rem] text-[#78716C]">Address</div>
              <div className="text-[0.88rem] leading-relaxed">{o.address}</div>
            </div>
          </div>

          {/* Order details */}
          <div className="mb-5 border-b border-[#f0ece4] pb-5">
            <div className={`${eyebrow} mb-3`}>Order Details</div>
            <div className="bg-[#F5F0E8] p-4">
              <Row k="Size" v={<span className="capitalize">{o.mattressSize}</span>} />
              <Row k="Quantity" v={o.quantity} />
              <Row k="Unit Price" v={formatPKR(o.unitPrice)} />
              <Row k="Payment" v={o.paymentMethod === "cod" ? "Cash on Delivery" : "Advance Bank Transfer"} />
              <div className="mt-1 flex justify-between border-t border-[#e7e2d9] pt-2 text-[0.95rem]">
                <span className="font-bold">Total</span>
                <span className="adm-display text-[1.1rem] font-bold text-[#C9A84C]">{formatPKR(o.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Customer notes */}
          {o.orderNotes && (
            <div className="mb-5 border-b border-[#f0ece4] pb-5">
              <div className={`${eyebrow} mb-2`}>Customer Notes</div>
              <div className="bg-[#F5F0E8] px-3.5 py-3 text-[0.86rem] leading-relaxed">{o.orderNotes}</div>
            </div>
          )}

          {/* Admin notes */}
          <div className="mb-5">
            <div className={`${eyebrow} mb-2`}>Admin Notes</div>
            <AdminNotes id={o.id} initial={o.adminNotes || ""} />
          </div>

          {/* Contact actions */}
          <div className="flex gap-2.5">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="flex-1 rounded bg-[#25D366] py-3 text-center text-[0.82rem] font-bold text-white">
              WhatsApp Customer
            </a>
            <a href={`tel:${o.phone}`} className="flex-1 rounded bg-[#F5F0E8] py-3 text-center text-[0.82rem] font-bold text-[#1C1007]">
              Call Customer
            </a>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-0.5 text-[0.7rem] text-[#78716C]">{label}</div>
      <div className="text-[0.9rem] font-semibold">{value}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="mb-2 flex justify-between text-[0.86rem]">
      <span className="text-[#78716C]">{k}</span>
      <span className="font-semibold">{v}</span>
    </div>
  );
}
