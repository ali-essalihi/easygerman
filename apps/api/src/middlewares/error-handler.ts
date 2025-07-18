import type { Request, Response, NextFunction } from 'express'
import AppError from '../AppError'

export default function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err && typeof err === 'object') {
    let status = err.status || err.statusCode || 500
    if (err instanceof AppError) {
      return res.status(err.status).json({ message: err.message })
    }
    if (typeof status === 'number' && status >= 400 && status < 600) {
      console.error(err)
      return res.status(status).json({ message: 'Something went wrong!' })
    }
  }
  console.error(err)
  res.status(500).json({ message: 'Something went wrong!' })
}
