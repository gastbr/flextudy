import type { Metadata } from 'next'
import './globals.css'
import { ContextProvider } from './context/provider'

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
      <body>
        <ContextProvider>
          {children}
        </ContextProvider>
      </body>
    </html>
  )
}
