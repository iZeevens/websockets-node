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

  if (enemyPlayer?.shots.has(`${x},${y}`) && currentPlayer) {
    return turn(game.players, indexPlayer)
  }

  const hitShip = enemyPlayer?.ships?.find((ship) => {
    const isVertical = ship.direction
    const startX = ship.position.x
    const startY = ship.position.y
    const endX = isVertical ? startX : startX + ship.length - 1
    const endY = isVertical ? startY + ship.length - 1 : startY

    enemyPlayer.shots?.add(`${x},${y}`)
    return x >= startX && x <= endX && y >= startY && y <= endY
  })

  if (hitShip) {
    hitShip.health -= 1

    const status = hitShip.health === 0 ? 'killed' : 'shot'

    if (status === 'killed' && currentPlayer) {
      switch (hitShip.type) {
        case 'small':
          currentPlayer.score += 1
          break
        case 'medium':
          currentPlayer.score += 2
          break
        case 'huge':
          currentPlayer.score += 3
          break
        case 'large':
          currentPlayer.score += 4
          break
      }

      console.log(currentPlayer.score)

      if (currentPlayer.score === 21) {
        game?.players.forEach((player) => {
          player.ws.send(
            JSON.stringify({
              type: 'finish',
              data: JSON.stringify({
                winPlayer: indexPlayer,
              }),
              id: Date.now(),
            })
          )
        })
      }
    }

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
