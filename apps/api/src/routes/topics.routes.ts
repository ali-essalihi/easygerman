import express from 'express'
import * as topicsController from '../controllers/topics.controller'
import { createTopicSchema, updateTopicTitleSchema } from '@easygerman/shared/schemas'
import { ensureAdmin, ensureAuthenticated } from '../middlewares/auth.middlewares'
import validateReqSchema from '../middlewares/validate-req-schema'
import { loadLevel, loadTopic } from '../middlewares/db-loaders'

const router = express.Router()

router.get(
  '/progress',
  ensureAuthenticated(),
  loadLevel('query'),
  topicsController.getTopicsProgress
)

router.get('/', loadLevel('query'), topicsController.getAllTopics)

router.get('/:topicId', loadTopic('params'), topicsController.getTopicDetail)

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
  loadTopic('params'),
  topicsController.updateTopicTitle
)

router.delete(
  '/:topicId',
  ensureAuthenticated(),
  ensureAdmin(),
  loadTopic('params'),
  topicsController.deleteTopic
)

export default router
