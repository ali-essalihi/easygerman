import express from 'express'
import helmet from 'helmet'
import errorHandler from './middlewares/error-handler'
import AppError from './AppError'
import authRouter from './routes/auth.routes'

const app = express()

app.disable('x-powered-by')
app.disable('etag')

app.use(helmet.xContentTypeOptions())
app.use(helmet.xFrameOptions({ action: 'deny' }))
app.use(express.json())

app.use('/auth', authRouter)

app.use((req, res) => {
  throw new AppError(404, 'The requested resource was not found')
})

app.use(errorHandler)

export default app
