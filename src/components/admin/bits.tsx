import type { OrderStatus } from "@/types/order";

// Status colors from the Claude Design admin.
export const STATUS_META: Record<OrderStatus, { bg: string; fg: string; label: string }> = {
  new: { bg: "#DBEAFE", fg: "#1d4ed8", label: "New" },
  confirmed: { bg: "#FEF3C7", fg: "#92400e", label: "Confirmed" },
  shipped: { bg: "#FFEDD5", fg: "#9a3412", label: "Shipped" },
  delivered: { bg: "#DCFCE7", fg: "#15803d", label: "Delivered" },
  cancelled: { bg: "#FEE2E2", fg: "#b91c1c", label: "Cancelled" },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const s = STATUS_META[status];
  return (
    <span
      className="inline-block rounded px-2 py-0.5 text-xs font-semibold"
      style={{ background: s.bg, color: s.fg }}
    >
      {s.label}
    </span>
  );
}

export function NotConfiguredNotice() {
  return (
    <div className="border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
      <strong>Supabase isn&apos;t configured yet.</strong> Add{" "}
      <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
      <code>SUPABASE_SERVICE_ROLE_KEY</code> to <code>.env.local</code> and run
      the SQL in <code>supabase/schema.sql</code> to enable order storage and
      pricing edits. See the README.
    </div>
  );
}
