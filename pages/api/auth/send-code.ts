import type { NextApiRequest, NextApiResponse } from "next"
import { dbPromise } from "@/lib/db"
import { nanoid } from "nanoid"

// In-memory map for demo; in production use durable store or email service
const codes = new Map<string, string>()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })
  const { email } = req.body as { email?: string }
  if (!email) return res.status(400).json({ error: "Email kerak" })

  const code = nanoid(6)
  codes.set(email, code)

  // Side effect to ensure DB file exists
  await dbPromise.read()

  // For demo, return the code so user can paste it
  res.status(200).json({ ok: true, code })
}

export function consumeCode(email: string, code: string): boolean {
  const saved = codes.get(email)
  if (!saved || saved !== code) return false
  codes.delete(email)
  return true
}
