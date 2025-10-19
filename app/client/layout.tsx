export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh grid grid-cols-1 md:grid-cols-[240px_1fr]">
      <aside className="border-r p-4 space-y-2">
        <div className="font-semibold">Menyu</div>
        <nav className="flex flex-col gap-2 text-sm">
          <a href="/client">Profil</a>
          <a href="/client">Mening ishchilarim</a>
          <a href="/client">Qidirish</a>
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  )
}
