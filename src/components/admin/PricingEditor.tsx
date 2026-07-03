"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ResolvedSize } from "@/lib/pricing";
import { formatPKR } from "@/lib/utils";

interface Row {
  size: ResolvedSize["size"];
  label: string;
  price: string;
  discountPrice: string;
  discountLabel: string;
}

export function PricingEditor({ sizes }: { sizes: ResolvedSize[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>(
    sizes.map((s) => ({
      size: s.size,
      label: s.label,
      price: String(s.price),
      discountPrice: s.discountPrice != null ? String(s.discountPrice) : "",
      discountLabel: s.discountLabel ?? "",
    }))
  );
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function set(i: number, key: keyof Row, val: string) {
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [key]: val } : row)));
  }

  function preview(row: Row) {
    const price = Number(row.price) || 0;
    const disc = Number(row.discountPrice) || 0;
    const active = disc > 0 && disc < price;
    return { price, disc, active, save: active ? price - disc : 0 };
  }

  async function save() {
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/admin/pricing", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: rows.map((r) => ({
          size: r.size,
          price: Number(r.price),
          discountPrice: r.discountPrice ? Number(r.discountPrice) : null,
          discountLabel: r.discountLabel || null,
        })),
      }),
    });
    setBusy(false);
    if (res.ok) {
      setMsg({ ok: true, text: "Pricing saved. The store is updated." });
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setMsg({ ok: false, text: j.error || "Could not save pricing." });
    }
  }

  return (
    <div>
      <div className="space-y-4">
        {rows.map((row, i) => {
          const p = preview(row);
          return (
            <div key={row.size} className="border border-border-subtle bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold">{row.label}</h3>
                <div className="text-sm">
                  {p.active ? (
                    <span>
                      <span className="text-text-muted line-through">{formatPKR(p.price)}</span>{" "}
                      <span className="font-bold text-gold">{formatPKR(p.disc)}</span>{" "}
                      <span className="text-success">(save {formatPKR(p.save)})</span>
                    </span>
                  ) : (
                    <span className="font-bold text-gold">{formatPKR(p.price)}</span>
                  )}
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="text-xs font-medium">
                  Base price (Rs.)
                  <input
                    type="number"
                    className="field mt-1"
                    value={row.price}
                    onChange={(e) => set(i, "price", e.target.value)}
                  />
                </label>
                <label className="text-xs font-medium">
                  Discounted price (Rs.)
                  <input
                    type="number"
                    className="field mt-1"
                    placeholder="Leave empty for none"
                    value={row.discountPrice}
                    onChange={(e) => set(i, "discountPrice", e.target.value)}
                  />
                </label>
                <label className="text-xs font-medium">
                  Discount tag (optional)
                  <input
                    type="text"
                    className="field mt-1"
                    placeholder="e.g. SUMMER SALE"
                    value={row.discountLabel}
                    onChange={(e) => set(i, "discountLabel", e.target.value)}
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button type="button" onClick={save} disabled={busy} className="bm-btn-gold">
          {busy ? "Saving…" : "Save pricing"}
        </button>
        {msg && (
          <span className={`text-sm ${msg.ok ? "text-success" : "text-error"}`}>
            {msg.text}
          </span>
        )}
      </div>
      <p className="mt-3 text-xs text-text-muted">
        Set a discounted price below the base price to show a strikethrough + tag
        on the store. Leave it empty to remove the discount.
      </p>
    </div>
  );
}
