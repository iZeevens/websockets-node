import { WebSocketServer } from 'ws'
import { messageHandler } from './handlers/messageHandler'

const serverWebSocket = new WebSocketServer({ port: 3000 })

serverWebSocket.on('connection', (ws) => {
  console.log('New client was been created')
  ws.on('message', (message: string) => {
    console.log(`Message: ${message}`)
    messageHandler(ws, message)
  })

  ws.on('close', () => {
    console.log('Client disconnected')
  })
})

export { serverWebSocket }
