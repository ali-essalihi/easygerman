import type { CookieOptions } from 'express'
import env from './env'

export const OAUTH_STATE_EXPIRY = '10m'
export const OAUTH_STATE_COOKIE_NAME = 'oauth_state'
export const OAUTH_STATE_COOKIE_BASE_OPTIONS: CookieOptions = {
  secure: true,
  httpOnly: true,
  sameSite: 'none',
}

export const AUTH_FAILED_REDIRECT_URL = new URL('/error/auth_failed', env.CLIENT_ORIGIN).toString()

export const DEFAULT_ACCESS_TOKEN_EXPIRY = '15d'
export const ADMIN_ACCESS_TOKEN_EXPIRY = '1h'
export const ACCESS_TOKEN_COOKIE_NAME = 'access_token'
export const ACCESS_TOKEN_COOKIE_BASE_OPTIONS: CookieOptions = {
  secure: true,
  httpOnly: true,
  sameSite: 'none',
}

export const EASY_GERMAN_CHANNEL_ID = 'UCbxb2fqe9oNgglAoYqsYOtQ'
