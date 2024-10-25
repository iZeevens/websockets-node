import { WebSocket } from 'ws'
import { randomUUID } from 'node:crypto'
import { globalDataBase, currentUser } from '../dataBase'

let updateVersion = 1

const updateRoom = (ws: WebSocket) => {
  const roomsOnePlayer = new Map(
    Array.from(globalDataBase.room).filter(
      ([, value]) => value.roomUsers.length <= 1
    )
  )

  const roomData = Array.from(roomsOnePlayer).map(([roomId, room]) => ({
    roomId: roomId,
    roomUsers: room.roomUsers.map((user) => ({
      name: user.name,
      index: user.index,
    })),
  }))

  ws.send(
    JSON.stringify({
      type: 'update_room',
      data: JSON.stringify(roomData),
      id: updateVersion++,
    })
  )
}

const createRoom = (ws: WebSocket) => {
  const roomUniqId = randomUUID()
  const userIndex = globalDataBase.users.get(currentUser.name)?.index

  globalDataBase.room.set(roomUniqId, {
    roomId: roomUniqId,
    roomUsers: [
      {
        name: currentUser.name,
        index: userIndex!,
      },
    ],
  })

  const indexRoom = globalDataBase.room.size
  ws.send(
    JSON.stringify({
      type: 'create_room',
      data: '',
      id: indexRoom,
    })
  )
  updateRoom(ws)
  return
}

export { createRoom, updateRoom }
