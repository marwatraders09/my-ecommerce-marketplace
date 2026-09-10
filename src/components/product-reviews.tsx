"use client";

import { useState } from "react";

type Review = { rating: number; title: string | null; body: string; verifiedPurchase: boolean };
export function ProductReviews({ productId, reviews }: { productId: string; reviews: Review[] }) {
  const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const raw = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch("/api/reviews", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ productId, rating: Number(raw.rating), title: raw.title, body: raw.body }) });
    setMessage(response.ok ? "Review submitted for moderation." : (await response.json()).error || "Unable to submit review."); setBusy(false);
  }
  return <section className="mt-12 border-t border-[var(--line)] pt-8"><h2 className="text-2xl">Reviews</h2>{reviews.length ? <div className="mt-6 space-y-5">{reviews.map((review, index) => <article className="border-b border-[var(--line)] pb-5" key={`${review.body}-${index}`}><p className="text-sm">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)} {review.verifiedPurchase && <span className="ml-2 text-[var(--muted)]">Verified purchase</span>}</p>{review.title && <h3 className="mt-2 font-bold">{review.title}</h3>}<p className="mt-1 text-sm text-[var(--muted)]">{review.body}</p></article>)}</div> : <p className="mt-4 text-sm text-[var(--muted)]">No reviews yet.</p>}<form className="mt-8 grid max-w-xl gap-4" onSubmit={submit}><h3 className="text-lg">Share your experience</h3><label className="grid gap-2 text-sm"><span className="text-[var(--muted)]">Rating</span><select className="border-b border-[var(--line)] bg-transparent py-2" defaultValue="5" name="rating"><option value="5">5 stars</option><option value="4">4 stars</option><option value="3">3 stars</option><option value="2">2 stars</option><option value="1">1 star</option></select></label><input className="border-b border-[var(--line)] bg-transparent py-2 text-sm outline-none" name="title" placeholder="Review title" /><textarea className="min-h-24 border border-[var(--line)] bg-transparent p-3 text-sm outline-none" name="body" placeholder="What did you think?" required /><button className="w-fit rounded-full border border-[var(--leaf)] px-5 py-2 text-sm font-bold text-[var(--leaf)] disabled:opacity-50" disabled={busy} type="submit">{busy ? "Submitting..." : "Submit review"}</button>{message && <p className="text-sm text-[var(--muted)]" role="status">{message}</p>}</form></section>;
}