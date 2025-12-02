import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import RecoilProvider from '@/components/RecoilProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Event Builder',
  description: 'Create and customize events',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RecoilProvider>
          {children}
        </RecoilProvider>
      </body>
    </html>
  )
}

