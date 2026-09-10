import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { z } from "zod";

const productSchema = z.object({ productId: z.string().uuid() });

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const wishlist = await prisma.wishlist.findUnique({ where: { userId: session.userId }, include: { items: { include: { product: { select: { id: true, name: true, slug: true, price: true, status: true } } } } } });
  return NextResponse.json({ items: wishlist?.items ?? [] });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const parsed = productSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid product" }, { status: 400 });
  const product = await prisma.product.findFirst({ where: { id: parsed.data.productId, status: "ACTIVE" }, select: { id: true } });
  if (!product) return NextResponse.json({ error: "Product unavailable" }, { status: 404 });
  const wishlist = await prisma.wishlist.upsert({ where: { userId: session.userId }, create: { userId: session.userId }, update: {} });
  await prisma.wishlistItem.upsert({ where: { wishlistId_productId: { wishlistId: wishlist.id, productId: product.id } }, create: { wishlistId: wishlist.id, productId: product.id }, update: {} });
  return NextResponse.json({ success: true }, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const parsed = productSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid product" }, { status: 400 });
  await prisma.wishlistItem.deleteMany({ where: { productId: parsed.data.productId, wishlist: { userId: session.userId } } });
  return NextResponse.json({ success: true });
}