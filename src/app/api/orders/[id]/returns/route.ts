import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { returnSchema } from "@/lib/validation/post-purchase";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const parsed = returnSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid return details" }, { status: 400 });
  const orderId = (await params).id;
  const order = await prisma.order.findFirst({ where: { id: orderId, userId: session.userId }, select: { id: true, status: true } });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (!["DELIVERED", "SHIPPED"].includes(order.status)) return NextResponse.json({ error: "This order is not eligible for return" }, { status: 409 });
  const existing = await prisma.return.findFirst({ where: { orderId, status: { notIn: ["REJECTED", "CLOSED"] } } });
  if (existing) return NextResponse.json({ error: "A return is already open" }, { status: 409 });
  const result = await prisma.$transaction(async (transaction) => {
    const created = await transaction.return.create({ data: { orderId, ...parsed.data } });
    await transaction.order.update({ where: { id: orderId }, data: { status: "RETURN_REQUESTED" } });
    return created;
  });
  return NextResponse.json({ return: { id: result.id, status: result.status } }, { status: 201 });
}