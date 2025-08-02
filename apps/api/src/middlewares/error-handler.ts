import type { Request, Response, NextFunction } from 'express'
import AppError from '../AppError'

export default function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ message: err.message })
  }
  console.error(err)
  res.status(500).json({ message: 'Something went wrong!' })
}
