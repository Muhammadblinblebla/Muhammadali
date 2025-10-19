import type { ReactNode } from "react"
import "./globals.css"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uz">
      <body className="min-h-dvh bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
