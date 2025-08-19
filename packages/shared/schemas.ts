import { z } from 'zod'

export const levelIdSchema = z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
export const topicIdSchema = z.uuid()
export const topicTitleSchema = z
  .string({ error: 'Title is required' })
  .trim()
  .nonempty('Title cannot be empty')
  .max(50, 'Max 50 characters allowed')
export const createTopicSchema = z.strictObject({
  levelId: levelIdSchema,
  title: topicTitleSchema,
})
export const updateTopicTitleSchema = z.strictObject({
  newTitle: topicTitleSchema,
})

export const ytVideoIdSchema = z
  .string({ error: 'Youtube Video ID is required' })
  .regex(/^[a-zA-Z0-9_-]{11}$/, { error: 'Invalid Youtube Video ID' })
export const createVideoSchema = z.strictObject({
  topicId: topicIdSchema,
  ytVideoId: ytVideoIdSchema,
})
export const changeVideoOrderSchema = z.strictObject({
  before: ytVideoIdSchema.nullish(),
  after: ytVideoIdSchema.nullish(),
})
