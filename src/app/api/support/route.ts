import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { ticketSchema } from "@/lib/validation/support";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const tickets = await prisma.supportTicket.findMany({ where: { userId: session.userId }, orderBy: { createdAt: "desc" }, include: { messages: { orderBy: { createdAt: "asc" } } } });
  return NextResponse.json({ tickets });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const parsed = ticketSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid ticket" }, { status: 400 });
  const ticket = await prisma.supportTicket.create({ data: { userId: session.userId, subject: parsed.data.subject, messages: { create: { body: parsed.data.body } } }, include: { messages: true } });
  return NextResponse.json({ ticket }, { status: 201 });
}