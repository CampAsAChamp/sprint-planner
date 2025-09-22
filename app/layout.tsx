import './globals.css'

import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sprint Planner',
  description: 'A Next.js application for sprint planning',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <meta name="apple-mobile-web-app-title" content="Sprint Planner" />
      <body className={inter.className}>{children}</body>
    </html>
  )
}
