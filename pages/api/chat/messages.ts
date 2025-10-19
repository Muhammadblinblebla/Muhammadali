import type { NextApiRequest, NextApiResponse } from "next"
import { dbPromise, type ChatMessage } from "@/lib/db"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me"

function getAuth(req: NextApiRequest) {
  const cookie = req.headers.cookie || ""
  const match = cookie.match(/auth_token=([^;]+)/)
  if (!match) return null
  try {
    return jwt.verify(match[1], JWT_SECRET) as { userId: string }
  } catch { return null }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await dbPromise
  await db.read()

  if (req.method === "GET") {
    const { chatId } = req.query as { chatId?: string }
    if (!chatId) return res.status(400).json({ error: "chatId kerak" })
    const messages = db.data.messages.filter(m => m.chatId === chatId)
    return res.status(200).json({ messages })
  }

  if (req.method === "POST") {
    const auth = getAuth(req)
    if (!auth) return res.status(401).json({ error: "Ruxsat yo'q" })

    const { chatId, toUserId, text } = req.body as { chatId: string; toUserId: string; text: string }
    if (!chatId || !toUserId || !text) return res.status(400).json({ error: "Maydonlar to'liq emas" })

    const message: ChatMessage = {
      id: crypto.randomUUID(),
      chatId,
      fromUserId: auth.userId,
      toUserId,
      text,
      createdAt: Date.now(),
    }
    db.data.messages.push(message)
    await db.write()

    try {
      // emit websocket event if server initialized
      // @ts-ignore
      const io = (res.socket as any).server?.io
      io?.to(chatId).emit("message", message)
    } catch {}

    return res.status(201).json({ message })
  }

  res.setHeader("Allow", "GET,POST")
  res.status(405).end()
}
