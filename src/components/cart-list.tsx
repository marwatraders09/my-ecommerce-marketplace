"use client";

import { useState } from "react";

type CartItem = { id: string; name: string; seller: string; quantity: number; unitPrice: number; available: number };
export function CartList({ initialItems }: { initialItems: CartItem[] }) {
  const [items, setItems] = useState(initialItems);
  async function update(itemId: string, quantity: number) {
    const response = await fetch("/api/cart", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ itemId, quantity }) });
    if (response.ok) setItems((await response.json()).items);
  }
  return <div className="space-y-4">{items.map((item) => <article className="flex items-center justify-between gap-4 border-b border-[var(--line)] py-5" key={item.id}><div><h2 className="text-lg">{item.name}</h2><p className="text-sm text-[var(--muted)]">{item.seller}</p></div><div className="flex items-center gap-4"><button aria-label={`Decrease ${item.name}`} onClick={() => update(item.id, item.quantity - 1)}>-</button><span className="w-5 text-center">{item.quantity}</span><button aria-label={`Increase ${item.name}`} disabled={item.quantity >= item.available} onClick={() => update(item.id, item.quantity + 1)}>+</button><strong className="w-24 text-right">₹{(item.unitPrice * item.quantity).toFixed(2)}</strong><button className="text-sm underline" onClick={() => update(item.id, 0)}>Remove</button></div></article>)}</div>;
}