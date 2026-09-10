"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CheckoutForm() {
  const router = useRouter(); const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch("/api/orders", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
    const result = await response.json();
    if (response.ok) router.push(`/orders/${result.orderId}`); else setMessage(result.error || "Unable to place order");
    setBusy(false);
  }
  return <form className="grid gap-5" onSubmit={submit}><h2 className="text-2xl">Delivery address</h2>{["label", "line1", "line2", "city", "state", "country", "postalCode"].map((field) => <label className="grid gap-2 text-sm" key={field}><span className="capitalize text-[var(--muted)]">{field.replace(/([A-Z])/g, " $1")}</span><input className="border-b border-[var(--line)] bg-transparent px-1 py-3 outline-none focus:border-[var(--leaf)]" name={field} required={field !== "line2"} /></label>)}<label className="grid gap-2 text-sm"><span className="text-[var(--muted)]">Coupon code</span><input className="border-b border-[var(--line)] bg-transparent px-1 py-3 uppercase outline-none focus:border-[var(--leaf)]" name="couponCode" /></label><div className="border-t border-[var(--line)] pt-5"><p className="text-sm text-[var(--muted)]">Payment method</p><p className="mt-2">Cash on delivery</p></div><button className="w-fit rounded-full bg-[var(--leaf)] px-7 py-3 text-sm font-bold text-white disabled:opacity-50" disabled={busy} type="submit">{busy ? "Placing order..." : "Place order"}</button>{message && <p className="text-sm text-[var(--coral)]" role="alert">{message}</p>}</form>;
}