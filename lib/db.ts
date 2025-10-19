import { JSONFilePreset } from "lowdb/node"
import { join } from "node:path"

export type User = {
  id: string
  role: "worker" | "client"
  email: string
  name?: string
  phone?: string
}

export type Ad = {
  id: string
  workerId: string
  phone: string
  region: string
  district: string
  village: string
  job: string
  price?: string
  deadline?: string
  createdAt: number
}

export type ChatMessage = {
  id: string
  chatId: string
  fromUserId: string
  toUserId: string
  text: string
  createdAt: number
}

export type DBSchema = {
  users: User[]
  ads: Ad[]
  messages: ChatMessage[]
}

export const dbPromise = JSONFilePreset<DBSchema>(
  join(process.cwd(), ".data", "db.json"),
  { users: [], ads: [], messages: [] }
)
