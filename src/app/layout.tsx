import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Sakinah – Muslim Journal & Spiritual Companion",
  description: "A peaceful space for reflection, gratitude, and growth.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
