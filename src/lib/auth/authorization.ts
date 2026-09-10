import type { UserRole } from "@prisma/client";
import { getSession } from "./session";

export async function requireRole(roles: UserRole[]) {
  const session = await getSession();
  if (!session || !roles.includes(session.role)) return null;
  return session;
}