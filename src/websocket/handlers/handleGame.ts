import { IattackData } from '../../types/websocket'
import { globalDataBase } from '../dataBase'
import { GamePlayer, ShipData } from '../../types/dataBase'
import { sendGameWsUsers, MessageType } from '../utils/sendGameWsUsers'

const turn = (players: GamePlayer[], indexPlayer: number | string) => {
  sendGameWsUsers(players, MessageType.TURN, {
    currentPlayer: indexPlayer,
  })
}

const scoreMap: { [key: string]: number } = {
  small: 1,
  medium: 2,
  huge: 3,
  large: 4,
}

const winPlayer = (
  typeShip: string,
  currentPlayer: GamePlayer,
  players: GamePlayer[]
) => {
  const score = scoreMap[typeShip]
  if (currentPlayer && score) {
    currentPlayer.score += score

    if (currentPlayer.score >= 21) {
      sendGameWsUsers(players, MessageType.WIN, {
        winPlayer: currentPlayer.idPlayer,
      })
    }
  }
}

const isShipHit = (ship: ShipData, x: number, y: number): boolean => {
  const { position, length, direction } = ship
  const endX = direction ? position.x : position.x + length - 1
  const endY = direction ? position.y + length - 1 : position.y

  return x >= position.x && x <= endX && y >= position.y && y <= endY
}

const attack = (payload: IattackData) => {
  const { gameId, x, y, indexPlayer } = payload
  const game = globalDataBase.game.get(Number(gameId))

  if (!game) return

  const players = game.players
  const currentPlayer = players.find(
    (player) => player.idPlayer === indexPlayer
  )
  const enemyPlayer = players.find((player) => player.idPlayer !== indexPlayer)

  if (!enemyPlayer || enemyPlayer.shots.has(`${x},${y}`) || !currentPlayer) {
    return turn(players, indexPlayer)
  }

  enemyPlayer.shots.add(`${x},${y}`)
  const hitShip = enemyPlayer.ships?.find((ship) => isShipHit(ship, x, y))

  if (hitShip) {
    hitShip.health -= 1
    const status = hitShip.health === 0 ? 'killed' : 'shot'

    if (status === 'killed') {
      winPlayer(hitShip.type, currentPlayer, players)
    }

    sendGameWsUsers(players, MessageType.ATTACK, {
      position: {
        x,
        y,
      },
      currentPlayer: indexPlayer,
      status,
    })
  } else {
    sendGameWsUsers(players, MessageType.ATTACK, {
      position: {
        x,
        y,
      },
      currentPlayer: indexPlayer,
      status: 'miss',
    })
  }

  turn(players, enemyPlayer.idPlayer)
}

export { attack, turn }
