import { z } from 'zod'

export const levelIdSchema = z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
export const userRoleSchema = z.enum(['admin', 'learner'])
export const topicIdSchema = z.uuid()
export const topicTitleSchema = z.string().max(50)
export const createTopicSchema = z.strictObject({
  levelId: levelIdSchema,
  title: topicTitleSchema,
})
export const updateTopicTitleSchema = z.strictObject({
  newTitle: topicTitleSchema,
})

export const ytVideoIdSchema = z.string().regex(/^[a-zA-Z0-9_-]{11}$/)
export const createVideoSchema = z.strictObject({
  topicId: topicIdSchema,
  ytVideoId: ytVideoIdSchema,
})
export const changeVideoOrderSchema = z.strictObject({
  before: ytVideoIdSchema.nullish(),
  after: ytVideoIdSchema.nullish(),
})
