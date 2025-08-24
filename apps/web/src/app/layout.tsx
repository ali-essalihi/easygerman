import type { Metadata } from 'next'
import { SWRConfig } from 'swr'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Easy German',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <SWRConfig
          value={{
            shouldRetryOnError: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
          }}
        >
          <Toaster position="top-center" />
          <Header />
          <main className="container py-12">{children}</main>
        </SWRConfig>
      </body>
    </html>
  )
}
