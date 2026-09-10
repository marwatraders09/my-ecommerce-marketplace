import Link from "next/link";
import { StorefrontHeader } from "@/components/storefront-header";
import { AccountAuth, LogoutButton } from "@/components/account-auth";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export default async function AccountPage() {
  const session = await getSession();
  const user = session ? await prisma.user.findUnique({ where: { id: session.userId }, select: { name: true, email: true, role: true } }) : null;
  return <main><div className="mx-auto max-w-4xl px-5 py-6 sm:px-10"><StorefrontHeader /><section className="py-14"><p className="text-xs font-bold uppercase tracking-[.2em] text-[var(--coral)]">Your space</p>{user ? <><h1 className="mt-3 text-5xl tracking-[-.04em]">Hello, {user.name}.</h1><p className="mt-4 text-[var(--muted)]">{user.email} · {user.role.toLowerCase()}</p><div className="mt-10 grid gap-4 sm:grid-cols-2"><Link className="bg-[#dce8d8] p-6" href="/orders"><span className="text-xl">Orders</span><p className="mt-2 text-sm text-[var(--muted)]">Track purchases and returns.</p></Link><Link className="bg-[#e4dfc9] p-6" href="/wishlist"><span className="text-xl">Wishlist</span><p className="mt-2 text-sm text-[var(--muted)]">Keep your future finds close.</p></Link><Link className="bg-[#f2d8c8] p-6" href="/notifications"><span className="text-xl">Notifications</span><p className="mt-2 text-sm text-[var(--muted)]">Stay current on your marketplace activity.</p></Link><Link className="bg-[#dce8d8] p-6" href="/support"><span className="text-xl">Support</span><p className="mt-2 text-sm text-[var(--muted)]">Get help with an order or account.</p></Link></div><div className="mt-10"><LogoutButton /></div></> : <><h1 className="mt-3 text-5xl tracking-[-.04em]">Welcome back.</h1><p className="mt-4 mb-10 text-[var(--muted)]">Sign in to keep your orders, wishlist, and seller tools together.</p><AccountAuth /></>}</section></div></main>;
}