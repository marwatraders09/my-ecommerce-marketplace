import Link from "next/link";
import { StorefrontHeader } from "@/components/storefront-header";
import { requireBrand } from "@/lib/auth/brand";
import { prisma } from "@/lib/db/prisma";

export default async function BrandDashboardPage() {
  const access = await requireBrand();
  if (!access) return <main><div className="mx-auto max-w-4xl px-5 py-6 sm:px-10"><StorefrontHeader /><section className="py-20"><h1 className="text-4xl">Brand access required.</h1><Link className="mt-6 inline-block underline" href="/brand">Start an application</Link></section></div></main>;
  const products = await prisma.product.count({ where: { brandId: access.brand.id } });
  return <main><div className="mx-auto max-w-7xl px-5 py-6 sm:px-10"><StorefrontHeader /><section className="py-12"><p className="text-xs font-bold uppercase tracking-[.2em] text-[var(--coral)]">Brand workspace</p><h1 className="mt-3 text-5xl tracking-[-.04em]">{access.brand.name}.</h1><p className="mt-3 text-[var(--muted)]">Application: {access.brand.status.toLowerCase().replace("_", " ")}</p>{access.brand.status !== "APPROVED" && <div className="mt-10 border-l-4 border-[var(--coral)] bg-[#f2d8c8] p-5 text-sm">Verification is under review. Protected brand tools unlock after approval.</div>}<div className="mt-10 bg-[#dce8d8] p-6 sm:max-w-xs"><p className="text-sm text-[var(--muted)]">Brand products</p><p className="mt-3 text-4xl">{products}</p></div></section></div></main>;
}