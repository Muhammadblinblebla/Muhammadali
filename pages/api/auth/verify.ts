import type { NextApiRequest, NextApiResponse } from "next"
import { dbPromise, type User } from "@/lib/db"
import { signToken } from "@/lib/auth"
import { consumeCode } from "./send-code"
import { nanoid } from "nanoid"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })
  const { email, code, role } = req.body as { email?: string; code?: string; role?: "worker" | "client" }
  if (!email || !code || !role) return res.status(400).json({ error: "Maydonlar to'liq emas" })

  if (!consumeCode(email, code)) return res.status(400).json({ error: "Kod noto'g'ri" })

  const db = await dbPromise
  await db.read()
  let user = db.data.users.find(u => u.email === email)
  if (!user) {
    user = { id: nanoid(), email, role } as User
    db.data.users.push(user)
    await db.write()
  } else {
    user.role = role
    await db.write()
  }

  const token = signToken({ userId: user.id, email: user.email, role: user.role })

  res.setHeader("Set-Cookie", `auth_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`)
  res.status(200).json({ ok: true })
}
