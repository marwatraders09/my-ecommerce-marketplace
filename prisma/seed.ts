import { PrismaClient, ApprovalStatus, ProductStatus, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("NouraDev!2026Password", 12);
  const admin = await prisma.user.upsert({ where: { email: "admin@noura.test" }, update: {}, create: { email: "admin@noura.test", name: "Noura Admin", password, role: UserRole.ADMIN } });
  const sellerUser = await prisma.user.upsert({ where: { email: "seller@noura.test" }, update: {}, create: { email: "seller@noura.test", name: "Demo Seller", password, role: UserRole.SELLER } });
  const brandUser = await prisma.user.upsert({ where: { email: "brand@noura.test" }, update: {}, create: { email: "brand@noura.test", name: "Demo Brand", password, role: UserRole.BRAND } });
  await prisma.user.upsert({ where: { email: "customer@noura.test" }, update: {}, create: { email: "customer@noura.test", name: "Demo Customer", password, role: UserRole.CUSTOMER } });

  const seller = await prisma.seller.upsert({ where: { userId: sellerUser.id }, update: { status: ApprovalStatus.APPROVED }, create: { userId: sellerUser.id, storeName: "Field Notes Supply", slug: "field-notes-supply", businessName: "Field Notes Supply Co.", businessAddress: "12 Demo Lane", city: "Pune", state: "Maharashtra", country: "India", postalCode: "411001", status: ApprovalStatus.APPROVED } });
  const brand = await prisma.brand.upsert({ where: { userId: brandUser.id }, update: { status: ApprovalStatus.APPROVED }, create: { userId: brandUser.id, name: "Atelier Kanso", slug: "atelier-kanso", category: "Home", status: ApprovalStatus.APPROVED } });
  const category = await prisma.category.upsert({ where: { slug: "home-rituals" }, update: {}, create: { name: "Home rituals", slug: "home-rituals", description: "Objects for slower daily routines." } });
  const product = await prisma.product.upsert({ where: { sku: "DEMO-POUR-001" }, update: { status: ProductStatus.ACTIVE }, create: { name: "Mori ceramic pour-over", slug: "mori-ceramic-pour-over", sku: "DEMO-POUR-001", description: "A calm, considered ceramic brewer for a daily coffee ritual.", price: 2480, listPrice: 2800, status: ProductStatus.ACTIVE, categoryId: category.id, sellerId: seller.id, brandId: brand.id, inventory: { create: { quantity: 24, lowStockThreshold: 5 } }, attributes: { create: [{ name: "Material", value: "Stoneware" }, { name: "Origin", value: "India" }] } } });
  await prisma.product.upsert({ where: { sku: "DEMO-TOTE-001" }, update: { status: ProductStatus.ACTIVE }, create: { name: "Linen market tote", slug: "linen-market-tote", sku: "DEMO-TOTE-001", description: "A sturdy everyday tote cut from washed linen.", price: 1250, status: ProductStatus.ACTIVE, categoryId: category.id, sellerId: seller.id, brandId: brand.id, inventory: { create: { quantity: 40, lowStockThreshold: 8 } } } });
  await prisma.coupon.upsert({ where: { code: "WELCOME10" }, update: {}, create: { code: "WELCOME10", type: "PERCENTAGE", value: 10, maximumDiscount: 500, startsAt: new Date("2026-01-01"), endsAt: new Date("2030-01-01"), usageLimit: 1000 } });
  console.log(`Seeded admin ${admin.email}, seller ${sellerUser.email}, brand ${brandUser.email}, and demo products.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
