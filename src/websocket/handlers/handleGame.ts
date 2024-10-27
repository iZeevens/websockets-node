import { IattackData, IrandomAttackData } from '../../types/websocket'
import { globalDataBase } from '../dataBase'
import { ShipData } from '../../types/dataBase'
import { sendGameWsUsers, MessageType } from '../utils/sendGameWsUsers'
import winPlayer from './handleWin'

const isShipHit = (ship: ShipData, x: number, y: number): boolean => {
  const { position, length, direction } = ship
  const endX = direction ? position.x : position.x + length - 1
  const endY = direction ? position.y + length - 1 : position.y

  return x >= position.x && x <= endX && y >= position.y && y <= endY
}

const missAroundShip = (ship: ShipData) => {
  const { position, length, direction } = ship
  const cells = []
  const startX = position.x - 1
  const startY = position.y - 1
  const endX = direction ? position.x : position.x + length - 1
  const endY = direction ? position.y + length - 1 : position.y

  console.log(length)
  console.log(`end postion x: ${endX}`)
  console.log(`end postion y: ${endY}`)

  for (let i = startX; i <= endX + 1; i++) {
    for (let j = startY; j <= endY + 1; j++) {
      const isShip =
        i >= position.x && i <= endX && j >= position.y && j <= endY

      if (i > 10 || j > 10 || i < 0 || j < 0 || isShip) {
        continue
      }

      cells.push({ x: i, y: j })
    }
  }

  return cells
}

const randomAttack = (payload: IrandomAttackData) => {
  const { gameId, indexPlayer } = payload
  const enemyPlayer = globalDataBase.game
    .get(Number(gameId))
    ?.players.find((player) => player.idPlayer !== indexPlayer)?.shots
  let coordinate
  let x, y

  if (!enemyPlayer) return

  do {
    x = Math.floor(Math.random() * 11)
    y = Math.floor(Math.random() * 11)
    coordinate = `${x},${y}`
  } while (enemyPlayer.has(coordinate))

  attack({ gameId, x, y, indexPlayer })
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

  if (!enemyPlayer || !currentPlayer) return

  if (enemyPlayer.shots.has(`${x},${y}`)) {
    return sendGameWsUsers(players, MessageType.TURN, {
      currentPlayer: indexPlayer,
    })
  }

  enemyPlayer.shots.add(`${x},${y}`)
  const hitShip = enemyPlayer.ships?.find((ship) => isShipHit(ship, x, y))

  if (hitShip) {
    hitShip.health -= 1
    const status = hitShip.health === 0 ? 'killed' : 'shot'

    if (status === 'killed') {
      if (hitShip.type === 'huge') {
        const cellMissHugeShip = missAroundShip(hitShip)
        cellMissHugeShip.forEach((cell) => {
          const { x, y } = cell

          sendGameWsUsers(players, MessageType.ATTACK, {
            position: {
              x,
              y,
            },
            currentPlayer: indexPlayer,
            status: 'miss',
          })
        })
      }
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

  sendGameWsUsers(players, MessageType.TURN, {
    currentPlayer: enemyPlayer.idPlayer,
  })
}

export { attack, randomAttack }
