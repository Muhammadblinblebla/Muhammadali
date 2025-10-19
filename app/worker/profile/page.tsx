"use client"

import { useEffect, useState } from "react"

export default function WorkerProfilePage() {
  const [form, setForm] = useState({ name: "", phone: "" })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("/api/auth/me").then(r=>r.json()).then(d=>{
      if (d.user) setForm({ name: d.user.name || "", phone: d.user.phone || "" })
    })
  }, [])

  async function save() {
    setLoading(true)
    await fetch("/api/auth/me", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    setLoading(false)
  }

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Profil</h1>
      <div className="bg-white rounded-xl shadow p-4 space-y-3">
        <input className="border rounded px-3 py-2 w-full" placeholder="Ism" value={form.name} onChange={e=>setForm({ ...form, name: e.target.value })} />
        <input className="border rounded px-3 py-2 w-full" placeholder="Telefon" value={form.phone} onChange={e=>setForm({ ...form, phone: e.target.value })} />
        <button disabled={loading} onClick={save} className="px-4 py-2 rounded bg-gray-900 text-white">Saqlash</button>
      </div>
    </main>
  )
}
