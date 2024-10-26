import { globalDataBase } from '../dataBase'
import { IshipData } from '../../types/websocket'

const startGame = (gameId: string) => {
  const currentSession = globalDataBase.game.get(Number(gameId))
  currentSession?.players.forEach((player) => {
    player.ws.send(
      JSON.stringify({
        type: 'start_game',
        data: JSON.stringify({
          ships: player.ships,
          currentPlayerIndex: player.idPlayer,
        }),
        id: gameId,
      })
    )
  })
}

const addShips = (payload: IshipData) => {
  const { gameId, indexPlayer, ships } = payload

  const currentSession = globalDataBase.game.get(Number(gameId))
  if (!currentSession) return

  const playerIndex = currentSession.players.findIndex(
    (player) => player.idPlayer === indexPlayer
  )

  if (playerIndex !== -1) {
    currentSession.players[playerIndex].ships = [
      ...(currentSession.players[playerIndex].ships || []),
      ...ships,
    ]
  }

  if (currentSession.players[0].ships && currentSession.players[1].ships) {
    startGame(gameId.toString())
  }
}

export { addShips }
