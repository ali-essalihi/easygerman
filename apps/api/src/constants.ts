import type { CookieOptions } from 'express'
import env from './env'

export const OAUTH_STATE_EXPIRY = '10m'
export const OAUTH_STATE_COOKIE_NAME = 'oauth_state'
export const OAUTH_STATE_COOKIE_BASE_OPTIONS: CookieOptions = {
  secure: true,
  httpOnly: true,
  sameSite: 'none',
}

export const AUTH_FAILED_REDIRECT_URL = new URL(
  '/error?code=auth_failed',
  env.CLIENT_ORIGIN
).toString()

export const ACCESS_TOKEN_EXPIRY = '15d'
export const ACCESS_TOKEN_COOKIE_NAME = 'access_token'
export const ACCESS_TOKEN_COOKIE_BASE_OPTIONS: CookieOptions = {
  secure: true,
  httpOnly: true,
  sameSite: 'none',
}
