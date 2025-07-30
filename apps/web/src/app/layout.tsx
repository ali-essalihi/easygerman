import type { Metadata } from 'next'
import { SWRConfig } from 'swr'
import './globals.css'

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
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
          }}
        >
          {children}
        </SWRConfig>
      </body>
    </html>
  )
}
