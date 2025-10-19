"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"

export default function ClientDashboard() {
  const [filters, setFilters] = useState({ region: "", district: "", village: "", q: "" })
  const [ads, setAds] = useState<any[]>([])
  const [me, setMe] = useState<{ id: string } | null>(null)

  async function search() {
    const qs = new URLSearchParams(Object.entries(filters).filter(([_,v]) => v))
    const res = await fetch(`/api/ads?${qs.toString()}`)
    const data = await res.json()
    setAds(data.ads)
  }

  useEffect(() => { search(); fetch("/api/auth/me").then(r=>r.json()).then(d=>setMe(d.user||null)) }, [])

  function chatIdFor(workerId: string) {
    if (!me) return workerId
    const a = me.id
    const b = workerId
    return a < b ? `chat-${a}-${b}` : `chat-${b}-${a}`
  }

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Mijoz Kabineti</h1>

      <section className="bg-white rounded-xl shadow p-4 space-y-3">
        <h2 className="font-medium">Ishchi qidirish</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input className="border rounded px-3 py-2" placeholder="Viloyat" value={filters.region} onChange={e=>setFilters({...filters, region: e.target.value})} />
          <input className="border rounded px-3 py-2" placeholder="Tuman" value={filters.district} onChange={e=>setFilters({...filters, district: e.target.value})} />
          <input className="border rounded px-3 py-2" placeholder="Qishloq" value={filters.village} onChange={e=>setFilters({...filters, village: e.target.value})} />
          <input className="border rounded px-3 py-2" placeholder="Qanday usta kerak" value={filters.q} onChange={e=>setFilters({...filters, q: e.target.value})} />
        </div>
        <button onClick={search} className="px-4 py-2 bg-gray-900 text-white rounded">Izlash</button>
      </section>

      <section className="space-y-3">
        <h2 className="font-medium">E'lonlar</h2>
        <div className="grid gap-3">
          {ads.map(ad => (
            <div key={ad.id} className="border rounded p-3">
              <div className="text-sm text-gray-600">{ad.region} / {ad.district} / {ad.village}</div>
              <div className="font-medium">{ad.job}</div>
              <div className="text-sm">Ishchi: {ad.workerId.slice(0,6)}…</div>
              <div className="flex gap-2 mt-2">
                <a href={`tel:${ad.phone}`} className="px-3 py-1 rounded bg-gray-100">Bog'lanish</a>
                <Link href={`/chat?with=${ad.workerId}&chat=${chatIdFor(ad.workerId)}`} className="px-3 py-1 rounded bg-gray-900 text-white">Chat orqali yozish</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
