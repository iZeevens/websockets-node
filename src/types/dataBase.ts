import { WebSocket } from 'ws'

type RoomUser = {
  name: string
  index: number | string
  ws: WebSocket
}

type GamePlayer = {
  idPlayer: number | string
  ships?: ShipData[]
}

type ShipData = {
  position: {
    x: number
    y: number
  }
  direction: boolean
  length: number
  type: 'small' | 'medium' | 'large' | 'huge'
}

type UserData = {
  name: string
  password: string
  index: number
}

type RoomData = {
  roomId: number | string
  roomUsers: RoomUser[]
}

type GameData = {
  idGame: number | string
  players: GamePlayer[]
}

export { UserData, RoomData, GameData, ShipData }
