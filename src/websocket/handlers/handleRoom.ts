import { WebSocket } from 'ws'
import { randomUUID } from 'node:crypto'
// import { IroomData } from '../../types/websocket'
import { globalDataBase, currentUser } from '../dataBase'

const createRoom = (ws: WebSocket) => {
  const roomUniqId = randomUUID()
  const userIndex = globalDataBase.users.get(currentUser)?.index

  globalDataBase.room.set(roomUniqId, {
    roomId: roomUniqId,
    roomUsers: [
      {
        name: currentUser,
        index: userIndex!,
      },
    ],
  })

  const indexRoom = globalDataBase.room.size
  return ws.send(
    JSON.stringify({
      type: 'create_room',
      data: '',
      id: indexRoom,
    })
  )
}

export { createRoom }
