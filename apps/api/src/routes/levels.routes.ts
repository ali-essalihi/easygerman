import express from 'express'
import * as levelsController from '../controllers/levels.controller'
import { ensureAuthenticated } from '../middlewares/auth.middlewares'
import { loadLevel } from '../middlewares/db-loaders'

const router = express.Router()

router.get('/:levelId', loadLevel('params'), levelsController.getLevelSummary)

router.get(
  '/:levelId/progress',
  ensureAuthenticated(),
  loadLevel('params'),
  levelsController.getLevelProgress
)

export default router
