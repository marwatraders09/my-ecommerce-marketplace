"use client";

import { useState } from "react";

export function ProductActions({ productId }: { productId: string }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function add(path: string) {
    setBusy(true);
    const response = await fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ productId }) });
    setMessage(response.ok ? path.includes("wishlist") ? "Saved to wishlist" : "Added to bag" : "Sign in to continue");
    setBusy(false);
  }
  return <div className="mt-10 flex flex-wrap gap-3"><button className="rounded-full bg-[var(--leaf)] px-7 py-3 text-sm font-bold text-white hover:bg-[var(--coral)] disabled:opacity-50" disabled={busy} onClick={() => add("/api/cart")}>Add to bag</button><button className="rounded-full border border-[var(--leaf)] px-7 py-3 text-sm font-bold text-[var(--leaf)] disabled:opacity-50" disabled={busy} onClick={() => add("/api/wishlist")}>Save for later</button>{message && <p className="basis-full text-sm text-[var(--muted)]" role="status">{message}</p>}</div>;
}