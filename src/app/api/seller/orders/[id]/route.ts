import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireSeller } from "@/lib/auth/seller";
import { orderStatusSchema } from "@/lib/validation/post-purchase";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const access = await requireSeller();
  if (!access || access.seller.status !== "APPROVED") return NextResponse.json({ error: "Approved seller access required" }, { status: 403 });
  const parsed = orderStatusSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
  const orderId = (await params).id;
  const item = await prisma.orderItem.findFirst({ where: { orderId, sellerId: access.seller.id }, select: { id: true } });
  if (!item) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  const order = await prisma.order.update({ where: { id: orderId }, data: { status: parsed.data.status }, select: { id: true, status: true } });
  return NextResponse.json({ order });
}