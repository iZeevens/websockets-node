import { WebSocket } from 'ws'

type UserData = {
  name: string
  password: string
  index: number
}

type RoomUser = {
  name: string
  index: number | string
  ws: WebSocket
}

type RoomData = {
  roomId: number | string
  roomUsers: RoomUser[]
}

type GamePlayer = {
  idPlayer: number | string
}

type GameData = {
  idGame: number | string
  players: GamePlayer[]
}

export { UserData, RoomData, GameData }
