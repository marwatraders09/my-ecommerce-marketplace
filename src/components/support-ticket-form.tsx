"use client";

import { useState } from "react";

export function SupportTicketForm() {
  const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); setBusy(true); const data = Object.fromEntries(new FormData(event.currentTarget).entries()); const response = await fetch("/api/support", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) }); setMessage(response.ok ? "Ticket created." : (await response.json()).error || "Unable to create ticket."); setBusy(false); if (response.ok) event.currentTarget.reset(); }
  return <form className="grid gap-4" onSubmit={submit}><h2 className="text-2xl">Open a support ticket</h2><input className="border-b border-[var(--line)] bg-transparent py-3 text-sm outline-none" name="subject" placeholder="What can we help with?" required /><textarea className="min-h-28 border border-[var(--line)] bg-transparent p-3 text-sm outline-none" name="body" placeholder="Tell us what happened" required /><button className="w-fit rounded-full bg-[var(--leaf)] px-5 py-2 text-sm font-bold text-white disabled:opacity-50" disabled={busy} type="submit">{busy ? "Sending..." : "Send ticket"}</button>{message && <p className="text-sm text-[var(--muted)]" role="status">{message}</p>}</form>;
}