"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminReviewButton({ type, id }: { type: "sellers" | "brands" | "products"; id: string }) {
  const router = useRouter(); const [busy, setBusy] = useState(false);
  async function review(status: string) { setBusy(true); const response = await fetch(`/api/admin/${type}/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status }) }); if (response.ok) router.refresh(); setBusy(false); }
  return <div className="flex gap-2"><button className="rounded-full bg-[var(--leaf)] px-4 py-2 text-xs font-bold text-white disabled:opacity-50" disabled={busy} onClick={() => review(type === "products" ? "ACTIVE" : "APPROVED")}>Approve</button><button className="rounded-full border border-[var(--coral)] px-4 py-2 text-xs font-bold text-[var(--coral)] disabled:opacity-50" disabled={busy} onClick={() => review("REJECTED")}>Reject</button></div>;
}