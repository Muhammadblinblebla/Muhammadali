import type { NextApiRequest, NextApiResponse } from "next"
import jwt from "jsonwebtoken"
import { dbPromise } from "@/lib/db"

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookie = req.headers.cookie || ""
  const match = cookie.match(/auth_token=([^;]+)/)
  if (!match) return res.status(401).json({ error: "Not authenticated" })
  let payload: any
  try {
    payload = jwt.verify(match[1], JWT_SECRET)
  } catch {
    return res.status(401).json({ error: "Invalid token" })
  }

  const db = await dbPromise
  await db.read()
  const user = db.data.users.find(u => u.id === payload.userId)
  if (!user) return res.status(404).json({ error: "User not found" })

  if (req.method === "GET") {
    return res.status(200).json({ user: { id: user.id, role: user.role, email: user.email, name: user.name || "", phone: user.phone || "" } })
  }

  if (req.method === "PATCH") {
    const body = req.body as { name?: string; phone?: string }
    user.name = body.name ?? user.name
    user.phone = body.phone ?? user.phone
    await db.write()
    return res.status(200).json({ user })
  }

  res.setHeader("Allow", "GET,PATCH")
  res.status(405).end()
}
