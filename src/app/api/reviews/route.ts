import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { reviewSchema } from "@/lib/validation/engagement";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const parsed = reviewSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid review" }, { status: 400 });
  const purchase = await prisma.orderItem.findFirst({ where: { productId: parsed.data.productId, order: { userId: session.userId, status: { in: ["DELIVERED", "RETURNED"] } } }, select: { id: true } });
  if (!purchase) return NextResponse.json({ error: "Only customers who purchased this product can review it" }, { status: 403 });
  const existing = await prisma.review.findUnique({ where: { productId_userId: { productId: parsed.data.productId, userId: session.userId } }, select: { id: true } });
  if (existing) return NextResponse.json({ error: "You already reviewed this product" }, { status: 409 });
  const review = await prisma.review.create({ data: { ...parsed.data, userId: session.userId, approved: false, verifiedPurchase: true }, select: { id: true, approved: true } });
  return NextResponse.json({ review }, { status: 201 });
}