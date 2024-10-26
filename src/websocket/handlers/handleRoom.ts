import { WebSocket } from 'ws'
import { randomUUID } from 'node:crypto'
import { globalDataBase } from '../dataBase'

let updateVersion = 1
const idGame = 1

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

  if (globalDataBase.users.has(ws)) {
    globalDataBase.room.set(roomUniqId, {
      roomId: roomUniqId,
      roomUsers: [
        {
          name: globalDataBase.users.get(ws)?.name || '',
          index: globalDataBase.users.get(ws)?.index || '',
          ws: ws,
        },
      ],
    })
  }

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

const createGame = (roomId: number | string) => {
  const idPlayer1 = randomUUID()
  const idPlayer2 = randomUUID()
  const room = globalDataBase.room.get(roomId.toString())

  if (room) {
    const gamePlayers = room.roomUsers.map((player, index) => ({
      idPlayer: index === 0 ? idPlayer1 : idPlayer2,
      ws: player.ws,
    }))

    globalDataBase.game.set(idGame, { idGame, players: gamePlayers })

    room.roomUsers.forEach((user, index) => {
      user.ws.send(
        JSON.stringify({
          type: 'create_game',
          data: JSON.stringify({
            idGame,
            idPlayer: index === 0 ? idPlayer1 : idPlayer2,
          }),
          id: idGame,
        })
      )
    })
  }
}

const addUserToRoom = (ws: WebSocket, indexRoom: number | string) => {
  if (globalDataBase.room.has(indexRoom.toString())) {
    const room = globalDataBase.room.get(indexRoom.toString())

    if (room) {
      room.roomUsers.push({
        name: globalDataBase.users.get(ws)?.name || '',
        index: globalDataBase.users.get(ws)?.index || '',
        ws: ws,
      })
    }

    updateRoom(ws)
    createGame(indexRoom.toString())
    return
  }
}

export { createRoom, updateRoom, addUserToRoom }
