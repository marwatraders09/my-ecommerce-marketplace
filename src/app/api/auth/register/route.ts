import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { registerSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid registration details" }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email }, select: { id: true } });
  if (existing) return NextResponse.json({ error: "An account already exists" }, { status: 409 });

  const user = await prisma.user.create({
    data: { ...parsed.data, password: await hashPassword(parsed.data.password) },
    select: { id: true, name: true, email: true, role: true },
  });
  await createSession(user.id, user.role);
  return NextResponse.json({ user }, { status: 201 });
}