import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { supportMessageSchema } from "@/lib/validation/support";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const parsed = supportMessageSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  const ticketId = (await params).id;
  const ticket = await prisma.supportTicket.findFirst({ where: { id: ticketId, userId: session.userId }, select: { id: true, status: true } });
  if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  const message = await prisma.supportMessage.create({ data: { ticketId, body: parsed.data.body } });
  await prisma.supportTicket.update({ where: { id: ticketId }, data: { status: "OPEN" } });
  return NextResponse.json({ message }, { status: 201 });
}