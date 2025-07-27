import type { RoleEnum } from './db'

declare global {
  namespace Express {
    interface Request {
      user: {
        googleId: string
        email: string
        role: RoleEnum
      }
    }
  }
}
