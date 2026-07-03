"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OrderStatus } from "@/types/order";
import { STATUS_META } from "@/components/admin/bits";

const STATUSES: OrderStatus[] = [
  "new",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

export function OrderStatusSelect({
  id,
  status,
}: {
  id: string;
  status: OrderStatus;
}) {
  const router = useRouter();
  const [value, setValue] = useState<OrderStatus>(status);
  const [busy, setBusy] = useState(false);

  async function change(next: OrderStatus) {
    const prev = value;
    setValue(next);
    setBusy(true);
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: next }),
    });
    setBusy(false);
    if (res.ok) {
      router.refresh();
    } else {
      setValue(prev); // revert on failure
    }
  }

  const meta = STATUS_META[value];
  return (
    <select
      value={value}
      disabled={busy}
      onChange={(e) => change(e.target.value as OrderStatus)}
      aria-label={`Status for ${id}`}
      className="cursor-pointer rounded border border-[#e7e2d9] px-2 py-1 text-xs font-semibold"
      style={{ background: meta.bg, color: meta.fg }}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s} style={{ background: "#fff", color: "#1c1007" }}>
          {STATUS_META[s].label}
        </option>
      ))}
    </select>
  );
}
