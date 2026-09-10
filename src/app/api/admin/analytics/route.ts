import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/authorization";

export async function GET() {
  const admin = await requireRole(["ADMIN"]);
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const [orders, customers, sellers, brands, products, refunds] = await Promise.all([
    prisma.order.aggregate({ _count: { id: true }, _sum: { total: true } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.seller.count(), prisma.brand.count(), prisma.product.count(),
    prisma.refund.aggregate({ _sum: { amount: true } }),
  ]);
  return NextResponse.json({ grossSales: String(orders._sum.total ?? 0), orders: orders._count.id, customers, sellers, brands, products, refunds: String(refunds._sum.amount ?? 0) });
}
