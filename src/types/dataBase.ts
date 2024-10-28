import { WebSocket } from 'ws'

type RoomUser = {
  ws: WebSocket
  name: string
  index: number | string
}

type GamePlayer = {
  ws: WebSocket | null
  idPlayer: number | string
  shots: Set<string>
  score: number
  type?: 'bot'
  ships?: ShipData[]
}

type Position = { x: number; y: number }

type ShipData = {
  position: Position
  direction: boolean
  length: number
  type: string
  health: number
}

type UserData = {
  ws: WebSocket
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

export { UserData, RoomData, GameData, ShipData, GamePlayer }
