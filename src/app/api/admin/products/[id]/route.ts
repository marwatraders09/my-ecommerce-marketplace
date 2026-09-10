import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/authorization";
import { productActionSchema } from "@/lib/validation/admin";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireRole(["ADMIN"]);
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const parsed = productActionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid product status" }, { status: 400 });
  const id = (await params).id;
  const product = await prisma.product.findUnique({ where: { id }, select: { id: true, status: true } });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  const updated = await prisma.$transaction(async (transaction) => {
    const result = await transaction.product.update({ where: { id }, data: { status: parsed.data.status } });
    await transaction.auditLog.create({ data: { actorId: admin.userId, action: `product.${parsed.data.status.toLowerCase()}`, entity: "Product", entityId: id, metadata: { previousStatus: product.status, nextStatus: parsed.data.status } } });
    return result;
  });
  return NextResponse.json({ product: { id: updated.id, status: updated.status } });
}