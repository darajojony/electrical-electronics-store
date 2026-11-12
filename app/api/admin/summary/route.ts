import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const [products, activeProducts, lowStock, orders, pendingOrders, categories] = await Promise.all([
      prisma.product.count(), prisma.product.count({ where: { active: true } }),
      prisma.product.count({ where: { active: true, stock: { lte: 5 } } }),
      prisma.order.count(), prisma.order.count({ where: { status: "PENDING" } }),
      prisma.category.count({ where: { active: true } })
    ]);
    return NextResponse.json({ products, activeProducts, lowStock, orders, pendingOrders, categories });
  } catch { return NextResponse.json({ error: "Database unavailable." }, { status: 503 }); }
}
