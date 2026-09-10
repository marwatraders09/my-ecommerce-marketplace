import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";

export async function requireSeller() {
  const session = await getSession();
  if (!session) return null;
  const seller = await prisma.seller.findUnique({ where: { userId: session.userId }, select: { id: true, storeName: true, status: true } });
  return seller ? { session, seller } : null;
}