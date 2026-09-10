"use client";

import { useState } from "react";

const fields = ["storeName", "businessName", "businessAddress", "city", "state", "country", "postalCode", "taxId"] as const;
export function SellerApplicationForm() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const form = new FormData(event.currentTarget); const data = Object.fromEntries(fields.map((field) => [field, form.get(field) || undefined])); data.description = String(form.get("description") || "");
    const response = await fetch("/api/sellers/register", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
    setMessage(response.ok ? "Application submitted for review." : (await response.json()).error || "Unable to submit application."); setBusy(false);
  }
  return <form className="grid gap-5 sm:grid-cols-2" onSubmit={submit}>{fields.map((field) => <label className="grid gap-2 text-sm" key={field}><span className="capitalize text-[var(--muted)]">{field.replace(/([A-Z])/g, " $1")}</span><input className="border-b border-[var(--line)] bg-transparent px-1 py-3 outline-none focus:border-[var(--leaf)]" name={field} required={field !== "taxId"} /></label>)}<label className="grid gap-2 text-sm sm:col-span-2"><span className="text-[var(--muted)]">Store description</span><textarea className="min-h-28 border border-[var(--line)] bg-transparent p-3 outline-none focus:border-[var(--leaf)]" name="description" /></label><button className="w-fit rounded-full bg-[var(--leaf)] px-6 py-3 text-sm font-bold text-white disabled:opacity-50" disabled={busy} type="submit">{busy ? "Submitting..." : "Submit application"}</button>{message && <p className="sm:col-span-2 text-sm text-[var(--muted)]" role="status">{message}</p>}</form>;
}