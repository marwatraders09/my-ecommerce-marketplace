import Link from "next/link";

export function StorefrontHeader() {
  return <header className="flex items-center justify-between border-b border-[var(--line)] pb-5"><Link className="text-2xl font-bold text-[var(--leaf)]" href="/">noura<span className="text-[var(--coral)]">.</span></Link><nav className="hidden gap-8 text-sm md:flex" aria-label="Primary navigation"><Link href="/products">Discover</Link><Link href="/#collections">Collections</Link><Link href="/#makers">Makers</Link></nav><div className="flex gap-4 text-sm"><Link href="/products">Search</Link><Link href="/account">Account</Link><Link href="/cart">Bag (0)</Link></div></header>;
}