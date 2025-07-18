import app from './app'

function bootServer() {
  const server = app.listen(3000, '0.0.0.0', (err) => {
    if (err) throw err
    console.log('Listening on ' + JSON.stringify(server.address()))
  })
}

bootServer()
