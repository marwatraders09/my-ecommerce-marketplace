"use client";

import { useState } from "react";

const fields = ["name", "category", "website", "companyName", "businessAddress", "contactInformation"] as const;
export function BrandApplicationForm() {
  const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const form = new FormData(event.currentTarget); const data = Object.fromEntries(fields.map((field) => [field, form.get(field) || ""])); data.description = String(form.get("description") || ""); data.authorizationNotes = String(form.get("authorizationNotes") || "");
    const response = await fetch("/api/brands/register", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
    setMessage(response.ok ? "Application submitted for review." : (await response.json()).error || "Unable to submit application."); setBusy(false);
  }
  return <form className="grid gap-5 sm:grid-cols-2" onSubmit={submit}><h2 className="text-2xl sm:col-span-2">1. Brand information</h2>{fields.slice(0, 3).map((field) => <label className="grid gap-2 text-sm" key={field}><span className="capitalize text-[var(--muted)]">{field}</span><input className="border-b border-[var(--line)] bg-transparent px-1 py-3 outline-none focus:border-[var(--leaf)]" name={field} required={field !== "website"} /></label>)}<label className="grid gap-2 text-sm sm:col-span-2"><span className="text-[var(--muted)]">Description</span><textarea className="min-h-24 border border-[var(--line)] bg-transparent p-3 outline-none focus:border-[var(--leaf)]" name="description" /></label><h2 className="pt-6 text-2xl sm:col-span-2">2. Business information</h2>{fields.slice(3).map((field) => <label className="grid gap-2 text-sm" key={field}><span className="capitalize text-[var(--muted)]">{field.replace(/([A-Z])/g, " $1")}</span><input className="border-b border-[var(--line)] bg-transparent px-1 py-3 outline-none focus:border-[var(--leaf)]" name={field} required /></label>)}<h2 className="pt-6 text-2xl sm:col-span-2">3. Brand verification</h2><label className="grid gap-2 text-sm sm:col-span-2"><span className="text-[var(--muted)]">Ownership or authorization details</span><textarea className="min-h-28 border border-[var(--line)] bg-transparent p-3 outline-none focus:border-[var(--leaf)]" name="authorizationNotes" required /></label><button className="w-fit rounded-full bg-[var(--leaf)] px-6 py-3 text-sm font-bold text-white disabled:opacity-50" disabled={busy} type="submit">{busy ? "Submitting..." : "Submit application"}</button>{message && <p className="sm:col-span-2 text-sm text-[var(--muted)]" role="status">{message}</p>}</form>;
}