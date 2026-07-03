import type { OrderStatus } from "@/types/order";

const STATUS_STYLE: Record<OrderStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  confirmed: "bg-amber-100 text-amber-800",
  shipped: "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLE[status]}`}
    >
      {status}
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
