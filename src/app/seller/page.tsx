import Link from "next/link";
import { StorefrontHeader } from "@/components/storefront-header";
import { requireSeller } from "@/lib/auth/seller";
import { prisma } from "@/lib/db/prisma";

export default async function SellerPage() {
  const access = await requireSeller();
  if (!access) return <main><div className="mx-auto max-w-4xl px-5 py-6 sm:px-10"><StorefrontHeader /><section className="py-20"><h1 className="text-4xl">Seller access required.</h1><Link className="mt-6 inline-block underline" href="/sell">Start an application</Link></section></div></main>;
  const [products, orders] = await Promise.all([prisma.product.count({ where: { sellerId: access.seller.id } }), prisma.orderItem.count({ where: { sellerId: access.seller.id } })]);
  return <main><div className="mx-auto max-w-7xl px-5 py-6 sm:px-10"><StorefrontHeader /><section className="py-12"><p className="text-xs font-bold uppercase tracking-[.2em] text-[var(--coral)]">Seller workspace</p><div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><h1 className="text-5xl tracking-[-.04em]">{access.seller.storeName}.</h1><p className="mt-2 text-[var(--muted)]">Application: {access.seller.status.toLowerCase().replace("_", " ")}</p></div><Link className="rounded-full bg-[var(--leaf)] px-5 py-3 text-sm font-bold text-white" href="/sell">Store settings</Link></div>{access.seller.status !== "APPROVED" && <div className="mt-10 border-l-4 border-[var(--coral)] bg-[#f2d8c8] p-5 text-sm">Your application is under review. Product selling tools unlock after approval.</div>}<div className="mt-10 grid gap-4 sm:grid-cols-2"><div className="bg-[#dce8d8] p-6"><p className="text-sm text-[var(--muted)]">Products</p><p className="mt-3 text-4xl">{products}</p></div><div className="bg-[#e4dfc9] p-6"><p className="text-sm text-[var(--muted)]">Order items</p><p className="mt-3 text-4xl">{orders}</p></div></div></section></div></main>;
}