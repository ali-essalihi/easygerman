'use client'

import type { GetGoogleAuthUrlRes } from '@easygerman/shared/types'
import { IoLogoGoogle } from 'react-icons/io'
import { FiLogOut } from 'react-icons/fi'
import { api } from '@/api'
import { useState } from 'react'
import toast from 'react-hot-toast'
import Button from '../Button'
import useUser from '@/hooks/useUser'

function LoginButton() {
  const [loading, setLoading] = useState(false)

  function login() {
    setLoading(true)
    api
      .get<GetGoogleAuthUrlRes>('auth/google/url', {
        searchParams: { next_url: window.location.pathname },
      })
      .json()
      .then((data) => {
        window.location.href = data.url
      })
      .catch(() => toast.error('Failed to initiate Google login.'))
      .finally(() => setLoading(false))
  }

  return (
    <Button
      disabled={loading}
      StartIcon={IoLogoGoogle}
      onClick={login}
      color="primary"
      variant="text"
    >
      Login
    </Button>
  )
}

function LogoutButton() {
  const { user, logout } = useUser()

  return (
    <Button
      StartIcon={FiLogOut}
      onClick={logout}
      title={`(${user!.email})`}
      color="danger"
      variant="text"
    >
      Logout
    </Button>
  )
}

export default function AuthButton() {
  const { user, isLoading } = useUser()

  if (isLoading) {
    return null
  }

  if (user) {
    return <LogoutButton />
  }

  return <LoginButton />
}
