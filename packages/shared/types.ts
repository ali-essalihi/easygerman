import { z } from 'zod'
import * as schemas from './schemas'

export interface GetGoogleAuthUrlRes {
  url: string
}

export interface GetCurrentUserRes {
  email: string
  role: 'admin' | 'learner'
}

export type CreateTopicReq = z.infer<typeof schemas.createTopicSchema>
export type UpdateTopicTitleReq = z.infer<typeof schemas.updateTopicTitleSchema>

export type CreateVideoReq = z.infer<typeof schemas.createVideoSchema>
export type ChangeVideoOrderReq = z.infer<typeof schemas.changeVideoOrderSchema>

export interface ToggleCompleteRes {
  completed: boolean
}

export interface GetLevelProgressRes {
  totalCompletedTopics: number
  totalCompletedVideos: number
}

export type GetTopicsProgressRes = Record<string, number>

export interface GetVideosProgressRes {
  completedVideos: string[]
}
