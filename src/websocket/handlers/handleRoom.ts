import { WebSocket } from 'ws'
import { randomUUID } from 'node:crypto'
import { globalDataBase } from '../dataBase'

const idGame = { id: 1 }

const updateRoom = () => {
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

  globalDataBase.users.forEach((user) => {
    const result = {
      type: 'update_room',
      data: JSON.stringify(roomData),
      id: Date.now(),
    }

    user.ws.send(JSON.stringify(result))
    console.log(result)
  })
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
  const result = {
    type: 'create_room',
    data: '',
    id: indexRoom,
  }
  ws.send(JSON.stringify(result))
  updateRoom()

  console.log(result)
  return indexRoom
}

const createGame = (roomId: number | string) => {
  const idPlayer1 = randomUUID()
  const idPlayer2 = randomUUID()
  roomId = roomId.toString()
  const room = globalDataBase.room.get(roomId)

  if (room) {
    const gamePlayers = room.roomUsers.map((player, index) => ({
      idPlayer: index === 0 ? idPlayer1 : idPlayer2,
      shots: new Set<string>(),
      score: 0,
      ws: player.ws,
    }))

    globalDataBase.game.set(idGame.id, {
      idGame: idGame.id,
      players: gamePlayers,
    })

    room.roomUsers.forEach((user, index) => {
      const result = {
        type: 'create_game',
        data: JSON.stringify({
          idGame,
          idPlayer: index === 0 ? idPlayer1 : idPlayer2,
        }),
        id: idGame,
      }

      user.ws.send(JSON.stringify(result))
      console.log(result)
    })

    globalDataBase.room.delete(roomId)
    updateRoom()
    idGame.id++
  }
}

const addUserToRoom = (ws: WebSocket, indexRoom: number | string) => {
  const room = globalDataBase.room.get(indexRoom.toString())

  if (room) {
    const userAlreadyInRoom = room.roomUsers[0].ws === ws

    if (!userAlreadyInRoom) {
      room.roomUsers.push({
        name: globalDataBase.users.get(ws)?.name || '',
        index: globalDataBase.users.get(ws)?.index || '',
        ws,
      })

      updateRoom()
      createGame(indexRoom.toString())
    }
  }
}

export { createRoom, updateRoom, addUserToRoom, idGame }
