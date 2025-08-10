import 'dotenv/config'
import './listeners'
import express from 'express'
import helmet from 'helmet'
import errorHandler from './middlewares/error-handler'
import AppError from './AppError'
import authRouter from './routes/auth.routes'
import hpp from 'hpp'
import cookieParser from 'cookie-parser'
import { authenticate } from './middlewares/auth.middlewares'
import cors from 'cors'
import env from './env'
import levelsRouter from './routes/levels.routes'
import topicsRouter from './routes/topics.routes'
import videosRouter from './routes/videos.routes'

const app = express()

app.disable('x-powered-by')
app.disable('etag')

app.use(helmet.xContentTypeOptions())
app.use(helmet.xFrameOptions({ action: 'deny' }))

app.use(
  cors({
    methods: ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE', 'PUT'],
    // Cache results of a preflight request for 1 day (86400 seconds)
    maxAge: 60 * 60 * 24,
    allowedHeaders: ['Content-Type'],
    credentials: true,
    exposedHeaders: [],
    origin: env.CLIENT_ORIGIN,
  })
)

app.use(hpp())
app.use(cookieParser())
app.use(express.json())

app.use(authenticate())

app.use('/auth', authRouter)
app.use('/levels', levelsRouter)
app.use('/topics', topicsRouter)
app.use('/videos', videosRouter)

app.use((req, res) => {
  throw new AppError(404, 'The requested resource was not found')
})

app.use(errorHandler)

export default app
