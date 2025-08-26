'use client'

import { redirect } from 'next/navigation'
import useUser from '@/hooks/useUser'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, user } = useUser()

  if (isLoading) {
    return null
  }

  if (user && user.role === 'admin') {
    return children
  }

  redirect('/')
}
