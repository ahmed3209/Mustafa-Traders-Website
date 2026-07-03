"use client";

import { useState } from "react";

export function AdminNotes({ id, initial }: { id: string; initial: string }) {
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
        rows={3}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add internal notes…"
        className="adm-field"
        style={{ resize: "vertical", lineHeight: 1.5 }}
      />
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={busy}
          className="px-4 py-2 text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-[#C9A84C] disabled:opacity-60"
          style={{ background: "#1C1007" }}
        >
          {busy ? "Saving…" : "Save Note"}
        </button>
        {saved && <span className="text-xs text-[#15803d]">Saved ✓</span>}
      </div>
    </div>
  );
}
