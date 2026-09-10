import Link from "next/link";
import { StorefrontHeader } from "@/components/storefront-header";
import { requireRole } from "@/lib/auth/authorization";
import { prisma } from "@/lib/db/prisma";

export default async function AdminAnalyticsPage() {
  const admin = await requireRole(["ADMIN"]);
  if (!admin) return <main><div className="mx-auto max-w-4xl px-5 py-6 sm:px-10"><StorefrontHeader /><h1 className="py-20 text-4xl">Admin access required.</h1></div></main>;
  const [orders, customers, sellers, brands, products, refunds] = await Promise.all([prisma.order.aggregate({ _count: { id: true }, _sum: { total: true } }), prisma.user.count({ where: { role: "CUSTOMER" } }), prisma.seller.count(), prisma.brand.count(), prisma.product.count(), prisma.refund.aggregate({ _sum: { amount: true } })]);
  const cards = [["Gross sales", `₹${String(orders._sum.total ?? 0)}`, "bg-[#dce8d8]"], ["Orders", orders._count.id, "bg-[#e4dfc9]"], ["Customers", customers, "bg-[#f2d8c8]"], ["Sellers", sellers, "bg-[#dce8d8]"], ["Brands", brands, "bg-[#e4dfc9]"], ["Products", products, "bg-[#f2d8c8]"], ["Refunds", `₹${String(refunds._sum.amount ?? 0)}`, "bg-[#e4dfc9]"]];
  return <main><div className="mx-auto max-w-7xl px-5 py-6 sm:px-10"><StorefrontHeader /><section className="py-12"><Link className="text-sm underline" href="/admin">Back to review</Link><p className="mt-10 text-xs font-bold uppercase tracking-[.2em] text-[var(--coral)]">Platform intelligence</p><h1 className="mt-3 text-5xl tracking-[-.04em]">Analytics.</h1><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map(([label, value, color]) => <div className={`${color} p-6`} key={label as string}><p className="text-sm text-[var(--muted)]">{label}</p><p className="mt-3 text-4xl">{value}</p></div>)}</div></section></div></main>;
}
