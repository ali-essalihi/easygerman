import { nextURLSchema } from '../schemas'
import env from '../env'
import { OAUTH_STATE_EXPIRY } from '../constants'
import jwt from 'jsonwebtoken'

export function sanitizeNextURL(nextURL: any) {
  const parsed = nextURLSchema.safeParse(nextURL)
  return parsed.success ? parsed.data : '/'
}

interface OauthStateJWTPayload {
  next_url: string
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
