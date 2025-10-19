"use client"

import { useEffect, useState } from "react"

export default function WorkerDashboard() {
  const [ads, setAds] = useState<any[]>([])
  const [form, setForm] = useState({ phone: "+998", region: "", district: "", village: "", job: "", price: "", deadline: "" })
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetch("/api/ads").then(r=>r.json()).then(d=>setAds(d.ads)) }, [])

  async function submit() {
    setLoading(true)
    const res = await fetch("/api/ads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    const data = await res.json()
    if (res.ok) {
      setAds(prev => [data.ad, ...prev])
      setForm({ phone: "+998", region: "", district: "", village: "", job: "", price: "", deadline: "" })
    } else {
      alert(data.error || "Xatolik")
    }
    setLoading(false)
  }

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Ishchi Kabineti</h1>

      <section className="bg-white rounded-xl shadow p-4 space-y-3">
        <h2 className="font-medium">E'lon joylash</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input className="border rounded px-3 py-2" placeholder="Telefon" value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} />
          <input className="border rounded px-3 py-2" placeholder="Viloyat" value={form.region} onChange={e=>setForm({...form, region: e.target.value})} />
          <input className="border rounded px-3 py-2" placeholder="Tuman" value={form.district} onChange={e=>setForm({...form, district: e.target.value})} />
          <input className="border rounded px-3 py-2" placeholder="Qishloq" value={form.village} onChange={e=>setForm({...form, village: e.target.value})} />
          <input className="border rounded px-3 py-2" placeholder="Ish turi" value={form.job} onChange={e=>setForm({...form, job: e.target.value})} />
          <input className="border rounded px-3 py-2" placeholder="Narx (ixtiyoriy)" value={form.price} onChange={e=>setForm({...form, price: e.target.value})} />
          <input className="border rounded px-3 py-2" placeholder="Tugallanish muddati (ixtiyoriy)" value={form.deadline} onChange={e=>setForm({...form, deadline: e.target.value})} />
        </div>
        <button disabled={loading} onClick={submit} className="px-4 py-2 bg-gray-900 text-white rounded">E'lon berish</button>
      </section>

      <section className="space-y-3">
        <h2 className="font-medium">Mening e'lonlarim</h2>
        <div className="grid gap-3">
          {ads.map(ad => (
            <div key={ad.id} className="border rounded p-3">
              <div className="font-medium">{ad.job}</div>
              <div className="text-sm text-gray-600">{ad.region} / {ad.district} / {ad.village}</div>
              <div className="text-sm">Tel: {ad.phone}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
