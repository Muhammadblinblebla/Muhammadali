"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { io, type Socket } from "socket.io-client"

let socket: Socket | null = null

export default function ChatPage() {
  const params = useSearchParams()
  const chatId = params.get("chat") || "global"
  const toUserId = params.get("with") || ""
  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState("")
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`/api/chat/messages?chatId=${chatId}`).then(r=>r.json()).then(d=>setMessages(d.messages))
  }, [chatId])

  useEffect(() => {
    // ensure Socket.IO server is initialized
    fetch("/api/socket").catch(() => {})
    if (!socket) {
      socket = io({ path: "/api/socket_io" })
    }
    socket.emit("join", chatId)
    const onMessage = (m:any) => {
      if (m.chatId === chatId) setMessages(prev => [...prev, m])
    }
    socket.on("message", onMessage)
    return () => { socket?.off("message", onMessage) }
  }, [chatId])

  useEffect(() => {
    listRef.current?.scrollTo({ top: 1e9, behavior: "smooth" })
  }, [messages.length])

  async function send() {
    if (!text.trim()) return
    const res = await fetch("/api/chat/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chatId, toUserId, text }) })
    if (res.ok) setText("")
  }

  return (
    <main className="p-6 max-w-3xl mx-auto h-dvh flex flex-col">
      <h1 className="text-2xl font-semibold mb-4">Chat</h1>
      <div ref={listRef} className="flex-1 overflow-auto bg-white rounded-xl shadow p-4 space-y-2">
        {messages.map(m => (
          <div key={m.id} className="text-sm"><span className="text-gray-500">{m.fromUserId.slice(0,6)}:</span> {m.text}</div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input className="flex-1 border rounded px-3 py-2" placeholder="Xabar yozing" value={text} onChange={e=>setText(e.target.value)} />
        <button onClick={send} className="px-4 py-2 rounded bg-gray-900 text-white">Yuborish</button>
      </div>
    </main>
  )
}
