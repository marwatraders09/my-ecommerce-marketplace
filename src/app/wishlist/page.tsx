import Link from "next/link";
import { StorefrontHeader } from "@/components/storefront-header";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export default async function WishlistPage() {
  const session = await getSession();
  const wishlist = session ? await prisma.wishlist.findUnique({ where: { userId: session.userId }, include: { items: { include: { product: { select: { id: true, name: true, slug: true, price: true } } } } } }) : null;
  const items = wishlist?.items ?? [];
  return <main><div className="mx-auto max-w-7xl px-5 py-6 sm:px-10"><StorefrontHeader /><section className="py-14"><p className="text-xs font-bold uppercase tracking-[.2em] text-[var(--coral)]">Saved for later</p><h1 className="mt-3 text-5xl tracking-[-.04em]">Your wishlist.</h1>{!session ? <p className="mt-10 text-[var(--muted)]">Sign in to keep track of the pieces you love.</p> : items.length ? <div className="mt-10 grid gap-5 sm:grid-cols-3">{items.map(({ product }) => <Link href={`/products/${product.slug}`} key={product.id}><div className="flex aspect-[4/5] items-center justify-center bg-[#dce8d8]"><span className="text-3xl font-bold tracking-widest text-[var(--leaf)] opacity-70">NOURA</span></div><div className="flex justify-between pt-4"><h2>{product.name}</h2><strong>₹{String(product.price)}</strong></div></Link>)}</div> : <p className="mt-10 text-[var(--muted)]">Nothing saved yet. The good things are out there.</p>}</section></div></main>;
}