import { WebSocket } from 'ws'
import handleAuth from './handleAuth'
import { createRoom, addUserToRoom } from './handleRoom'
import { addShips } from './handleStartGame'

export const messageHandler = (ws: WebSocket, message: string) => {
  try {
    const parsedMessage = JSON.parse(message)
    switch (parsedMessage.type) {
      case 'reg':
        handleAuth(ws, JSON.parse(parsedMessage.data), parsedMessage.id)
        break
      case 'create_room':
        createRoom(ws)
        break
      case 'add_user_to_room':
        addUserToRoom(ws, JSON.parse(parsedMessage.data).indexRoom)
        break
      case 'add_ships':
        addShips(JSON.parse(parsedMessage.data))
        break
    }
  } catch (error) {
    ws.send(JSON.stringify(error))
  }
}
