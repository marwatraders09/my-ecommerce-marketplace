import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/authorization";
import { refundSchema } from "@/lib/validation/post-purchase";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireRole(["ADMIN"]);
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const parsed = refundSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid refund details" }, { status: 400 });
  const orderId = (await params).id;
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { payment: true, refunds: true } });
  if (!order || !order.payment) return NextResponse.json({ error: "Paid order not found" }, { status: 404 });
  const refunded = order.refunds.reduce((sum, refund) => sum + Number(refund.amount), 0);
  if (refunded + parsed.data.amount > Number(order.payment.amount)) return NextResponse.json({ error: "Refund exceeds captured payment" }, { status: 409 });
  const full = refunded + parsed.data.amount === Number(order.payment.amount);
  const result = await prisma.$transaction(async (transaction) => {
    const refund = await transaction.refund.create({ data: { orderId, paymentId: order.payment!.id, amount: parsed.data.amount, reason: parsed.data.reason } });
    await transaction.payment.update({ where: { id: order.payment!.id }, data: { status: full ? "REFUNDED" : "PARTIALLY_REFUNDED" } });
    await transaction.order.update({ where: { id: orderId }, data: { status: full ? "REFUNDED" : "REFUND_PENDING" } });
    await transaction.auditLog.create({ data: { actorId: admin.userId, action: "order.refund", entity: "Order", entityId: orderId, metadata: { amount: parsed.data.amount, reason: parsed.data.reason } } });
    return refund;
  });
  return NextResponse.json({ refund: { id: result.id, amount: String(result.amount) } }, { status: 201 });
}