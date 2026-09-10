import Link from "next/link";
import { StorefrontHeader } from "@/components/storefront-header";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { ReturnRequestForm } from "@/components/return-request-form";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession(); const id = (await params).id;
  const order = session ? await prisma.order.findFirst({ where: { id, userId: session.userId }, include: { items: { include: { product: { select: { name: true } } } }, payment: true } }) : null;
  if (!order) return <main><div className="mx-auto max-w-4xl px-5 py-6 sm:px-10"><StorefrontHeader /><section className="py-20"><h1 className="text-4xl">Order not found.</h1><Link className="mt-6 inline-block underline" href="/products">Continue shopping</Link></section></div></main>;
  return <main><div className="mx-auto max-w-4xl px-5 py-6 sm:px-10"><StorefrontHeader /><section className="py-14"><p className="text-xs font-bold uppercase tracking-[.2em] text-[var(--coral)]">Order status</p><h1 className="mt-3 text-5xl tracking-[-.04em]">Your order.</h1><p className="mt-4 text-[var(--muted)]">Reference: {order.id} · {order.status.toLowerCase().replaceAll("_", " ")}</p><div className="mt-10 space-y-4 border-y border-[var(--line)] py-6">{order.items.map((item) => <div className="flex justify-between" key={item.id}><span>{item.product.name} × {item.quantity}</span><span>₹{String(item.total)}</span></div>)}<div className="flex justify-between border-t border-[var(--line)] pt-4 font-bold"><span>Total</span><span>₹{String(order.total)}</span></div></div><p className="mt-6 text-sm text-[var(--muted)]">Payment: {order.payment?.method === "COD" ? "Cash on delivery" : order.payment?.status}</p><ReturnRequestForm orderId={order.id} /><Link className="mt-8 inline-block rounded-full bg-[var(--leaf)] px-6 py-3 text-sm font-bold text-white" href="/products">Continue discovering</Link></section></div></main>;
}