import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/catalog/products";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const result = await searchProducts({ query: url.searchParams.get("q") ?? undefined, category: url.searchParams.get("category") ?? undefined, page: Number(url.searchParams.get("page") ?? 1), sort: url.searchParams.get("sort") ?? undefined });
  return NextResponse.json(result);
}