import type { RoleEnum, TopicRow, VideoRow } from './db'

declare global {
  namespace Express {
    interface Request {
      user: {
        googleId: string
        email: string
        role: RoleEnum
      }
      topic: TopicRow
      video: VideoRow
    }
  }
}
