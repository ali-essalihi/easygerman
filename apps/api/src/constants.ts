import type { CookieOptions } from 'express'

export const OAUTH_STATE_EXPIRY = '10m'
export const OAUTH_STATE_COOKIE_NAME = 'oauth_state'
export const OAUTH_STATE_COOKIE_BASE_OPTIONS: CookieOptions = {
  secure: true,
  httpOnly: true,
  sameSite: 'none',
}
