import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  try {
    const body = await request.json();
    const data: Prisma.ProductUncheckedUpdateInput = {};
    if (body.sku !== undefined) data.sku = String(body.sku);
    if (body.name !== undefined) data.name = String(body.name);
    if (body.nameKm !== undefined) data.nameKm = String(body.nameKm);
    if (body.description !== undefined) data.description = body.description === "" ? null : String(body.description);
    if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl === "" ? null : String(body.imageUrl);
    if (body.price !== undefined) {
      const n = Number(body.price);
      if (!Number.isFinite(n) || n < 0) return NextResponse.json({ error: "Invalid price" }, { status: 400 });
      data.price = n;
    }
    if (body.stock !== undefined) {
      const n = Number(body.stock);
      if (!Number.isInteger(n) || n < 0) return NextResponse.json({ error: "Invalid stock" }, { status: 400 });
      data.stock = n;
    }
    if (body.active !== undefined) data.active = Boolean(body.active);
    if (body.featured !== undefined) data.featured = Boolean(body.featured);
    if (body.categoryId !== undefined) data.categoryId = String(body.categoryId);
    const product = await prisma.product.update({ where: { id }, data });
    return NextResponse.json({ product });
  } catch (error) {
    console.error("Products PATCH", error);
    return NextResponse.json({ error: "Could not update product." }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  try {
    await prisma.product.update({ where: { id }, data: { active: false } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Could not archive product." }, { status: 400 });
  }
}
