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

  const hit = enemyPlayer?.ships?.find(
    (cell) => cell.position.x === x && cell.position.y === y
  )

  if (hit) {
    const health = hit.length
    console.log(health)

    if (health === 1) {
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
              status: 'killed',
            }),
            id: Date.now(),
          })
        )
      })
    } else {
      hit.length -= 1
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
              status: 'hit',
            }),
            id: Date.now(),
          })
        )
      })
    }
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
