import { ShipData } from './dataBase'

interface IauthData {
  name: string
  password: string
}

interface IshipData {
  gameId: number | string
  ships: ShipData[]
  indexPlayer: number | string
}

interface IattackData {
  gameId: number | string
  x: number
  y: number
  indexPlayer: number | string
}

interface IrandomAttackData {
  gameId: number | string
  indexPlayer: number | string
}

interface IroomData {
  data: '' | { indexRoom: number | string }
}

export { IauthData, IroomData, IshipData, IattackData, IrandomAttackData }
