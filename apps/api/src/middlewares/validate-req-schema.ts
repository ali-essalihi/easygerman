import type { Request, Response, NextFunction } from 'express'
import type { ZodObject } from 'zod'
import AppError from '../AppError'

export default function validateReqSchema(schema: ZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { success, data } = schema.safeParse(req.body)
    if (!success) {
      throw new AppError(400, 'Invalid request body.')
    }
    req.body = data
    next()
  }
}
