import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const categories = await prisma.category.findMany({ where: admin && request.nextUrl.searchParams.get("all") === "true" ? {} : { active: true }, orderBy: { name: "asc" } });
    return NextResponse.json({ categories });
  } catch { return NextResponse.json({ error: "Database unavailable." }, { status: 503 }); }
}
