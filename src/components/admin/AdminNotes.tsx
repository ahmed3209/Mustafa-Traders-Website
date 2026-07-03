"use client";

import { useState } from "react";

export function AdminNotes({
  id,
  initial,
}: {
  id: string;
  initial: string;
}) {
  const [notes, setNotes] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setBusy(true);
    setSaved(false);
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, adminNotes: notes }),
    });
    setBusy(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  return (
    <div>
      <textarea
        rows={4}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Internal notes (not shown to the customer)…"
        className="field"
      />
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={busy}
          className="bm-btn-gold !min-h-0 !px-4 !py-2 !text-xs"
        >
          {busy ? "Saving…" : "Save notes"}
        </button>
        {saved && <span className="text-xs text-success">Saved ✓</span>}
      </div>
    </div>
  );
}
