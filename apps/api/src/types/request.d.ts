import type { RoleEnum, TopicRow } from './db'

declare global {
  namespace Express {
    interface Request {
      user: {
        googleId: string
        email: string
        role: RoleEnum
      }
      topic: TopicRow
    }
  }
}
