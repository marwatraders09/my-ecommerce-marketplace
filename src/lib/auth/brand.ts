import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";

export async function requireBrand() {
  const session = await getSession();
  if (!session) return null;
  const brand = await prisma.brand.findUnique({ where: { userId: session.userId }, select: { id: true, name: true, status: true } });
  return brand ? { session, brand } : null;
}