import { prisma } from "@/lib/db/prisma";

export async function getCart(userId: string) {
  const cart = await prisma.cart.findUnique({ where: { userId }, include: { items: { include: { product: { include: { seller: true, inventory: true } } } } } });
  if (!cart) return { id: null, items: [], subtotal: 0 };
  const items = cart.items.map((item) => ({ id: item.id, productId: item.productId, quantity: item.quantity, name: item.product.name, slug: item.product.slug, seller: item.product.seller.storeName, unitPrice: Number(item.product.price), available: item.product.inventory ? item.product.inventory.quantity - item.product.inventory.reserved : 0 }));
  return { id: cart.id, items, subtotal: items.reduce((total, item) => total + item.unitPrice * item.quantity, 0) };
}

export async function getOrCreateCart(userId: string) {
  return prisma.cart.upsert({ where: { userId }, create: { userId }, update: {} });
}