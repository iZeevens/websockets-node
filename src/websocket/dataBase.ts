import { UserData, RoomData, GameData } from '../types/dataBase'
import WebSocket from 'ws'

const globalDataBase = {
  users: new Map<WebSocket, UserData>(),
  room: new Map<string, RoomData>(),
  game: new Map<number, GameData>(),
}

export { globalDataBase }
