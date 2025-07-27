import type { Request, Response, NextFunction } from 'express'
import { ACCESS_TOKEN_COOKIE_NAME } from '../constants'
import { verifyAccessToken } from '../utils/auth.utils'
import AppError from '../AppError'

export function authenticate() {
  return (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME]
    const decoded = verifyAccessToken(accessToken)
    if (!decoded) {
      return next()
    }
    req.user = {
      googleId: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    }
    next()
  }
}

export function ensureAuthenticated() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, "You're not logged in.")
    }
    next()
  }
}

export function ensureAdmin() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== 'admin') {
      throw new AppError(403, 'Access denied')
    }
    next()
  }
}
