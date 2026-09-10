import Link from "next/link";
import { StorefrontHeader } from "@/components/storefront-header";
import { CheckoutForm } from "@/components/checkout-form";
import { getSession } from "@/lib/auth/session";
import { getCart } from "@/lib/cart/cart";

export default async function CheckoutPage() {
  const session = await getSession(); const cart = session ? await getCart(session.userId) : null;
  return <main><div className="mx-auto max-w-4xl px-5 py-6 sm:px-10"><StorefrontHeader /><section className="grid gap-12 py-14 md:grid-cols-[1fr_.7fr]"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[var(--coral)]">Checkout</p><h1 className="mt-3 text-5xl tracking-[-.04em]">Almost yours.</h1>{!session ? <p className="mt-8 text-[var(--muted)]">Sign in to continue.</p> : cart?.items.length ? <div className="mt-10"><CheckoutForm /></div> : <p className="mt-8 text-[var(--muted)]">Your bag is empty. <Link className="underline" href="/products">Keep discovering</Link></p>}</div>{cart?.items.length ? <aside className="h-fit bg-[#e4dfc9] p-6"><h2 className="text-xl">Order summary</h2><div className="mt-5 space-y-3 text-sm">{cart.items.map((item) => <div className="flex justify-between gap-3" key={item.id}><span>{item.name} × {item.quantity}</span><span>₹{(item.unitPrice * item.quantity).toFixed(2)}</span></div>)}</div><div className="mt-6 border-t border-[var(--line)] pt-4 font-bold">Subtotal ₹{cart.subtotal.toFixed(2)}</div></aside> : null}</section></div></main>;
}