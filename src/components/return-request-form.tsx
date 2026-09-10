"use client";

import { useState } from "react";

export function ReturnRequestForm({ orderId }: { orderId: string }) {
  const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch(`/api/orders/${orderId}/returns`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
    setMessage(response.ok ? "Return request submitted." : (await response.json()).error || "Unable to request return."); setBusy(false);
  }
  return <form className="mt-10 border-t border-[var(--line)] pt-6" onSubmit={submit}><h2 className="text-2xl">Request a return</h2><div className="mt-4 grid gap-4"><label className="grid gap-2 text-sm"><span className="text-[var(--muted)]">Reason</span><input className="border-b border-[var(--line)] bg-transparent px-1 py-3 outline-none focus:border-[var(--leaf)]" name="reason" required /></label><label className="grid gap-2 text-sm"><span className="text-[var(--muted)]">Details</span><textarea className="min-h-20 border border-[var(--line)] bg-transparent p-3 outline-none focus:border-[var(--leaf)]" name="description" /></label><button className="w-fit rounded-full border border-[var(--leaf)] px-5 py-2 text-sm font-bold text-[var(--leaf)] disabled:opacity-50" disabled={busy} type="submit">{busy ? "Submitting..." : "Request return"}</button>{message && <p className="text-sm text-[var(--muted)]" role="status">{message}</p>}</div></form>;
}