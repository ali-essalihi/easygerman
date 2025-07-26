import type { Request, Response } from 'express'
import type { GetGoogleAuthUrlRes } from '@easygerman/shared/types'
import { generateGoogleAuthURL, generateOauthState, sanitizeNextURL } from '../utils/auth.utils'
import {
  OAUTH_STATE_COOKIE_BASE_OPTIONS,
  OAUTH_STATE_COOKIE_NAME,
  OAUTH_STATE_EXPIRY,
} from '../constants'
import ms from 'ms'

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

export function handleGoogleCallback(req: Request, res: Response) {}

export function getCurrentUser(req: Request, res: Response) {}
