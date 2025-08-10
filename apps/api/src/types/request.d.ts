import type { AccessTokenJWTPayload } from './auth.types'
import type { LevelRow, TopicRow, VideoRow } from './db'

declare global {
  namespace Express {
    interface Request {
      user: AccessTokenJWTPayload
      topic: TopicRow
      video: VideoRow
      level: LevelRow
    }
  }
}
