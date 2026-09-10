import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { checkoutSchema } from "@/lib/validation/order";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const parsed = checkoutSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid delivery address" }, { status: 400 });

  try {
    const order = await prisma.$transaction(async (transaction) => {
      const cart = await transaction.cart.findUnique({ where: { userId: session.userId }, include: { items: true } });
      if (!cart || cart.items.length === 0) throw new Error("EMPTY_CART");
      const products = await transaction.product.findMany({ where: { id: { in: cart.items.map((item) => item.productId) }, status: "ACTIVE" }, include: { inventory: true } });
      if (products.length !== cart.items.length) throw new Error("PRODUCT_UNAVAILABLE");
      const productById = new Map(products.map((product) => [product.id, product]));
      const lineItems = cart.items.map((item) => {
        const product = productById.get(item.productId);
        if (!product || !product.inventory) throw new Error("PRODUCT_UNAVAILABLE");
        const available = product.inventory.quantity - product.inventory.reserved;
        if (item.quantity > available) throw new Error("INSUFFICIENT_STOCK");
        return { item, product, total: Number(product.price) * item.quantity };
      });
      for (const line of lineItems) {
        const updated = await transaction.inventory.updateMany({ where: { id: line.product.inventory!.id, quantity: { gte: line.item.quantity } }, data: { quantity: { decrement: line.item.quantity } } });
        if (updated.count !== 1) throw new Error("INSUFFICIENT_STOCK");
        await transaction.inventoryTransaction.create({ data: { inventoryId: line.product.inventory!.id, quantity: -line.item.quantity, reason: "ORDER_PLACED" } });
      }
      const subtotal = lineItems.reduce((sum, line) => sum + line.total, 0);
      const tax = 0;
      const shipping = subtotal >= 2000 ? 0 : 99;
      let discount = 0;
      let couponId: string | null = null;
      if (parsed.data.couponCode) {
        const coupon = await transaction.coupon.findFirst({ where: { code: parsed.data.couponCode.toUpperCase(), startsAt: { lte: new Date() }, endsAt: { gte: new Date() } }, include: { usages: { where: { userId: session.userId } } } });
        if (!coupon || (coupon.usageLimit !== null && coupon.usages.length >= coupon.usageLimit) || coupon.usages.length > 0 || (coupon.minimumOrder && subtotal < Number(coupon.minimumOrder))) throw new Error("INVALID_COUPON");
        discount = coupon.type === "PERCENTAGE" ? subtotal * Number(coupon.value) / 100 : Number(coupon.value);
        if (coupon.maximumDiscount) discount = Math.min(discount, Number(coupon.maximumDiscount));
        discount = Math.min(discount, subtotal);
        couponId = coupon.id;
      }
      const addressData = { label: parsed.data.label, line1: parsed.data.line1, line2: parsed.data.line2, city: parsed.data.city, state: parsed.data.state, country: parsed.data.country, postalCode: parsed.data.postalCode };
      const address = await transaction.address.create({ data: { ...addressData, userId: session.userId } });
      const total = subtotal + tax + shipping - discount;
      const created = await transaction.order.create({ data: { userId: session.userId, addressId: address.id, subtotal, tax, shipping, discount, total, items: { create: lineItems.map(({ item, product, total: lineTotal }) => ({ productId: product.id, sellerId: product.sellerId, quantity: item.quantity, unitPrice: product.price, total: lineTotal })) }, payment: { create: { method: "COD", status: "PENDING", amount: total } } }, select: { id: true } });
      if (couponId) await transaction.couponUsage.create({ data: { couponId, userId: session.userId, orderId: created.id } });
      await transaction.notification.create({ data: { userId: session.userId, type: "ORDER", title: "Order placed", body: `Your order ${created.id.slice(0, 8)} has been received.` } });
      const sellerIds = [...new Set(lineItems.map((line) => line.product.sellerId))];
      await transaction.shipment.createMany({ data: sellerIds.map((sellerId) => ({ orderId: created.id, sellerId, status: "CREATED" })) });
      await transaction.cartItem.deleteMany({ where: { cartId: cart.id } });
      return created;
    });
    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (code === "EMPTY_CART") return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
    if (code === "INSUFFICIENT_STOCK") return NextResponse.json({ error: "One or more items no longer have enough stock" }, { status: 409 });
    if (code === "PRODUCT_UNAVAILABLE") return NextResponse.json({ error: "One or more products are unavailable" }, { status: 409 });
    if (code === "INVALID_COUPON") return NextResponse.json({ error: "This coupon is invalid or no longer available" }, { status: 409 });
    return NextResponse.json({ error: "Unable to place order" }, { status: 500 });
  }
}