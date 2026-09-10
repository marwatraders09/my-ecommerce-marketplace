import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { brandRegistrationSchema } from "@/lib/validation/brand";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const parsed = brandRegistrationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid brand details" }, { status: 400 });
  if (await prisma.brand.findUnique({ where: { userId: session.userId }, select: { id: true } })) return NextResponse.json({ error: "Brand application already exists" }, { status: 409 });
  const { companyName, businessAddress, contactInformation, authorizationNotes, ...brandData } = parsed.data;
  try {
    const brand = await prisma.brand.create({ data: { ...brandData, slug: `${slugify(parsed.data.name)}-${session.userId.slice(0, 8)}`, userId: session.userId, verification: { create: { companyName, businessAddress, contactInformation, authorizationNotes } } }, select: { id: true, name: true, status: true } });
    return NextResponse.json({ brand }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to submit brand application" }, { status: 500 });
  }
}