import type { NextApiRequest, NextApiResponse } from "next"
import { dbPromise, type Ad } from "@/lib/db"
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

  if (req.method === "GET") {
    const { region, district, village, q } = req.query as Record<string, string>
    let ads = db.data.ads
    if (region) ads = ads.filter(a => a.region === region)
    if (district) ads = ads.filter(a => a.district === district)
    if (village) ads = ads.filter(a => a.village === village)
    if (q) {
      const s = q.toLowerCase()
      ads = ads.filter(a => a.job.toLowerCase().includes(s))
    }
    return res.status(200).json({ ads })
  }

  if (req.method === "POST") {
    const auth = getAuth(req)
    if (!auth || auth.role !== "worker") return res.status(401).json({ error: "Ruxsat yo'q" })

    const { id, workerId, createdAt, ...payload } = req.body as Partial<Ad>
    const safe: Ad = {
      id: crypto.randomUUID(),
      workerId: auth.userId,
      phone: payload.phone || "",
      region: payload.region || "",
      district: payload.district || "",
      village: payload.village || "",
      job: payload.job || "",
      price: payload.price,
      deadline: payload.deadline,
      createdAt: Date.now(),
    }

    db.data.ads.push(safe)
    await db.write()
    return res.status(201).json({ ad: safe })
  }

  res.setHeader("Allow", "GET,POST")
  res.status(405).end()
}
