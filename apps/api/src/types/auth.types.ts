import type { UserRole } from '@easygerman/shared/types'

export interface OauthStateJWTPayload {
  next_url: string
}

export interface GoogleIdTokenDecoded {
  sub: string
  email: string
}

export type AccessTokenJWTPayload = {
  googleId: string
  email: string
  role: UserRole
}
