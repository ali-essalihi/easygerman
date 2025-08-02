import { z } from 'zod'

export const topicIdSchema = z.uuid()
export const topicTitleSchema = z.string().max(50)
export const createTopicSchema = z.strictObject({
  title: topicTitleSchema,
})
export const updateTopicTitleSchema = z.strictObject({
  newTitle: topicTitleSchema,
})
