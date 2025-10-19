import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-[radial-gradient(circle_at_top,_#f5f5f5,_#e5e7eb)] flex items-center justify-center p-6">
      <div className="bg-white rounded-xl p-8 shadow-xl w-full max-w-xl text-center space-y-6">
        <h1 className="text-2xl font-bold">IshchiTop</h1>
        <p className="text-sm text-gray-600">Ishchi va mijozlarni ulovchi platforma</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link className="py-3 px-4 rounded-lg bg-gray-900 text-white hover:bg-black" href="/auth?role=worker">Men ishchiman</Link>
          <Link className="py-3 px-4 rounded-lg bg-gray-100 hover:bg-gray-200" href="/auth?role=client">Men ishchi qidiryapman</Link>
        </div>
      </div>
    </main>
  )
}
