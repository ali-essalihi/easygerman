import type { Request, Response } from 'express'
import type { GetCurrentUserRes, GetGoogleAuthUrlRes } from '@easygerman/shared/types'
import {
  decodeGoogleIdToken,
  fetchGoogleIdToken,
  generateAccessToken,
  generateGoogleAuthURL,
  generateOauthState,
  sanitizeNextURL,
  verifyOauthState,
} from '../utils/auth.utils'
import {
  ACCESS_TOKEN_COOKIE_BASE_OPTIONS,
  ACCESS_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_EXPIRY,
  AUTH_FAILED_REDIRECT_URL,
  OAUTH_STATE_COOKIE_BASE_OPTIONS,
  OAUTH_STATE_COOKIE_NAME,
  OAUTH_STATE_EXPIRY,
} from '../constants'
import ms from 'ms'
import { googleCallbackQuerySchema, oauthStateSchema } from '../schemas'
import * as userModel from '../models/user.model'
import env from '../env'

export function getGoogleAuthUrl(req: Request, res: Response<GetGoogleAuthUrlRes>) {
  const next_url = sanitizeNextURL(req.query.next_url)
  const oauthState = generateOauthState(next_url)
  const authURL = generateGoogleAuthURL(oauthState)
  res.cookie(OAUTH_STATE_COOKIE_NAME, oauthState, {
    ...OAUTH_STATE_COOKIE_BASE_OPTIONS,
    maxAge: ms(OAUTH_STATE_EXPIRY),
  })
  res.json({ url: authURL })
}

export async function handleGoogleCallback(req: Request, res: Response) {
  try {
    const queryParsed = googleCallbackQuerySchema.safeParse(req.query)
    const stateCookie = oauthStateSchema.safeParse(req.cookies[OAUTH_STATE_COOKIE_NAME])

    if (!queryParsed.success) {
      throw new Error('Invalid query parameters in Google callback')
    }

    if (!stateCookie.success) {
      throw new Error('Invalid or missing OAuth state cookie')
    }

    if ('error' in queryParsed.data) {
      throw new Error(`Google returned an error: ${queryParsed.data.error}`)
    }

    if (queryParsed.data.state !== stateCookie.data) {
      throw new Error('OAuth state mismatch between query and cookie')
    }

    const stateDecoded = verifyOauthState(queryParsed.data.state)
    if (!stateDecoded) {
      throw new Error('Failed to verify OAuth state')
    }

    const idToken = await fetchGoogleIdToken(queryParsed.data.code)
    const idTokenDecoded = decodeGoogleIdToken(idToken)
    const isAdmin = env.ADMIN_GOOGLE_ID === idTokenDecoded.sub

    if (!isAdmin) {
      await userModel.createIfNotExists(idTokenDecoded.sub)
    }

    const accessToken = generateAccessToken({
      sub: idTokenDecoded.sub,
      email: idTokenDecoded.email,
      role: isAdmin ? 'admin' : 'learner',
    })

    res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
      ...ACCESS_TOKEN_COOKIE_BASE_OPTIONS,
      maxAge: ms(ACCESS_TOKEN_EXPIRY),
    })

    res.redirect(302, new URL(stateDecoded.next_url, env.CLIENT_ORIGIN).toString())
  } catch (e) {
    console.error('OAuth callback error:', e)
    res.redirect(302, AUTH_FAILED_REDIRECT_URL)
  }
}

export function getCurrentUser(req: Request, res: Response<GetCurrentUserRes>) {
  res.json({
    email: req.user.email,
    role: req.user.role,
  })
}

export function logout(req: Request, res: Response) {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME, ACCESS_TOKEN_COOKIE_BASE_OPTIONS)
  res.status(204).end()
}
