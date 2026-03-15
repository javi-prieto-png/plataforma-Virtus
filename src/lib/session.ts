import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.JWT_SECRET || "antigravity_super_secret_key_123";
const encodedKey = new TextEncoder().encode(secretKey);

export type SessionPayload = {
  userId: string;
  role: string;
  isFirstLogin: boolean;
  isProfileComplete: boolean;
};

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload & { id: string }; // Mapeamos userId a id por conveniencia en el resto de la app
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const decoded = await decrypt(session);
  if (!decoded) return null;
  return { ...decoded, id: decoded.userId };
}

export async function createSession(payload: SessionPayload) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt(payload);
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function updateSession(payload: Partial<SessionPayload>) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;

  const parsed = await decrypt(session);
  if (!parsed) return null;

  const newPayload = { ...parsed, ...payload };
  await createSession(newPayload);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
