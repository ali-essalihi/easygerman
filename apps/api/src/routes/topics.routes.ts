import express from 'express'
import * as topicsController from '../controllers/topics.controller'
import * as topicsModel from '../models/topics.model'
import {
  createTopicSchema,
  topicIdSchema,
  updateTopicTitleSchema,
} from '@easygerman/shared/schemas'
import { ensureAdmin, ensureAuthenticated } from '../middlewares/auth.middlewares'
import validateReqSchema from '../middlewares/validate-req-schema'
import AppError from '../AppError'

const router = express.Router({
  mergeParams: true,
})

router.param('topicId', async (req, res, next, value) => {
  if (!topicIdSchema.safeParse(value).success) {
    throw new AppError(404, 'Topic not found')
  }
  const topic = await topicsModel.find(value)
  if (!topic) {
    throw new AppError(404, 'Topic not found')
  }
  req.topic = topic
  next()
})

router.post(
  '/',
  ensureAuthenticated(),
  ensureAdmin(),
  validateReqSchema(createTopicSchema),
  topicsController.createTopic
)
router.patch(
  '/:topicId',
  ensureAuthenticated(),
  ensureAdmin(),
  validateReqSchema(updateTopicTitleSchema),
  topicsController.updateTopicTitle
)
router.delete('/:topicId', ensureAuthenticated(), ensureAdmin(), topicsController.deleteTopic)

export default router
