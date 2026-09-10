import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/authorization";
import { approvalActionSchema } from "@/lib/validation/admin";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireRole(["ADMIN"]);
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const parsed = approvalActionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid approval status" }, { status: 400 });
  const id = (await params).id;
  const seller = await prisma.seller.findUnique({ where: { id }, select: { id: true, userId: true, status: true } });
  if (!seller) return NextResponse.json({ error: "Seller not found" }, { status: 404 });
  const updated = await prisma.$transaction(async (transaction) => {
    const result = await transaction.seller.update({ where: { id }, data: { status: parsed.data.status } });
    await transaction.user.update({ where: { id: seller.userId }, data: { role: parsed.data.status === "APPROVED" ? "SELLER" : "CUSTOMER" } });
    await transaction.auditLog.create({ data: { actorId: admin.userId, action: `seller.${parsed.data.status.toLowerCase()}`, entity: "Seller", entityId: id, metadata: { previousStatus: seller.status, nextStatus: parsed.data.status } } });
    return result;
  });
  return NextResponse.json({ seller: { id: updated.id, status: updated.status } });
}