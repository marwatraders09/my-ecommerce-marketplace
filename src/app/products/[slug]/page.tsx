import { notFound } from "next/navigation";
import { StorefrontHeader } from "@/components/storefront-header";
import { getProductBySlug } from "@/lib/catalog/products";
import { ProductActions } from "@/components/product-actions";
import { ProductReviews } from "@/components/product-reviews";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = await getProductBySlug((await params).slug);
  if (!product) notFound();
  return <main><div className="mx-auto max-w-7xl px-5 py-6 sm:px-10"><StorefrontHeader /><div className="grid gap-10 py-12 md:grid-cols-2"><div className="flex aspect-square items-center justify-center bg-[#dce8d8]"><span className="text-5xl font-bold tracking-widest text-[var(--leaf)] opacity-70">NOURA</span></div><div className="flex flex-col justify-center"><p className="text-xs font-bold uppercase tracking-[.2em] text-[var(--coral)]">{product.category.name}</p><h1 className="mt-4 text-5xl leading-none tracking-[-.04em]">{product.name}</h1><p className="mt-4 text-sm text-[var(--muted)]">Made by {product.seller.storeName}</p><p className="mt-8 text-2xl font-bold">₹{String(product.price)}</p><p className="mt-6 max-w-lg leading-7 text-[var(--muted)]">{product.description}</p><ProductActions productId={product.id} /><div className="mt-10 border-t border-[var(--line)] pt-5"><h2 className="text-sm font-bold uppercase tracking-[.15em]">Details</h2><dl className="mt-4 space-y-2 text-sm">{product.attributes.map((attribute) => <div className="flex justify-between border-b border-[var(--line)] py-2" key={attribute.id}><dt className="text-[var(--muted)]">{attribute.name}</dt><dd>{attribute.value}</dd></div>)}</dl></div></div></div><ProductReviews productId={product.id} reviews={product.reviews} /></div></main>;
}