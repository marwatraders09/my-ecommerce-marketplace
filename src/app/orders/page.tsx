import Link from "next/link";
import { StorefrontHeader } from "@/components/storefront-header";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export default async function OrdersPage() {
  const session = await getSession();
  const orders = session ? await prisma.order.findMany({ where: { userId: session.userId }, orderBy: { createdAt: "desc" }, take: 50, include: { items: { take: 1, include: { product: { select: { name: true } } } } } }) : [];
  return <main><div className="mx-auto max-w-4xl px-5 py-6 sm:px-10"><StorefrontHeader /><section className="py-14"><p className="text-xs font-bold uppercase tracking-[.2em] text-[var(--coral)]">Your history</p><h1 className="mt-3 text-5xl tracking-[-.04em]">Orders.</h1>{!session ? <p className="mt-10 text-[var(--muted)]">Sign in to see your orders.</p> : orders.length ? <div className="mt-10 divide-y divide-[var(--line)]">{orders.map((order) => <Link className="flex items-center justify-between gap-5 py-5" href={`/orders/${order.id}`} key={order.id}><div><h2>{order.items[0]?.product.name || "Marketplace order"}</h2><p className="mt-1 text-sm text-[var(--muted)]">{order.id.slice(0, 8)} · {order.status.toLowerCase().replaceAll("_", " ")}</p></div><strong>₹{String(order.total)}</strong></Link>)}</div> : <p className="mt-10 text-[var(--muted)]">No orders yet. <Link className="underline" href="/products">Start discovering</Link></p>}</section></div></main>;
}