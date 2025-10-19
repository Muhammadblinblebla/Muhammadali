import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me"

export type AuthPayload = {
  userId: string
  role: "worker" | "client"
  email: string
}

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload
  } catch {
    return null
  }
}

export async function getAuth(): Promise<AuthPayload | null> {
  const store = await cookies()
  const token = store.get("auth_token")?.value
  if (!token) return null
  return verifyToken(token)
}
