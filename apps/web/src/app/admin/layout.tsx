import EnsureAdmin from './_components/EnsureAdmin'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <EnsureAdmin>{children}</EnsureAdmin>
}
