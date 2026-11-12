import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "voltmart_admin";
const secret = () => {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error("AUTH_SECRET must be at least 32 characters.");
  return new TextEncoder().encode(value);
};

export async function createSession(user: { id: string; email: string; role: string }) {
  const token = await new SignJWT({ email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret());
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", path: "/", maxAge: 60 * 60 * 8
  });
}

export async function getSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub || !payload.role || !["SUPER_ADMIN", "ADMIN", "STAFF"].includes(String(payload.role))) return null;
    return { id: payload.sub, email: String(payload.email ?? ""), role: String(payload.role) };
  } catch { return null; }
}

export async function requireAdmin(request?: NextRequest) {
  if (request) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) return null;
    try {
      const { payload } = await jwtVerify(token, secret());
      if (!payload.sub || !["SUPER_ADMIN", "ADMIN", "STAFF"].includes(String(payload.role))) return null;
      return { id: payload.sub, email: String(payload.email ?? ""), role: String(payload.role) };
    } catch { return null; }
  }
  return getSession();
}

export async function clearSession() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0, sameSite: "lax" });
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
