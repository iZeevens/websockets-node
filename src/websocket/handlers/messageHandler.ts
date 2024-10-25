import { WebSocket } from 'ws'
import handleAuth from './handleAuth'

export const messageHandler = (ws: WebSocket, message: string) => {
  try {
    const parsedMessage = JSON.parse(message)
    switch (parsedMessage.type) {
      case 'reg':
        handleAuth(ws, JSON.parse(parsedMessage.data), parsedMessage.id)
    }
  } catch (error) {
    ws.send(JSON.stringify(error))
  }
}
