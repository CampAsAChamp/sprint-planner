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
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="Sprint Planner" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'system';
                let appliedTheme = theme;
                
                if (theme === 'system') {
                  appliedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? 'dark'
                    : 'light';
                }
                
                document.documentElement.classList.add(appliedTheme);
                // Prevent transitions on initial load
                document.documentElement.classList.add('no-transition');
                setTimeout(() => {
                  document.documentElement.classList.remove('no-transition');
                }, 0);
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
