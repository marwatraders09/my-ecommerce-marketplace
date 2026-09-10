import Link from "next/link";
import { StorefrontHeader } from "@/components/storefront-header";
import { BrandApplicationForm } from "@/components/brand-application-form";
import { getSession } from "@/lib/auth/session";
import { requireBrand } from "@/lib/auth/brand";

export default async function BrandPage() {
  const session = await getSession(); const application = session ? await requireBrand() : null;
  return <main><div className="mx-auto max-w-4xl px-5 py-6 sm:px-10"><StorefrontHeader /><section className="py-14"><p className="text-xs font-bold uppercase tracking-[.2em] text-[var(--coral)]">For original brands</p><h1 className="mt-3 max-w-2xl text-5xl tracking-[-.04em]">Give your work a wider shelf.</h1>{!session ? <p className="mt-8 text-[var(--muted)]">Sign in before starting a brand application.</p> : application ? <div className="mt-10 border-y border-[var(--line)] py-10"><h2 className="text-3xl">{application.brand.name}</h2><p className="mt-3 text-[var(--muted)]">Application status: {application.brand.status.toLowerCase().replace("_", " ")}</p><Link className="mt-6 inline-block underline" href="/brand/dashboard">Open brand workspace</Link></div> : <div className="mt-10"><BrandApplicationForm /></div>}</section></div></main>;
}