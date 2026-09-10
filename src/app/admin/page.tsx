import { StorefrontHeader } from "@/components/storefront-header";
import { AdminReviewButton } from "@/components/admin-review-button";
import { requireRole } from "@/lib/auth/authorization";
import { prisma } from "@/lib/db/prisma";

export default async function AdminPage() {
  const admin = await requireRole(["ADMIN"]);
  if (!admin) return <main><div className="mx-auto max-w-4xl px-5 py-6 sm:px-10"><StorefrontHeader /><section className="py-20"><h1 className="text-4xl">Admin access required.</h1></section></div></main>;
  const [sellers, brands, products] = await Promise.all([
    prisma.seller.findMany({ where: { status: { in: ["PENDING", "UNDER_REVIEW"] } }, select: { id: true, storeName: true, businessName: true, status: true }, take: 20 }),
    prisma.brand.findMany({ where: { status: { in: ["PENDING", "UNDER_REVIEW"] } }, select: { id: true, name: true, category: true, status: true }, take: 20 }),
    prisma.product.findMany({ where: { status: "PENDING_REVIEW" }, select: { id: true, name: true, sku: true, status: true }, take: 20 }),
  ]);
  return <main><div className="mx-auto max-w-7xl px-5 py-6 sm:px-10"><StorefrontHeader /><section className="py-12"><p className="text-xs font-bold uppercase tracking-[.2em] text-[var(--coral)]">Platform control</p><h1 className="mt-3 text-5xl tracking-[-.04em]">Admin review.</h1><div className="mt-10 grid gap-4 sm:grid-cols-3"><div className="bg-[#f2d8c8] p-6"><p className="text-sm text-[var(--muted)]">Seller applications</p><p className="mt-3 text-4xl">{sellers.length}</p></div><div className="bg-[#e4dfc9] p-6"><p className="text-sm text-[var(--muted)]">Brand applications</p><p className="mt-3 text-4xl">{brands.length}</p></div><div className="bg-[#dce8d8] p-6"><p className="text-sm text-[var(--muted)]">Products to review</p><p className="mt-3 text-4xl">{products.length}</p></div></div><div className="mt-12 grid gap-10 lg:grid-cols-3">{[["Sellers", sellers, "sellers"], ["Brands", brands, "brands"], ["Products", products, "products"]].map(([title, records, type]) => <section key={title as string}><h2 className="border-b border-[var(--line)] pb-3 text-2xl">{title as string}</h2><div className="divide-y divide-[var(--line)]">{(records as Array<{ id: string; name?: string; storeName?: string; businessName?: string; category?: string; sku?: string }>).map((record) => <article className="py-5" key={record.id}><h3>{record.name || record.storeName}</h3><p className="mt-1 text-sm text-[var(--muted)]">{record.businessName || record.category || record.sku}</p><div className="mt-3"><AdminReviewButton type={type as "sellers" | "brands" | "products"} id={record.id} /></div></article>)}</div></section>)}</div></section></div></main>;
}