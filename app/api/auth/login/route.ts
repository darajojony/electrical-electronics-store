import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    if (!email || !password || password.length > 200) return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.active || !["SUPER_ADMIN", "ADMIN", "STAFF"].includes(user.role) || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json({ error: "អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ។" }, { status: 401 });
    }
    await createSession({ id: user.id, email: user.email, role: user.role });
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error("Admin login error", error);
    return NextResponse.json({ error: "Authentication service unavailable. Check database and AUTH_SECRET." }, { status: 503 });
  }
}
