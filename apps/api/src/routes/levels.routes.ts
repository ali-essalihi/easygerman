import express from 'express'
import AppError from '../AppError'
import { levelIdSchema } from '@easygerman/shared/schemas'

const router = express.Router()

router.param('levelId', (req, res, next, value) => {
  if (!levelIdSchema.safeParse(value).success) {
    throw new AppError(404, 'Level not found')
  }
  next()
})

export default router
