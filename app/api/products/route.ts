import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const includeInactive = admin && request.nextUrl.searchParams.get("all") === "true";
    const products = await prisma.product.findMany({
      where: includeInactive ? {} : { active: true },
      include: { category: { select: { id: true, name: true, nameKm: true, slug: true } } },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Products GET", error);
    return NextResponse.json({ error: "Database unavailable. Configure DATABASE_URL and run migrations." }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const sku = String(body.sku ?? "").trim();
    const name = String(body.name ?? "").trim();
    const nameKm = String(body.nameKm ?? "").trim();
    const categoryId = String(body.categoryId ?? "");
    const price = Number(body.price);
    const stock = Number(body.stock ?? 0);
    if (!sku || !name || !nameKm || !categoryId || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
      return NextResponse.json({ error: "សូមបំពេញ SKU, ឈ្មោះ, ប្រភេទ, តម្លៃ និងស្តុកឱ្យបានត្រឹមត្រូវ។" }, { status: 400 });
    }
    const product = await prisma.product.create({
      data: { sku, name, nameKm, categoryId, price, stock, description: body.description ? String(body.description) : null, imageUrl: body.imageUrl ? String(body.imageUrl) : null, featured: Boolean(body.featured) }
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Products POST", error);
    return NextResponse.json({ error: "Could not create product. Check SKU and category." }, { status: 400 });
  }
}
