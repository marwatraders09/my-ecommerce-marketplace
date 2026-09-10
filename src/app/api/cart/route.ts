import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { getCart, getOrCreateCart } from "@/lib/cart/cart";
import { addCartItemSchema, removeCartItemSchema, updateCartItemSchema } from "@/lib/validation/cart";

async function authenticatedUser() {
  const session = await getSession();
  return session?.userId ?? null;
}

export async function GET() {
  const userId = await authenticatedUser();
  if (!userId) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  return NextResponse.json(await getCart(userId));
}

export async function POST(request: Request) {
  const userId = await authenticatedUser();
  if (!userId) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const parsed = addCartItemSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid cart item" }, { status: 400 });
  const product = await prisma.product.findFirst({ where: { id: parsed.data.productId, status: "ACTIVE" }, include: { inventory: true } });
  if (!product) return NextResponse.json({ error: "Product unavailable" }, { status: 404 });
  const available = product.inventory ? product.inventory.quantity - product.inventory.reserved : 0;
  const cart = await getOrCreateCart(userId);
  const current = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId: product.id, variantId: null } });
  const quantity = (current?.quantity ?? 0) + parsed.data.quantity;
  if (quantity > available) return NextResponse.json({ error: "Not enough stock" }, { status: 409 });
  if (current) await prisma.cartItem.update({ where: { id: current.id }, data: { quantity } });
  else await prisma.cartItem.create({ data: { cartId: cart.id, productId: product.id, quantity } });
  return NextResponse.json(await getCart(userId), { status: 201 });
}

export async function PATCH(request: Request) {
  const userId = await authenticatedUser();
  if (!userId) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const parsed = updateCartItemSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid cart item" }, { status: 400 });
  const item = await prisma.cartItem.findFirst({ where: { id: parsed.data.itemId, cart: { userId } }, include: { product: { include: { inventory: true } } } });
  if (!item) return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
  const available = item.product.inventory ? item.product.inventory.quantity - item.product.inventory.reserved : 0;
  if (parsed.data.quantity > available) return NextResponse.json({ error: "Not enough stock" }, { status: 409 });
  if (parsed.data.quantity === 0) await prisma.cartItem.delete({ where: { id: item.id } });
  else await prisma.cartItem.update({ where: { id: item.id }, data: { quantity: parsed.data.quantity } });
  return NextResponse.json(await getCart(userId));
}

export async function DELETE(request: Request) {
  const userId = await authenticatedUser();
  if (!userId) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const parsed = removeCartItemSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid cart item" }, { status: 400 });
  await prisma.cartItem.deleteMany({ where: { id: parsed.data.itemId, cart: { userId } } });
  return NextResponse.json(await getCart(userId));
}