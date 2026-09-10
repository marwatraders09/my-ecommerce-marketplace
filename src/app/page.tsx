import Link from "next/link";

const collections = [
  { label: "Home rituals", detail: "Objects with a slower point of view", color: "bg-[#dce8d8]" },
  { label: "Wear + carry", detail: "Made to travel well", color: "bg-[#f2d8c8]" },
  { label: "Good provisions", detail: "Small luxuries for daily life", color: "bg-[#e4dfc9]" },
];
const products = [
  { name: "Mori ceramic pour-over", maker: "Atelier Kanso", price: "₹2,480", color: "bg-[#d8e4df]", mark: "MORI" },
  { name: "Linen market tote", maker: "Common Thread", price: "₹1,250", color: "bg-[#ead9c9]", mark: "CT" },
  { name: "Saffron candle, 180g", maker: "House of Nara", price: "₹890", color: "bg-[#dedfc3]", mark: "NARA" },
];

export default function Home() {
  return <main><div className="mx-auto max-w-7xl px-5 py-6 sm:px-10">
    <header className="flex items-center justify-between border-b border-[var(--line)] pb-5">
      <a className="text-2xl font-bold text-[var(--leaf)]" href="#top">noura<span className="text-[var(--coral)]">.</span></a>
      <nav className="hidden gap-8 text-sm md:flex" aria-label="Primary navigation"><a href="#discover">Discover</a><a href="#collections">Collections</a><a href="#makers">Makers</a></nav>
      <div className="flex gap-4 text-sm"><button aria-label="Search">Search</button><button aria-label="Open account">Account</button><button aria-label="Open cart">Bag (0)</button></div>
    </header>
    <section id="top" className="grid gap-10 py-16 md:grid-cols-[1.15fr_.85fr] md:items-end md:py-24"><div><p className="mb-6 text-xs font-bold uppercase tracking-[.22em] text-[var(--coral)]">A marketplace with a point of view</p><h1 className="max-w-3xl text-6xl leading-[.94] tracking-[-.04em] sm:text-8xl">Find the good stuff.</h1></div><div className="max-w-sm justify-self-end"><p className="text-lg leading-7 text-[var(--muted)]">Thoughtful goods from independent makers, emerging brands, and the people who know them best.</p><Link className="mt-8 inline-block rounded-full bg-[var(--leaf)] px-6 py-3 text-sm font-bold text-white hover:bg-[var(--coral)]" href="/products">Start exploring <span aria-hidden="true">↗</span></Link></div></section>
    <section id="collections" className="border-t border-[var(--line)] py-12"><div className="mb-7 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--muted)]">Browse by feeling</p><h2 className="mt-2 text-3xl">Your next favorite corner.</h2></div><a className="text-sm underline" href="#discover">View all</a></div><div className="grid gap-4 md:grid-cols-3">{collections.map((collection, index) => <article className={`${collection.color} min-h-64 p-6 transition hover:-translate-y-1`} key={collection.label}><div className="flex h-full flex-col justify-between"><span className="text-xs uppercase tracking-[.15em]">Collection 0{index + 1}</span><div><h3 className="text-2xl">{collection.label}</h3><p className="mt-2 max-w-48 text-sm text-[var(--muted)]">{collection.detail}</p></div></div></article>)}</div></section>
    <section id="discover" className="border-t border-[var(--line)] py-12"><div className="mb-7 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--muted)]">Curated today</p><h2 className="mt-2 text-3xl">Objects worth knowing.</h2></div><a className="text-sm underline" href="#makers">Meet the makers</a></div><div className="grid gap-5 sm:grid-cols-3">{products.map((product) => <article key={product.name}><div className={`${product.color} flex aspect-[4/5] items-center justify-center`}><span className="text-4xl font-bold tracking-widest text-[var(--leaf)] opacity-70">{product.mark}</span></div><div className="flex justify-between gap-3 pt-4"><div><h3 className="text-lg">{product.name}</h3><p className="mt-1 text-sm text-[var(--muted)]">{product.maker}</p></div><p className="text-sm font-bold">{product.price}</p></div></article>)}</div></section>
    <footer id="makers" className="flex flex-col gap-4 border-t border-[var(--line)] py-8 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between"><span className="font-bold text-[var(--leaf)]">noura.</span><span>Independent commerce, thoughtfully arranged.</span><span>© 2026 Noura Market</span></footer>
  </div></main>;
}