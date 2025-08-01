import express from 'express'
import * as topicsController from '../controllers/topics.controller'
import { ensureAdmin, ensureAuthenticated } from '../middlewares/auth.middlewares'

const router = express.Router({
  mergeParams: true,
})

router.post('/', ensureAuthenticated(), ensureAdmin(), topicsController.createTopic)
router.patch('/:topicId', ensureAuthenticated(), ensureAdmin(), topicsController.updateTopicTitle)
router.delete('/:topicId', ensureAuthenticated(), ensureAdmin(), topicsController.deleteTopic)

export default router
