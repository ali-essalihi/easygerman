import app from './app'
import env from './env'

function bootServer() {
  const server = app.listen(env.PORT, '0.0.0.0', (err) => {
    if (err) throw err
    console.log('Listening on ' + JSON.stringify(server.address()))
  })
}

bootServer()
