import express from 'express'
import * as levelsController from '../controllers/levels.controller'
import AppError from '../AppError'
import { levelIdSchema } from '@easygerman/shared/schemas'
import { ensureAuthenticated } from '../middlewares/auth.middlewares'

const router = express.Router()

router.param('levelId', (req, res, next, value) => {
  if (!levelIdSchema.safeParse(value).success) {
    throw new AppError(404, 'Level not found')
  }
  next()
})

router.get('/:levelId', levelsController.getLevelSummary)

router.get('/:levelId/progress', ensureAuthenticated(), levelsController.getLevelProgress)

export default router
