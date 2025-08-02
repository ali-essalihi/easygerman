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
