import Link from "next/link";
import { StorefrontHeader } from "@/components/storefront-header";
import { SellerApplicationForm } from "@/components/seller-application-form";
import { getSession } from "@/lib/auth/session";
import { requireSeller } from "@/lib/auth/seller";

export default async function SellPage() {
  const session = await getSession();
  const application = session ? await requireSeller() : null;
  return <main><div className="mx-auto max-w-4xl px-5 py-6 sm:px-10"><StorefrontHeader /><section className="py-14"><p className="text-xs font-bold uppercase tracking-[.2em] text-[var(--coral)]">For independent sellers</p><h1 className="mt-3 max-w-2xl text-5xl tracking-[-.04em]">Make room for your point of view.</h1>{!session ? <p className="mt-8 text-[var(--muted)]">Sign in before starting a seller application.</p> : application ? <div className="mt-10 border-y border-[var(--line)] py-10"><h2 className="text-3xl">{application.seller.storeName}</h2><p className="mt-3 text-[var(--muted)]">Application status: {application.seller.status.toLowerCase().replace("_", " ")}</p><Link className="mt-6 inline-block underline" href="/seller">Open seller workspace</Link></div> : <div className="mt-10"><SellerApplicationForm /></div>}</section></div></main>;
}