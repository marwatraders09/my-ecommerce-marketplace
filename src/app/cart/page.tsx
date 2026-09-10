import Link from "next/link";
import { StorefrontHeader } from "@/components/storefront-header";
import { CartList } from "@/components/cart-list";
import { getSession } from "@/lib/auth/session";
import { getCart } from "@/lib/cart/cart";

export default async function CartPage() {
  const session = await getSession();
  const cart = session ? await getCart(session.userId) : null;
  return <main><div className="mx-auto max-w-4xl px-5 py-6 sm:px-10"><StorefrontHeader /><section className="py-14"><p className="text-xs font-bold uppercase tracking-[.2em] text-[var(--coral)]">Your picks</p><h1 className="mt-3 text-5xl tracking-[-.04em]">The bag.</h1>{!session ? <div className="mt-10 border-y border-[var(--line)] py-16 text-center"><h2 className="text-3xl">Sign in to see your bag.</h2><Link className="mt-6 inline-block rounded-full bg-[var(--leaf)] px-6 py-3 text-sm font-bold text-white" href="/account">Go to account</Link></div> : cart && cart.items.length ? <><CartList initialItems={cart.items} /><div className="flex flex-col items-end gap-4 pt-8"><div className="text-xl font-bold">Subtotal: ₹{cart.subtotal.toFixed(2)}</div><Link className="rounded-full bg-[var(--leaf)] px-6 py-3 text-sm font-bold text-white" href="/checkout">Continue to checkout</Link></div></> : <div className="mt-10 border-y border-[var(--line)] py-16 text-center"><h2 className="text-3xl">Your bag is waiting.</h2><Link className="mt-6 inline-block underline" href="/products">Continue discovering</Link></div>}</section></div></main>;
}