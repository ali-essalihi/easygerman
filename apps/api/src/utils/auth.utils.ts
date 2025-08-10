import type { StringValue } from 'ms'
import type {
  AccessTokenJWTPayload,
  GoogleIdTokenDecoded,
  OauthStateJWTPayload,
} from '../types/auth.types'
import { nextURLSchema } from '../schemas'
import { OAUTH_STATE_EXPIRY } from '../constants'
import env from '../env'
import jwt from 'jsonwebtoken'

export function sanitizeNextURL(nextURL: any) {
  const parsed = nextURLSchema.safeParse(nextURL)
  return parsed.success ? parsed.data : '/'
}

export function generateOauthState(nextURL: string) {
  const payload: OauthStateJWTPayload = {
    next_url: nextURL,
  }
  return jwt.sign(payload, env.OAUTH_STATE_SECRET, {
    algorithm: 'HS256',
    expiresIn: OAUTH_STATE_EXPIRY,
  })
}

export function generateGoogleAuthURL(state: string) {
  const url = new URL('https://accounts.google.com/o/oauth2/auth')
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: env.GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: 'email profile',
    access_type: 'online',
    prompt: 'select_account',
    state,
  })
  url.search = params.toString()
  return url.toString()
}

export function verifyOauthState(state: string) {
  try {
    return jwt.verify(state, env.OAUTH_STATE_SECRET, {
      algorithms: ['HS256'],
    }) as OauthStateJWTPayload
  } catch {
    return false
  }
}

export async function fetchGoogleIdToken(code: string) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: env.GOOGLE_REDIRECT_URI,
      code,
    }),
  })
  if (!res.ok) throw new Error(`Failed to fetch ID token from Google. Status: ${res.status}`)
  const data = await res.json()
  return (data as Record<any, any>).id_token as string
}

export function decodeGoogleIdToken(idToken: string) {
  const decoded = jwt.decode(idToken)
  if (!decoded) throw new Error('Failed to decode Google ID token.')
  return decoded as GoogleIdTokenDecoded
}

export function generateAccessToken(expiry: StringValue, payload: AccessTokenJWTPayload) {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    algorithm: 'HS256',
    expiresIn: expiry,
  })
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, env.ACCESS_TOKEN_SECRET, {
      algorithms: ['HS256'],
    }) as AccessTokenJWTPayload
  } catch {
    return false
  }
}
