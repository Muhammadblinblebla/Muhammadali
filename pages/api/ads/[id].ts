import type { NextApiRequest, NextApiResponse } from "next"
import { dbPromise } from "@/lib/db"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me"

function getAuth(req: NextApiRequest) {
  const cookie = req.headers.cookie || ""
  const match = cookie.match(/auth_token=([^;]+)/)
  if (!match) return null
  try {
    return jwt.verify(match[1], JWT_SECRET) as { userId: string; role: "worker" | "client" }
  } catch { return null }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await dbPromise
  await db.read()
  const id = req.query.id as string

  if (req.method === "PUT") {
    const auth = getAuth(req)
    if (!auth) return res.status(401).json({ error: "Ruxsat yo'q" })
    const ad = db.data.ads.find(a => a.id === id)
    if (!ad) return res.status(404).json({ error: "Topilmadi" })
    if (ad.workerId !== auth.userId) return res.status(403).json({ error: "Faqat egasi tahrirlashi mumkin" })

    const body = req.body as Partial<typeof ad>
    Object.assign(ad, {
      phone: body.phone ?? ad.phone,
      region: body.region ?? ad.region,
      district: body.district ?? ad.district,
      village: body.village ?? ad.village,
      job: body.job ?? ad.job,
      price: body.price ?? ad.price,
      deadline: body.deadline ?? ad.deadline,
    })
    await db.write()
    return res.status(200).json({ ad })
  }

  if (req.method === "DELETE") {
    const auth = getAuth(req)
    if (!auth) return res.status(401).json({ error: "Ruxsat yo'q" })
    const idx = db.data.ads.findIndex(a => a.id === id)
    if (idx === -1) return res.status(404).json({ error: "Topilmadi" })
    if (db.data.ads[idx].workerId !== auth.userId) return res.status(403).json({ error: "Faqat egasi o'chirishi mumkin" })
    db.data.ads.splice(idx, 1)
    await db.write()
    return res.status(204).end()
  }

  res.setHeader("Allow", "PUT,DELETE")
  res.status(405).end()
}
