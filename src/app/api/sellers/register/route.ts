import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { sellerRegistrationSchema } from "@/lib/validation/seller";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const parsed = sellerRegistrationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid seller details" }, { status: 400 });
  const existing = await prisma.seller.findUnique({ where: { userId: session.userId }, select: { id: true, status: true } });
  if (existing) return NextResponse.json({ error: "Seller application already exists", status: existing.status }, { status: 409 });
  const baseSlug = slugify(parsed.data.storeName);
  const slug = `${baseSlug}-${session.userId.slice(0, 8)}`;
  try {
    const seller = await prisma.seller.create({ data: { ...parsed.data, slug, userId: session.userId }, select: { id: true, storeName: true, status: true } });
    return NextResponse.json({ seller }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to submit seller application" }, { status: 500 });
  }
}