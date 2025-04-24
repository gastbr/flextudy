import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FLEXTUDY · Your All-in-One Educational Hub',
  description: 'Your All-in-One Educational Hub.',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
