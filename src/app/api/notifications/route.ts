import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { notificationReadSchema } from "@/lib/validation/engagement";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const notifications = await prisma.notification.findMany({ where: { userId: session.userId }, orderBy: { createdAt: "desc" }, take: 50 });
  return NextResponse.json({ notifications });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const parsed = notificationReadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid notification" }, { status: 400 });
  await prisma.notification.updateMany({ where: { id: parsed.data.notificationId, userId: session.userId }, data: { readAt: new Date() } });
  return NextResponse.json({ success: true });
}