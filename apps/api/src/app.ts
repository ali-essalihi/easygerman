import express from 'express'
import helmet from 'helmet'

const app = express()

app.disable('x-powered-by')
app.disable('etag')

app.use(helmet.xContentTypeOptions())
app.use(helmet.xFrameOptions({ action: 'deny' }))
app.use(express.json())

app.use((req, res) => {
  res.end('Hello, world')
})

export default app
