import { ProductStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export type ProductCard = {
  id: string;
  slug: string;
  name: string;
  price: string;
  listPrice: string | null;
  seller: string;
  category: string;
};

function toCard(product: { id: string; slug: string; name: string; price: unknown; listPrice: unknown; seller: { storeName: string }; category: { name: string } }): ProductCard {
  return { id: product.id, slug: product.slug, name: product.name, price: String(product.price), listPrice: product.listPrice ? String(product.listPrice) : null, seller: product.seller.storeName, category: product.category.name };
}

export async function searchProducts(input: { query?: string; category?: string; page?: number; pageSize?: number; sort?: string }) {
  const page = Math.max(1, input.page ?? 1);
  const pageSize = Math.min(48, Math.max(1, input.pageSize ?? 12));
  const query = input.query?.trim();
  const where = {
    status: ProductStatus.ACTIVE,
    ...(input.category ? { category: { slug: input.category } } : {}),
    ...(query ? { OR: [{ name: { contains: query, mode: "insensitive" as const } }, { description: { contains: query, mode: "insensitive" as const } }, { sku: { contains: query, mode: "insensitive" as const } }] } : {}),
  };
  const orderBy = input.sort === "price-asc" ? { price: "asc" as const } : input.sort === "price-desc" ? { price: "desc" as const } : { createdAt: "desc" as const };
  try {
    const [items, total] = await prisma.$transaction([
      prisma.product.findMany({ where, orderBy, skip: (page - 1) * pageSize, take: pageSize, select: { id: true, slug: true, name: true, price: true, listPrice: true, seller: { select: { storeName: true } }, category: { select: { name: true } } } }),
      prisma.product.count({ where }),
    ]);
    return { items: items.map(toCard), total, page, pageSize };
  } catch {
    return { items: [], total: 0, page, pageSize };
  }
}

export async function getProductBySlug(slug: string) {
  try {
    return await prisma.product.findFirst({ where: { slug, status: ProductStatus.ACTIVE }, include: { images: true, variants: { include: { inventory: true } }, attributes: true, seller: true, brand: true, category: true, reviews: { where: { approved: true }, orderBy: { createdAt: "desc" }, take: 10, select: { rating: true, title: true, body: true, verifiedPurchase: true } } } });
  } catch {
    return null;
  }
}