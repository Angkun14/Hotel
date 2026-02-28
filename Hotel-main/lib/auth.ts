import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export type AdminToken = { sub: string; email: string; name: string };

export async function signAdminToken(payload: AdminToken) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyAdminToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload as any;
}

export function setAdminCookie(token: string) {
  cookies().set("admin_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAdminCookie() {
  cookies().set("admin_token", "", { httpOnly: true, path: "/", maxAge: 0 });
}

export function getAdminTokenFromCookie() {
  return cookies().get("admin_token")?.value || "";
}