import { IattackData } from '../../types/websocket'
import { globalDataBase } from '../dataBase'
import { GamePlayer } from '../../types/dataBase'

const turn = (players: GamePlayer[], indexPlayer: number | string) => {
  players.forEach((player) => {
    player.ws.send(
      JSON.stringify({
        type: 'turn',
        data: JSON.stringify({
          currentPlayer: indexPlayer,
        }),
        id: Date.now(),
      })
    )
  })
}

const attack = (payload: IattackData) => {
  const { gameId, x, y, indexPlayer } = payload
  const game = globalDataBase.game.get(Number(gameId))

  if (!game) return

  const currentPlayer = game.players.find(
    (player) => player.idPlayer === indexPlayer
  )
  const enemyPlayer = game.players.find(
    (player) => player.idPlayer !== indexPlayer
  )

  console.log(`Player: ${currentPlayer}`)
  console.log(`Enemy Player: ${enemyPlayer}`)

  const hitShip = enemyPlayer?.ships?.find((ship) => {
    const isVertical = ship.direction
    const startX = ship.position.x
    const startY = ship.position.y
    const endX = isVertical ? startX : startX + ship.length - 1
    const endY = isVertical ? startY + ship.length - 1 : startY

    return x >= startX && x <= endX && y >= startY && y <= endY
  })

  if (hitShip) {
    hitShip.health -= 1

    const status = hitShip.health === 0 ? 'killed' : 'shot'

    game?.players.forEach((player) => {
      player.ws.send(
        JSON.stringify({
          type: 'attack',
          data: JSON.stringify({
            position: {
              x,
              y,
            },
            currentPlayer: indexPlayer,
            status,
          }),
          id: Date.now(),
        })
      )
    })
  } else {
    game?.players.forEach((player) => {
      player.ws.send(
        JSON.stringify({
          type: 'attack',
          data: JSON.stringify({
            position: {
              x,
              y,
            },
            currentPlayer: indexPlayer,
            status: 'miss',
          }),
          id: Date.now(),
        })
      )
    })
  }

  if (game?.players && enemyPlayer?.idPlayer) {
    turn(game.players, enemyPlayer.idPlayer)
  }
}

export { attack, turn }
