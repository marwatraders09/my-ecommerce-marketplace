import { StorefrontHeader } from "@/components/storefront-header";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export default async function NotificationsPage() {
  const session = await getSession();
  const notifications = session ? await prisma.notification.findMany({ where: { userId: session.userId }, orderBy: { createdAt: "desc" }, take: 50 }) : [];
  return <main><div className="mx-auto max-w-4xl px-5 py-6 sm:px-10"><StorefrontHeader /><section className="py-14"><p className="text-xs font-bold uppercase tracking-[.2em] text-[var(--coral)]">Updates</p><h1 className="mt-3 text-5xl tracking-[-.04em]">Notifications.</h1>{!session ? <p className="mt-10 text-[var(--muted)]">Sign in to see your notifications.</p> : notifications.length ? <div className="mt-10 divide-y divide-[var(--line)]">{notifications.map((notification) => <article className={`py-5 ${notification.readAt ? "opacity-60" : ""}`} key={notification.id}><h2>{notification.title}</h2><p className="mt-1 text-sm text-[var(--muted)]">{notification.body}</p></article>)}</div> : <p className="mt-10 text-[var(--muted)]">You are all caught up.</p>}</section></div></main>;
}