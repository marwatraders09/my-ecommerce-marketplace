import { StorefrontHeader } from "@/components/storefront-header";
import { SupportTicketForm } from "@/components/support-ticket-form";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export default async function SupportPage() {
  const session = await getSession();
  const tickets = session ? await prisma.supportTicket.findMany({ where: { userId: session.userId }, orderBy: { createdAt: "desc" }, include: { messages: { orderBy: { createdAt: "asc" } } } }) : [];
  return <main><div className="mx-auto max-w-4xl px-5 py-6 sm:px-10"><StorefrontHeader /><section className="grid gap-12 py-14 md:grid-cols-[.8fr_1.2fr]"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[var(--coral)]">Care, when needed</p><h1 className="mt-3 text-5xl tracking-[-.04em]">Support.</h1><p className="mt-5 text-[var(--muted)]">Questions about an order, return, or account belong here.</p></div>{session ? <SupportTicketForm /> : <p className="text-[var(--muted)]">Sign in to contact support.</p>}</section>{session && <section className="border-t border-[var(--line)] py-10"><h2 className="text-2xl">Your tickets</h2>{tickets.length ? <div className="mt-5 divide-y divide-[var(--line)]">{tickets.map((ticket) => <article className="py-5" key={ticket.id}><div className="flex justify-between gap-4"><h3>{ticket.subject}</h3><span className="text-sm text-[var(--muted)]">{ticket.status.replaceAll("_", " ")}</span></div>{ticket.messages.map((message) => <p className="mt-3 text-sm text-[var(--muted)]" key={message.id}>{message.body}</p>)}</article>)}</div> : <p className="mt-4 text-sm text-[var(--muted)]">No tickets yet.</p>}</section>}</div></main>;
}