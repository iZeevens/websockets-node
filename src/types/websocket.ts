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

interface IroomData {
  data: '' | { indexRoom: number | string }
}

export { IauthData, IroomData, IshipData }
