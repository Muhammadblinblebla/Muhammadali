"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function AuthPage() {
  const router = useRouter()
  const params = useSearchParams()
  const role = (params.get("role") as "worker" | "client") || "client"
  const redirect = params.get("redirect") || "/" + (role === "worker" ? "worker" : "client")

  const [email, setEmail] = useState("")
  const [step, setStep] = useState<"email" | "code">("email")
  const [code, setCode] = useState("")
  const [sentCode, setSentCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function sendCode() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/auth/send-code", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Xatolik")
      setSentCode(data.code) // dev mode: show code
      setStep("code")
    } catch (e:any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function verify() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/auth/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, code, role }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Xatolik")
      router.replace(redirect)
    } catch (e:any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-dvh flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6 space-y-4">
        <h1 className="text-xl font-semibold">Email orqali kirish</h1>
        {step === "email" && (
          <div className="space-y-3">
            <input className="w-full border rounded px-3 py-2" placeholder="email@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
            <button disabled={loading || !email} onClick={sendCode} className="w-full py-2 rounded bg-gray-900 text-white disabled:opacity-50">Kodni yuborish</button>
          </div>
        )}
        {step === "code" && (
          <div className="space-y-3">
            <input className="w-full border rounded px-3 py-2" placeholder="Tasdiqlash kodi" value={code} onChange={e=>setCode(e.target.value)} />
            <button disabled={loading || !code} onClick={verify} className="w-full py-2 rounded bg-gray-900 text-white disabled:opacity-50">Tasdiqlash</button>
            {sentCode && <p className="text-xs text-gray-500">Dev: Kod {sentCode}</p>}
          </div>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </main>
  )
}
