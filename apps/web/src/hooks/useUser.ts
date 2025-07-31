import type { GetCurrentUserRes } from '@easygerman/shared/types'
import { api } from '@/api'
import useSWR from 'swr'
import { useCallback } from 'react'

const fetcher = () => api.get<GetCurrentUserRes>('auth/me').json()

export default function useUser() {
  const { data, isLoading, mutate } = useSWR<GetCurrentUserRes | null>('/me', fetcher)

  const logout = useCallback(() => {
    if (confirm('Are you sure you want to logout?')) {
      api.post('auth/logout')
      mutate(null, { revalidate: false })
    }
  }, [])

  return {
    user: data || null,
    isLoading,
    logout,
  }
}
