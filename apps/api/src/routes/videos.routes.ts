import express from 'express'
import * as videosController from '../controllers/videos.controller'
import { ensureAdmin, ensureAuthenticated } from '../middlewares/auth.middlewares'

const router = express.Router({
  mergeParams: true,
})

router.post('/', ensureAuthenticated(), ensureAdmin(), videosController.createVideo)
router.patch(
  '/:videoId/change-order',
  ensureAuthenticated(),
  ensureAdmin(),
  videosController.changeVideoOrder
)
router.delete('/:videoId', ensureAuthenticated(), ensureAdmin(), videosController.deleteVideo)

export default router
